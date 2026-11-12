import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Add01Icon } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useCreateProductVariant } from '@/src/features/inventory/api/productVariants'
import { getApiErrorMessage } from '@/src/lib/api-error'

type ProductVariantCreateSheetProps = Readonly<{
    productId: string
}>

type AttributeRow = {
    id: number
    key: string
    value: string
}

type FormValues = {
    code: string
    name: string
    skuSuffix: string
}

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

export function ProductVariantCreateSheet ( { productId }: ProductVariantCreateSheetProps ) {
    const [ open, setOpen ] = useState( false )
    const [ values, setValues ] = useState<FormValues>( { code: '', name: '', skuSuffix: '' } )
    const [ attributes, setAttributes ] = useState<AttributeRow[]>( [] )
    const [ validationError, setValidationError ] = useState<string | null>( null )
    const mutation = useCreateProductVariant( productId )

    const resetForm = () => {
        setValues( { code: '', name: '', skuSuffix: '' } )
        setAttributes( [] )
        setValidationError( null )
        mutation.reset()
    }

    const updateValue = ( key: keyof FormValues, value: string ) => {
        setValues( previous => ( { ...previous, [ key ]: value } ) )
        setValidationError( null )
    }

    const updateAttribute = ( id: number, key: 'key' | 'value', value: string ) => {
        setAttributes( previous => previous.map( row => row.id === id ? { ...row, [ key ]: value } : row ) )
        setValidationError( null )
    }

    const submit = ( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault()
        const code = values.code.trim()
        const name = values.name.trim()
        const pairs = attributes
            .map( row => ( { key: row.key.trim(), value: row.value.trim() } ) )
            .filter( row => row.key || row.value )
        const keys = pairs.map( row => row.key )

        if ( !code || !name ) {
            setValidationError( 'Code and name are required.' )
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
            code,
            name,
            skuSuffix: values.skuSuffix.trim() || undefined,
            attributes: Object.fromEntries( pairs.map( row => [ row.key, row.value ] ) ),
        }, {
            onSuccess: variant => {
                toast.success( 'Variant created', { description: `${ variant.name } is ready on this product.` } )
                setOpen( false )
                resetForm()
            },
            onError: error => toast.error( 'Could not create variant', { description: getApiErrorMessage( error, 'The variant could not be created. Check your connection and try again.', { 403: 'You do not have permission to create product variants. Ask an administrator for inventory:write access.' } ) } ),
        } )
    }

    const isPending = mutation.isPending

    return (
        <>
            <Button type="button" variant="pill-ghost" size="sm" className="rounded-lg bg-(--ink) text-(--paper) hover:bg-(--accent)" onClick={ () => { resetForm(); setOpen( true ) } }>
                <Add01Icon size={ 15 } aria-hidden="true" />Add variant
            </Button>
            <Sheet open={ open } onOpenChange={ nextOpen => { if ( !isPending ) { setOpen( nextOpen ); if ( !nextOpen ) resetForm() } } }>
                <SheetContent side="right" className="overflow-y-auto p-0 data-[side=right]:max-w-2xl" aria-describedby="variant-create-description">
                    <form onSubmit={ submit } className="flex min-h-full flex-col">
                        <SheetHeader>
                            <SheetTitle>Create variant</SheetTitle>
                            <SheetDescription id="variant-create-description">Add a variant to this product. Code and name are required.</SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 space-y-5 p-6">
                            { validationError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) px-3.5 py-3 text-sm text-(--accent-deep)">{ validationError }</p> : null }
                            { mutation.isError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) px-3.5 py-3 text-sm text-(--accent-deep)">{ getApiErrorMessage( mutation.error, 'The variant could not be created. Check your connection and try again.', { 403: 'You do not have permission to create product variants. Ask an administrator for inventory:write access.' } ) }</p> : null }

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="variant-create-code">Code <span className="text-(--accent)">*</span></FieldLabel>
                                    <Input id="variant-create-code" value={ values.code } onChange={ event => updateValue( 'code', event.target.value ) } className={ inputClass } maxLength={ 64 } placeholder="BLUE-L" required disabled={ isPending } />
                                </Field>
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="variant-create-name">Name <span className="text-(--accent)">*</span></FieldLabel>
                                    <Input id="variant-create-name" value={ values.name } onChange={ event => updateValue( 'name', event.target.value ) } className={ inputClass } maxLength={ 255 } placeholder="Blue, Large" required disabled={ isPending } />
                                </Field>
                            </div>

                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="variant-create-sku-suffix">SKU suffix</FieldLabel>
                                <Input id="variant-create-sku-suffix" value={ values.skuSuffix } onChange={ event => updateValue( 'skuSuffix', event.target.value ) } className={ inputClass } maxLength={ 64 } placeholder="-BL-L" disabled={ isPending } />
                                <FieldDescription>Appended to the product SKU when identifying this variant.</FieldDescription>
                            </Field>

                            <section aria-labelledby="variant-attributes-heading" className="space-y-3 rounded-xl border border-(--rule) p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 id="variant-attributes-heading" className="text-sm font-medium text-(--ink)">Attributes</h3>
                                        <p className="mt-0.5 text-xs text-(--muted)">Optional name and value pairs, such as color or size.</p>
                                    </div>
                                    <Button type="button" variant="pill-ghost" size="sm" className="shrink-0 border border-(--rule)" onClick={ () => setAttributes( previous => [ ...previous, { id: Date.now() + previous.length, key: '', value: '' } ] ) } disabled={ isPending }>
                                        <Add01Icon size={ 14 } aria-hidden="true" />Add attribute
                                    </Button>
                                </div>
                                { attributes.length ? (
                                    <div className="grid gap-3">
                                        { attributes.map( ( row, index ) => (
                                            <div key={ row.id } className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                                                <Input aria-label={ `Attribute ${ index + 1 } name` } value={ row.key } onChange={ event => updateAttribute( row.id, 'key', event.target.value ) } className={ inputClass } placeholder="color" disabled={ isPending } />
                                                <Input aria-label={ `Attribute ${ index + 1 } value` } value={ row.value } onChange={ event => updateAttribute( row.id, 'value', event.target.value ) } className={ inputClass } placeholder="blue" disabled={ isPending } />
                                                <Button type="button" variant="pill-ghost" size="sm" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ () => setAttributes( previous => previous.filter( item => item.id !== row.id ) ) } disabled={ isPending } aria-label={ `Remove attribute ${ index + 1 }` }>Remove</Button>
                                            </div>
                                        ) ) }
                                    </div>
                                ) : null }
                            </section>
                        </div>

                        <SheetFooter>
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ isPending }>Cancel</Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                { isPending ? <Spinner className="size-4 text-current" aria-label="Creating variant" /> : null }
                                { isPending ? 'Creating…' : 'Create variant' }
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
