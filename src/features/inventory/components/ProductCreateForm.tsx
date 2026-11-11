import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { ArrowLeft, Check, PackagePlus } from '@/components/ui/hugeicons'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useProductCategories } from '@/src/features/inventory/api/productCategories'
import { useCreateProduct } from '@/src/features/inventory/api/products'
import type { ProductResponse } from '@/src/features/inventory/types/products'
import { getApiErrorMessage } from '@/src/lib/api-error'

const productSchema = z.object( {
    sku: z.string().trim().min( 1, 'SKU is required' ).max( 64, 'SKU must be 64 characters or fewer' ),
    name: z.string().trim().min( 1, 'Product name is required' ).max( 255, 'Name must be 255 characters or fewer' ),
    description: z.string().max( 2000, 'Description must be 2,000 characters or fewer' ),
    categoryId: z.string().refine( value => !value || z.uuid().safeParse( value ).success, 'Choose a valid product category' ),
    imageUrl: z.string().max( 2048, 'Image URL must be 2,048 characters or fewer' ).refine( value => !value.trim() || URL.canParse( value.trim() ), 'Enter a valid URL' ),
    listPrice: z.string().trim().min( 1, 'List price is required' ).refine( value => Number.isFinite( Number( value ) ) && Number( value ) >= 0, 'Enter a number that is zero or greater' ),
    priceCurrency: z.string(),
    taxGroupId: z.string().refine( value => !value.trim() || z.uuid().safeParse( value.trim() ).success, 'Enter a valid UUID' ),
    isLotTracked: z.boolean(),
    isSerialized: z.boolean(),
    hasExpiry: z.boolean(),
} )

type ProductFormValues = z.infer<typeof productSchema>

const defaultValues: ProductFormValues = {
    sku: '',
    name: '',
    description: '',
    categoryId: '',
    imageUrl: '',
    listPrice: '',
    priceCurrency: 'USD',
    taxGroupId: '',
    isLotTracked: false,
    isSerialized: false,
    hasExpiry: false,
}

const textInputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

export const ProductCreateForm = () => {
    const mutation = useCreateProduct()
    const categoriesQuery = useProductCategories()
    const [ createdProduct, setCreatedProduct ] = useState<ProductResponse | null>( null )
    const form = useForm( {
        defaultValues,
        validators: {
            onSubmit: productSchema,
        },
        onSubmit: ( { value } ) => {
            if ( mutation.isPending ) return
            setCreatedProduct( null )
            mutation.mutate( {
                sku: value.sku.trim(),
                name: value.name.trim(),
                description: value.description.trim() || undefined,
                categoryId: value.categoryId || undefined,
                imageUrl: value.imageUrl.trim() || undefined,
                listPrice: Number( value.listPrice ),
                priceCurrency: value.priceCurrency.trim() || undefined,
                taxGroupId: value.taxGroupId.trim() || null,
                isLotTracked: value.isLotTracked,
                isSerialized: value.isSerialized,
                hasExpiry: value.hasExpiry,
            }, {
                onSuccess: product => {
                    setCreatedProduct( product )
                    form.reset()
                },
            } )
        },
    } )

    const trackingOptions = [
        { name: 'isLotTracked' as const, label: 'Track lots', description: 'Group stock by production or receipt lot.' },
        { name: 'isSerialized' as const, label: 'Track serial numbers', description: 'Identify each unit with a unique serial number.' },
        { name: 'hasExpiry' as const, label: 'Track expiry dates', description: 'Record expiration dates for this product.' },
    ]

    return (
        <div className="w-full">
            <div className="mb-6">
                <Button asChild variant="pill-ghost" size="sm" className="mb-5 -ml-2 text-(--ink-soft) hover:bg-(--paper-2)">
                    <Link to="/inventory"><ArrowLeft size={ 15 } />Products</Link>
                </Button>
                <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory / Products / New</p>
                <h1 className="font-display text-[clamp(34px,4vw,48px)] font-light leading-tight tracking-[-.035em]">Add a product</h1>
                <p className="mt-2 max-w-2xl text-sm text-(--ink-soft)">Create a product master record to use across inventory, sales, and purchasing.</p>
            </div>

            { createdProduct ? (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-(--moss)/30 bg-(--moss-soft)/70 p-4 text-sm text-(--moss)" role="status" aria-live="polite">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-(--moss) text-(--paper)"><Check size={ 14 } /></span>
                    <div><p className="font-medium">Product created</p><p className="mt-0.5">{ createdProduct.name } ({ createdProduct.sku }) is ready in your inventory.</p></div>
                </div>
            ) : null }

            { mutation.isError ? <div className="mb-5 rounded-xl border border-(--accent)/25 bg-(--accent-soft) p-4 text-sm text-(--accent-deep)" role="alert">{ getApiErrorMessage( mutation.error, 'The product could not be created. Check your connection and try again.', { 403: 'You do not have permission to create inventory products. Ask an administrator for inventory:write access.' } ) }</div> : null }

            <form
                id="product-create-form"
                onSubmit={ event => {
                    event.preventDefault()
                    event.stopPropagation()
                    void form.handleSubmit()
                } }
                className="grid w-full gap-5"
            >
                <Card>
                    <CardHeader>
                        <CardEyebrow>Product identity</CardEyebrow>
                        <CardTitle>Basic information</CardTitle>
                        <CardDescription>Give this product a unique SKU and a clear name.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid gap-5 sm:grid-cols-2">
                            <form.Field name="sku" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ field.name }>SKU <span className="text-(--accent)">*</span></FieldLabel>
                                        <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } placeholder="WIDGET-001" maxLength={ 64 } disabled={ mutation.isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                            <form.Field name="name" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ field.name }>Product name <span className="text-(--accent)">*</span></FieldLabel>
                                        <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } placeholder="Standard Widget" maxLength={ 255 } disabled={ mutation.isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                            <form.Field name="categoryId" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ field.name }>Category</FieldLabel>
                                        <Select value={ field.state.value || undefined } onValueChange={ value => field.handleChange( value === '__none__' ? '' : value ?? '' ) } disabled={ mutation.isPending || categoriesQuery.isPending || categoriesQuery.isError }>
                                            <SelectTrigger id={ field.name } aria-label="Product category" aria-invalid={ isInvalid } className={ textInputClass }>
                                                <SelectValue placeholder={ categoriesQuery.isPending ? 'Loading categories…' : 'Select a category' } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="__none__">No category</SelectItem>
                                                { categoriesQuery.data?.map( category => <SelectItem key={ category.id } value={ category.id }>{ category.name }</SelectItem> ) }
                                            </SelectContent>
                                        </Select>
                                        { categoriesQuery.isError ? <FieldDescription className="text-(--accent-deep)">Categories could not be loaded. <button type="button" className="underline underline-offset-2" onClick={ () => { void categoriesQuery.refetch() } }>Retry</button></FieldDescription> : null }
                                        { !categoriesQuery.isPending && !categoriesQuery.isError && !categoriesQuery.data?.length ? <FieldDescription>No categories yet. <Link className="underline underline-offset-2" to="/inventory/settings/product-categories">Manage categories</Link></FieldDescription> : null }
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                            <form.Field name="imageUrl" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ field.name }>Image URL</FieldLabel>
                                        <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } type="url" placeholder="https://example.com/widget.png" maxLength={ 2048 } disabled={ mutation.isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                            <form.Field name="description" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid } className="sm:col-span-2">
                                        <FieldLabel htmlFor={ field.name }>Description</FieldLabel>
                                        <Textarea id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className="min-h-28 resize-y rounded-[10px] border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" placeholder="Describe what this product is used for." maxLength={ 2000 } disabled={ mutation.isPending } />
                                        <p className="text-right font-mono text-[10px] text-(--muted)">{ field.state.value.length } / 2,000</p>
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardEyebrow>Pricing &amp; tax</CardEyebrow>
                        <CardTitle>How you sell it</CardTitle>
                        <CardDescription>Set the list price and optional tax group for this product.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid gap-5 sm:grid-cols-2">
                            <form.Field name="listPrice" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ field.name }>List price <span className="text-(--accent)">*</span></FieldLabel>
                                        <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } type="number" inputMode="decimal" min="0" step="any" placeholder="0.00" disabled={ mutation.isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                            <form.Field name="priceCurrency" children={ field => (
                                <Field>
                                    <FieldLabel htmlFor={ field.name }>Price currency</FieldLabel>
                                    <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ textInputClass } placeholder="USD" disabled={ mutation.isPending } />
                                </Field>
                            ) } />
                            <form.Field name="taxGroupId" children={ field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid } className="sm:col-span-2">
                                        <FieldLabel htmlFor={ field.name }>Tax group ID</FieldLabel>
                                        <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } placeholder="Optional tax group UUID" disabled={ mutation.isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } } />
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardEyebrow>Inventory tracking</CardEyebrow>
                        <CardTitle>Tracking options</CardTitle>
                        <CardDescription>Turn on the inventory details this product requires. All are off by default.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup data-slot="checkbox-group" className="grid gap-3 sm:grid-cols-3">
                            { trackingOptions.map( option => (
                                <form.Field key={ option.name } name={ option.name } children={ field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field orientation="horizontal" data-invalid={ isInvalid } className={ `items-start rounded-xl border border-(--rule) bg-(--paper) p-3.5 transition-colors hover:border-(--muted-2) has-[:disabled]:cursor-not-allowed ${ field.state.value ? 'border-(--moss) bg-(--moss-soft)/45' : '' }` }>
                                            <Checkbox id={ field.name } name={ field.name } checked={ field.state.value } onBlur={ field.handleBlur } onCheckedChange={ checked => field.handleChange( checked === true ) } aria-invalid={ isInvalid } disabled={ mutation.isPending } className="mt-0.5" />
                                            <div className="grid gap-1">
                                                <FieldLabel htmlFor={ field.name } className="font-medium">{ option.label }</FieldLabel>
                                                <FieldDescription className="text-xs leading-relaxed text-(--muted)">{ option.description }</FieldDescription>
                                                { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                            </div>
                                        </Field>
                                    )
                                } } />
                            ) ) }
                        </FieldGroup>
                        <CardFooter className="-mx-5 mt-5 justify-end gap-2 border-t border-(--rule-soft) px-5 pt-4 pb-0">
                            <Button asChild variant="pill-ghost" className="text-(--ink-soft) hover:bg-(--paper-2)"><Link to="/inventory">Cancel</Link></Button>
                            <Button type="submit" variant="pill-ghost" form="product-create-form" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ mutation.isPending }>
                                { mutation.isPending ? <Spinner className="size-4 text-current" aria-label="Creating product" /> : <PackagePlus size={ 16 } aria-hidden="true" /> }
                                { mutation.isPending ? 'Creating…' : 'Create product' }
                            </Button>
                        </CardFooter>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
