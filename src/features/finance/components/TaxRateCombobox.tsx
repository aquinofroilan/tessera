import { useState } from 'react'
import { ArrowDown01Icon, Tick01Icon } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { TaxRateResponse } from '@/src/features/finance/types/taxGroups'
import { cn } from '@/lib/utils'

type TaxRateComboboxProps = Readonly<{
    id: string
    value: string[]
    rates: TaxRateResponse[]
    onValueChange: ( value: string[] ) => void
    onBlur?: () => void
    disabled?: boolean
    invalid?: boolean
}>

const rateFormatter = new Intl.NumberFormat( undefined, { maximumFractionDigits: 4 } )

export function TaxRateCombobox ( { id, value, rates, onValueChange, onBlur, disabled = false, invalid = false }: TaxRateComboboxProps ) {
    const [ open, setOpen ] = useState( false )
    const selectedRates = rates.filter( rate => value.includes( rate.id ) )

    let selectedLabel = 'Select tax rates'
    if ( selectedRates.length === 1 ) {
        selectedLabel = `${ selectedRates[ 0 ].name } · ${ selectedRates[ 0 ].code }`
    } else if ( selectedRates.length > 1 ) {
        selectedLabel = `${ selectedRates[ 0 ].name } + ${ selectedRates.length - 1 } more`
    }

    const toggleTaxRate = ( taxRateId: string ) => {
        const nextValue = value.includes( taxRateId )
            ? value.filter( selectedId => selectedId !== taxRateId )
            : [ ...value, taxRateId ]

        onValueChange( nextValue )
    }

    return (
        <Popover open={ open } onOpenChange={ setOpen }>
            <PopoverTrigger asChild>
                <Button
                    id={ id }
                    type="button"
                    role="combobox"
                    aria-label="Select tax rates"
                    aria-haspopup="listbox"
                    aria-expanded={ open }
                    aria-controls={ `${ id }-listbox` }
                    aria-invalid={ invalid }
                    disabled={ disabled }
                    onBlur={ onBlur }
                    variant="outline"
                    className="h-11 w-full justify-between rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-left text-sm font-normal text-(--ink) hover:border-(--ink) hover:bg-(--card) hover:text-(--ink)"
                >
                    <span className="truncate">{ selectedLabel }</span>
                    <ArrowDown01Icon className="ml-2 size-4 shrink-0 text-(--muted)" aria-hidden="true" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-(--radix-popover-trigger-width) overflow-hidden border border-(--rule) bg-(--card) p-0 text-(--ink)">
                <Command className="rounded-lg bg-(--card) text-(--ink)">
                    <CommandInput aria-label="Search tax rates" placeholder="Search tax rates…" />
                    <CommandList id={ `${ id }-listbox` } aria-multiselectable="true">
                        <CommandEmpty>No matching tax rates.</CommandEmpty>
                        <CommandGroup>
                            { rates.map( rate => {
                                const selected = value.includes( rate.id )
                                return (
                                    <CommandItem
                                        key={ rate.id }
                                        value={ `${ rate.name } ${ rate.code } ${ rate.authority }` }
                                        onSelect={ () => toggleTaxRate( rate.id ) }
                                    >
                                        <Tick01Icon className={ cn( 'size-4', selected ? 'opacity-100' : 'opacity-0' ) } aria-hidden="true" />
                                        <span className="min-w-0 flex-1 truncate">{ rate.name }</span>
                                        <span className="shrink-0 font-mono text-[10px] text-(--muted)">{ rate.code } · { rateFormatter.format( rate.percentage ) }%</span>
                                    </CommandItem>
                                )
                            } ) }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
