import { useState } from 'react'
import { ArrowDown01Icon, Tick01Icon } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FieldDescription } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTaxGroups } from '@/src/features/finance/api/taxGroups'
import { getApiErrorMessage } from '@/src/lib/api-error'
import { cn } from '@/lib/utils'

type TaxGroupSelectorProps = Readonly<{
    id: string
    value: string
    onValueChange: ( value: string ) => void
    onBlur?: () => void
    className?: string
    disabled?: boolean
    invalid?: boolean
}>

const NO_TAX_GROUP = '__no_tax_group__'

export function TaxGroupSelector ( { id, value, onValueChange, onBlur, className, disabled = false, invalid = false }: TaxGroupSelectorProps ) {
    const [ open, setOpen ] = useState( false )
    const taxGroupsQuery = useTaxGroups()
    const taxGroups = taxGroupsQuery.data ?? []
    const selectedGroup = taxGroups.find( taxGroup => taxGroup.id === value )

    let selectedLabel = 'No tax group'
    if ( value && selectedGroup ) {
        selectedLabel = `${ selectedGroup.name } · ${ selectedGroup.code }`
    } else if ( value && taxGroupsQuery.isPending ) {
        selectedLabel = 'Loading saved tax group…'
    } else if ( value ) {
        selectedLabel = 'Current tax group unavailable'
    }

    const selectTaxGroup = ( taxGroupId: string ) => {
        onValueChange( taxGroupId === NO_TAX_GROUP ? '' : taxGroupId )
        setOpen( false )
    }

    return (
        <>
            <Popover open={ open } onOpenChange={ setOpen }>
                <PopoverTrigger asChild>
                    <Button
                        id={ id }
                        type="button"
                        role="combobox"
                        aria-haspopup="listbox"
                        aria-expanded={ open }
                        aria-controls={ `${ id }-listbox` }
                        aria-invalid={ invalid }
                        disabled={ disabled }
                        onBlur={ onBlur }
                        variant="outline"
                        className={ cn( 'w-full justify-between rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-left text-sm font-normal text-(--ink) hover:border-(--ink) hover:bg-(--card) hover:text-(--ink)', className ) }
                    >
                        <span className="truncate">{ selectedLabel }</span>
                        <ArrowDown01Icon className="ml-2 size-4 shrink-0 text-(--muted)" aria-hidden="true" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-(--radix-popover-trigger-width) overflow-hidden border border-(--rule) bg-(--card) p-0 text-(--ink)">
                    <Command className="rounded-lg bg-(--card) text-(--ink)">
                        <CommandInput aria-label="Search tax groups" placeholder="Search tax groups…" />
                        <CommandList id={ `${ id }-listbox` }>
                            <CommandEmpty>No matching tax groups.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem value="No tax group" onSelect={ () => selectTaxGroup( NO_TAX_GROUP ) }>
                                    <Tick01Icon className={ cn( 'size-4', !value ? 'opacity-100' : 'opacity-0' ) } aria-hidden="true" />
                                    No tax group
                                </CommandItem>
                                { taxGroupsQuery.isPending ? <CommandItem value="Loading tax groups" disabled>Loading tax groups…</CommandItem> : null }
                                { taxGroupsQuery.isError ? <CommandItem value="Tax groups unavailable" disabled>Tax groups are unavailable</CommandItem> : null }
                                { taxGroups.map( taxGroup => (
                                    <CommandItem
                                        key={ taxGroup.id }
                                        value={ `${ taxGroup.name } ${ taxGroup.code }` }
                                        disabled={ !taxGroup.isActive }
                                        onSelect={ () => selectTaxGroup( taxGroup.id ) }
                                    >
                                        <Tick01Icon className={ cn( 'size-4', value === taxGroup.id ? 'opacity-100' : 'opacity-0' ) } aria-hidden="true" />
                                        <span className="min-w-0 flex-1 truncate">{ taxGroup.name }</span>
                                        <span className="font-mono text-[10px] text-(--muted)">{ taxGroup.code }</span>
                                    </CommandItem>
                                ) ) }
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            { taxGroupsQuery.isPending ? <FieldDescription>Loading tax groups. You can continue without a tax group.</FieldDescription> : null }
            { taxGroupsQuery.isError ? (
                <FieldDescription className="text-(--accent-deep)">
                    { getApiErrorMessage( taxGroupsQuery.error, 'Tax groups could not be loaded. You can continue without a tax group.', { 403: 'You do not have permission to read tax groups. Ask an administrator for tax:read access.' } ) }{' '}
                    <button type="button" className="underline underline-offset-2" onClick={ () => { void taxGroupsQuery.refetch() } }>Retry</button>
                </FieldDescription>
            ) : null }
            { !taxGroupsQuery.isPending && !taxGroupsQuery.isError && !taxGroups.length ? <FieldDescription>No tax groups are available. You can continue without one.</FieldDescription> : null }
        </>
    )
}
