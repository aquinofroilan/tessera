import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus, X } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useUpdateProductVariant } from '@/src/features/inventory/api/productVariants'
import type { ProductVariantResponse } from '@/src/features/inventory/types/productVariants'
import { formatVariantAttribute } from '@/src/features/inventory/utils/formatVariantAttribute'
import { getApiErrorMessage } from '@/src/lib/api-error'

type ProductVariantEditSheetProps = Readonly<{
    productId: string
    variant: ProductVariantResponse
}>

type AttributeRow = {
    id: number
    key: string
    value: string
    originalValue?: unknown
    hasOriginalValue: boolean
    valueChanged: boolean
}

type FormValues = {
    name: string
    skuSuffix: string
    isActive: boolean
}

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

function getInitialValues ( variant: ProductVariantResponse ): FormValues {
    return {
        name: variant.name,
        skuSuffix: variant.skuSuffix ?? '',
        isActive: variant.isActive,
    }
}

function getInitialAttributes ( variant: ProductVariantResponse ): AttributeRow[] {
    return Object.entries( variant.attributes ?? {} ).map( ( [ key, value ], index ) => ( {
        id: index + 1,
        key,
        value: formatVariantAttribute( value ),
        originalValue: value,
        hasOriginalValue: true,
        valueChanged: false,
    } ) )
}

export function ProductVariantEditSheet ( { productId, variant }: ProductVariantEditSheetProps ) {
    const [ open, setOpen ] = useState( false )
    const [ values, setValues ] = useState( () => getInitialValues( variant ) )
    const [ attributes, setAttributes ] = useState( () => getInitialAttributes( variant ) )
    const [ validationError, setValidationError ] = useState<string | null>( null )
    const mutation = useUpdateProductVariant( productId, variant.id )
    const isPending = mutation.isPending

    const resetForm = () => {
        setValues( getInitialValues( variant ) )
        setAttributes( getInitialAttributes( variant ) )
        setValidationError( null )
        mutation.reset()
    }

    const updateValue = <K extends keyof FormValues>( key: K, value: FormValues[K] ) => {
        setValues( previous => ( { ...previous, [ key ]: value } ) )
        setValidationError( null )
    }

    const updateAttribute = ( id: number, key: 'key' | 'value', value: string ) => {
        setAttributes( previous => previous.map( row => row.id === id ? { ...row, [ key ]: value, ...( key === 'value' ? { valueChanged: true } : {} ) } : row ) )
        setValidationError( null )
    }

    const submit = ( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault()
        const name = values.name.trim()
        const pairs = attributes
            .map( row => ( { ...row, key: row.key.trim(), value: row.value.trim() } ) )
            .filter( row => row.key || row.value )
        const keys = pairs.map( row => row.key )

        if ( !name ) {
            setValidationError( 'Variant name is required.' )
            return
        }
        if ( pairs.some( row => !row.key || !row.value ) ) {
            setValidationError( 'Enter both a name and value for each attribute, or remove the empty row.' )
            return
        }
        if ( new Set( keys ).size !== keys.length ) {
            setValidationError( 'Attribute names must be unique.' )
            return
        }

        mutation.mutate( {
            name,
            skuSuffix: values.skuSuffix.trim() || null,
            attributes: Object.fromEntries( pairs.map( row => [ row.key, row.hasOriginalValue && !row.valueChanged ? row.originalValue : row.value ] ) ),
            isActive: values.isActive,
        }, {
            onSuccess: updated => {
                toast.success( 'Variant updated', { description: `${ updated.name } has been saved.` } )
                setOpen( false )
            },
            onError: error => toast.error( 'Could not update variant', { description: getApiErrorMessage( error, 'Variant changes could not be saved. Check your connection and try again.', { 403: 'You do not have permission to edit product variants. Ask an administrator for inventory:write access.' } ) } ),
        } )
    }

    return (
        <>
            <Button type="button" variant="pill-ghost" size="sm" className="mt-5 rounded-lg bg-(--ink) text-(--paper) hover:bg-(--accent) sm:mt-0" onClick={ () => { resetForm(); setOpen( true ) } }>
                <Pencil size={ 15 } aria-hidden="true" />Edit variant
            </Button>
            <Sheet open={ open } onOpenChange={ nextOpen => { if ( !isPending ) { setOpen( nextOpen ); if ( !nextOpen ) resetForm() } } }>
                <SheetContent side="right" className="overflow-y-auto p-0 data-[side=right]:max-w-2xl" aria-describedby="variant-edit-description">
                    <form onSubmit={ submit } className="flex min-h-full flex-col">
                        <SheetHeader>
                            <p className="font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory / Variant</p>
                            <SheetTitle>Edit variant</SheetTitle>
                            <SheetDescription id="variant-edit-description">Update variant details for { variant.name }.</SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 space-y-5 p-6">
                            { validationError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) px-3.5 py-3 text-sm text-(--accent-deep)">{ validationError }</p> : null }
                            { mutation.isError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) px-3.5 py-3 text-sm text-(--accent-deep)">{ getApiErrorMessage( mutation.error, 'Variant changes could not be saved. Check your connection and try again.', { 403: 'You do not have permission to edit product variants. Ask an administrator for inventory:write access.' } ) }</p> : null }

                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="variant-edit-code">Code</FieldLabel>
                                <Input id="variant-edit-code" value={ variant.code } className={ inputClass } readOnly aria-readonly="true" />
                                <FieldDescription>Variant code cannot be changed.</FieldDescription>
                            </Field>

                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="variant-edit-name">Name <span className="text-(--accent)">*</span></FieldLabel>
                                <Input id="variant-edit-name" value={ values.name } onChange={ event => updateValue( 'name', event.target.value ) } className={ inputClass } maxLength={ 255 } required disabled={ isPending } />
                            </Field>

                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="variant-edit-sku-suffix">SKU suffix</FieldLabel>
                                <Input id="variant-edit-sku-suffix" value={ values.skuSuffix } onChange={ event => updateValue( 'skuSuffix', event.target.value ) } className={ inputClass } maxLength={ 64 } placeholder="-BL-L" disabled={ isPending } />
                            </Field>

                            <section aria-labelledby="variant-edit-attributes-heading" className="space-y-3 rounded-xl border border-(--rule) p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 id="variant-edit-attributes-heading" className="text-sm font-medium text-(--ink)">Attributes</h3>
                                        <p className="mt-0.5 text-xs text-(--muted)">Edit the name and value pairs for this variant.</p>
                                    </div>
                                    <Button type="button" variant="pill-ghost" size="sm" className="shrink-0 border border-(--rule)" onClick={ () => setAttributes( previous => [ ...previous, { id: Date.now() + previous.length, key: '', value: '', hasOriginalValue: false, valueChanged: false } ] ) } disabled={ isPending }>
                                        <Plus size={ 14 } aria-hidden="true" />Add attribute
                                    </Button>
                                </div>
                                { attributes.length ? (
                                    <div className="grid gap-3">
                                        { attributes.map( ( row, index ) => (
                                            <div key={ row.id } className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                                                <Input aria-label={ `Attribute ${ index + 1 } name` } value={ row.key } onChange={ event => updateAttribute( row.id, 'key', event.target.value ) } className={ inputClass } placeholder="color" disabled={ isPending } />
                                                <Input aria-label={ `Attribute ${ index + 1 } value` } value={ row.value } onChange={ event => updateAttribute( row.id, 'value', event.target.value ) } className={ inputClass } placeholder="blue" disabled={ isPending } />
                                                <Button type="button" variant="pill-ghost" size="icon-sm" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ () => setAttributes( previous => previous.filter( item => item.id !== row.id ) ) } disabled={ isPending } aria-label={ `Remove attribute ${ index + 1 }` }><X size={ 14 } aria-hidden="true" /></Button>
                                            </div>
                                        ) ) }
                                    </div>
                                ) : <p className="text-xs text-(--muted)">No attributes. Add a name and value pair if needed.</p> }
                            </section>

                            <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-(--ink)">Variant active</p>
                                    <p className="mt-0.5 text-xs text-(--muted)">Inactive variants are hidden from active inventory workflows.</p>
                                </div>
                                <Switch checked={ values.isActive } onCheckedChange={ checked => updateValue( 'isActive', checked ) } disabled={ isPending } aria-label="Variant active" />
                            </div>
                        </div>

                        <SheetFooter>
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ isPending }>Cancel</Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                { isPending ? <Spinner className="size-4 text-current" aria-label="Saving variant" /> : null }
                                { isPending ? 'Saving…' : 'Save changes' }
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
