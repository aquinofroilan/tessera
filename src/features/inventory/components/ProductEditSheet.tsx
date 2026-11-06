import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Pencil } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useProductCategories } from '@/src/features/inventory/api/productCategories'
import { useUpdateProduct } from '@/src/features/inventory/api/products'
import type { ProductResponse } from '@/src/features/inventory/types/products'

type ProductEditSheetProps = {
    product: ProductResponse
}

type ProductFormValues = {
    sku: string
    name: string
    categoryId: string
    description: string
    imageUrl: string
    listPrice: string
    priceCurrency: string
    taxGroupId: string
    isLotTracked: boolean
    isSerialized: boolean
    hasExpiry: boolean
    isActive: boolean
}

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

function getInitialValues ( product: ProductResponse ): ProductFormValues {
    return {
        sku: product.sku,
        name: product.name,
        categoryId: product.categoryId ?? '',
        description: product.description ?? '',
        imageUrl: product.imageUrl ?? '',
        listPrice: String( product.listPrice ),
        priceCurrency: product.priceCurrency ?? '',
        taxGroupId: product.taxGroupId ?? '',
        isLotTracked: product.isLotTracked,
        isSerialized: product.isSerialized,
        hasExpiry: product.hasExpiry,
        isActive: product.isActive,
    }
}

function getErrorMessage ( error: unknown ) {
    if ( typeof error === 'object' && error !== null && 'response' in error ) {
        const response = error.response
        if ( typeof response === 'object' && response !== null && 'data' in response ) {
            const data = response.data
            if ( typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ) return data.message
        }
    }
    return 'Product changes could not be saved. Check your connection and try again.'
}

export const ProductEditSheet = ( { product }: ProductEditSheetProps ) => {
    const [ open, setOpen ] = useState( false )
    const [ values, setValues ] = useState( () => getInitialValues( product ) )
    const [ validationError, setValidationError ] = useState<string | null>( null )
    const categoriesQuery = useProductCategories( { activeOnly: false } )
    const updateMutation = useUpdateProduct()
    const isPending = updateMutation.isPending

    const openEditor = () => {
        setValues( getInitialValues( product ) )
        setValidationError( null )
        updateMutation.reset()
        setOpen( true )
    }

    const updateValue = <K extends keyof ProductFormValues>( key: K, value: ProductFormValues[K] ) => {
        setValues( previous => ( { ...previous, [ key ]: value } ) )
        setValidationError( null )
    }

    const submit = ( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault()
        const sku = values.sku.trim()
        const name = values.name.trim()
        const listPrice = Number( values.listPrice )

        if ( !sku || !name ) {
            setValidationError( 'SKU and product name are required.' )
            return
        }
        if ( !Number.isFinite( listPrice ) || listPrice < 0 ) {
            setValidationError( 'Enter a valid list price of zero or more.' )
            return
        }

        updateMutation.mutate( {
            id: product.id,
            sku,
            name,
            categoryId: values.categoryId || null,
            description: values.description.trim() || null,
            imageUrl: values.imageUrl.trim() || null,
            listPrice,
            priceCurrency: values.priceCurrency.trim().toUpperCase() || null,
            taxGroupId: values.taxGroupId.trim() || null,
            isLotTracked: values.isLotTracked,
            isSerialized: values.isSerialized,
            hasExpiry: values.hasExpiry,
            isActive: values.isActive,
        }, {
            onSuccess: updated => {
                toast.success( 'Product updated', { description: `${ updated.name } has been saved.` } )
                setOpen( false )
            },
            onError: error => toast.error( 'Could not update product', { description: getErrorMessage( error ) } ),
        } )
    }

    const availableCategories = categoriesQuery.data ?? []
    const categoryIsMissing = values.categoryId && !availableCategories.some( category => category.id === values.categoryId )

    return (
        <>
            <Button type="button" variant="pill-ghost" size="sm" className="mt-5 rounded-lg bg-(--ink) text-(--paper) hover:bg-(--accent) sm:mt-0" onClick={ openEditor }>
                <Pencil size={ 15 } aria-hidden="true" />Edit product
            </Button>
            <Sheet open={ open } onOpenChange={ nextOpen => { if ( !isPending ) setOpen( nextOpen ) } }>
                <SheetContent side="right" className="overflow-y-auto p-0 data-[side=right]:max-w-2xl" aria-describedby="product-edit-description">
                    <form onSubmit={ submit } className="flex min-h-full flex-col">
                        <SheetHeader>
                            <p className="font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory / Product</p>
                            <SheetTitle>Edit product</SheetTitle>
                            <SheetDescription id="product-edit-description">Update product master data for { product.name }.</SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 space-y-5 p-6">
                            { validationError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) px-3.5 py-3 text-sm text-(--accent-deep)">{ validationError }</p> : null }
                            { updateMutation.isError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) px-3.5 py-3 text-sm text-(--accent-deep)">{ getErrorMessage( updateMutation.error ) }</p> : null }

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="product-edit-sku">SKU <span className="text-(--accent)">*</span></FieldLabel>
                                    <Input id="product-edit-sku" value={ values.sku } onChange={ event => updateValue( 'sku', event.target.value ) } className={ inputClass } maxLength={ 64 } required disabled={ isPending } />
                                </Field>
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="product-edit-name">Product name <span className="text-(--accent)">*</span></FieldLabel>
                                    <Input id="product-edit-name" value={ values.name } onChange={ event => updateValue( 'name', event.target.value ) } className={ inputClass } maxLength={ 255 } required disabled={ isPending } />
                                </Field>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="product-edit-category">Category</FieldLabel>
                                    <Select value={ values.categoryId || '__none__' } onValueChange={ value => updateValue( 'categoryId', !value || value === '__none__' ? '' : value ) } disabled={ isPending || categoriesQuery.isPending || categoriesQuery.isError }>
                                        <SelectTrigger id="product-edit-category" className={ inputClass } aria-label="Product category">
                                            <SelectValue placeholder={ categoriesQuery.isPending ? 'Loading categories…' : 'Select a category' } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__none__">No category</SelectItem>
                                            { categoryIsMissing ? <SelectItem value={ values.categoryId }>Current category unavailable</SelectItem> : null }
                                            { availableCategories.map( category => <SelectItem key={ category.id } value={ category.id }>{ category.name }{ category.isActive ? '' : ' (Inactive)' }</SelectItem> ) }
                                        </SelectContent>
                                    </Select>
                                    { categoriesQuery.isError ? <FieldDescription className="text-(--accent-deep)">Categories are unavailable. The current category will be preserved.</FieldDescription> : null }
                                </Field>
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="product-edit-image-url">Image URL</FieldLabel>
                                    <Input id="product-edit-image-url" type="url" value={ values.imageUrl } onChange={ event => updateValue( 'imageUrl', event.target.value ) } className={ inputClass } maxLength={ 2048 } placeholder="https://example.com/product.png" disabled={ isPending } />
                                </Field>
                            </div>

                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="product-edit-description-field">Description</FieldLabel>
                                <Textarea id="product-edit-description-field" value={ values.description } onChange={ event => updateValue( 'description', event.target.value ) } className="min-h-24 resize-y rounded-[10px] border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" maxLength={ 2000 } disabled={ isPending } />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="product-edit-list-price">List price <span className="text-(--accent)">*</span></FieldLabel>
                                    <Input id="product-edit-list-price" type="number" inputMode="decimal" min="0" step="any" value={ values.listPrice } onChange={ event => updateValue( 'listPrice', event.target.value ) } className={ inputClass } required disabled={ isPending } />
                                </Field>
                                <Field className={ fieldClass }>
                                    <FieldLabel htmlFor="product-edit-currency">Currency</FieldLabel>
                                    <Input id="product-edit-currency" value={ values.priceCurrency } onChange={ event => updateValue( 'priceCurrency', event.target.value ) } className={ inputClass } maxLength={ 3 } placeholder="USD" disabled={ isPending } />
                                </Field>
                            </div>

                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="product-edit-tax-group">Tax group ID</FieldLabel>
                                <Input id="product-edit-tax-group" value={ values.taxGroupId } onChange={ event => updateValue( 'taxGroupId', event.target.value ) } className={ inputClass } maxLength={ 128 } disabled={ isPending } />
                            </Field>

                            <fieldset className="grid gap-3 rounded-xl border border-(--rule) p-4 sm:grid-cols-2">
                                <legend className="px-1 font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">Tracking options</legend>
                                { ( [
                                    [ 'isLotTracked', 'Track lots' ],
                                    [ 'isSerialized', 'Track serial numbers' ],
                                    [ 'hasExpiry', 'Track expiry dates' ],
                                ] as const ).map( ( [ key, label ] ) => (
                                    <label key={ key } className="flex items-center gap-2.5 text-sm text-(--ink-soft)">
                                        <Checkbox checked={ values[ key ] } onCheckedChange={ checked => updateValue( key, checked === true ) } disabled={ isPending } />
                                        { label }
                                    </label>
                                ) ) }
                            </fieldset>

                            <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-(--ink)">Product active</p>
                                    <p className="mt-0.5 text-xs text-(--muted)">Inactive products are hidden from active inventory workflows.</p>
                                </div>
                                <Switch checked={ values.isActive } onCheckedChange={ checked => updateValue( 'isActive', checked ) } disabled={ isPending } aria-label="Product active" />
                            </div>
                        </div>

                        <SheetFooter>
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ isPending }>Cancel</Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                { isPending ? <Spinner className="size-4 text-current" aria-label="Saving product" /> : null }
                                { isPending ? 'Saving…' : 'Save changes' }
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
