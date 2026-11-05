import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowLeft, Check, PackagePlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateProduct } from '@/src/features/inventory/api/products'
import type { ProductResponse } from '@/src/features/inventory/types/products'

const productSchema = z.object( {
    sku: z.string().trim().min( 1, 'SKU is required' ).max( 64, 'SKU must be 64 characters or fewer' ),
    name: z.string().trim().min( 1, 'Product name is required' ).max( 255, 'Name must be 255 characters or fewer' ),
    description: z.string().max( 2000, 'Description must be 2,000 characters or fewer' ),
    category: z.string().max( 128, 'Category must be 128 characters or fewer' ),
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
    category: '',
    imageUrl: '',
    listPrice: '',
    priceCurrency: 'USD',
    taxGroupId: '',
    isLotTracked: false,
    isSerialized: false,
    hasExpiry: false,
}

const textInputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

function getErrorMessage ( error: unknown ) {
    if ( typeof error === 'object' && error !== null && 'response' in error ) {
        const response = error.response
        if ( typeof response === 'object' && response !== null && 'status' in response && response.status === 403 ) {
            return 'You do not have permission to create inventory products. Ask an administrator for inventory:write access.'
        }
        if ( typeof response === 'object' && response !== null && 'data' in response ) {
            const data = response.data
            if ( typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ) {
                return data.message
            }
        }
    }
    return 'The product could not be created. Check your connection and try again.'
}

export const ProductCreateForm = () => {
    const mutation = useCreateProduct()
    const [ createdProduct, setCreatedProduct ] = useState<ProductResponse | null>( null )
    const form = useForm<ProductFormValues>( {
        resolver: zodResolver( productSchema ),
        defaultValues,
    } )

    const onSubmit = ( values: ProductFormValues ) => {
        setCreatedProduct( null )
        mutation.mutate( {
            sku: values.sku.trim(),
            name: values.name.trim(),
            description: values.description.trim() || undefined,
            category: values.category.trim() || undefined,
            imageUrl: values.imageUrl.trim() || undefined,
            listPrice: Number( values.listPrice ),
            priceCurrency: values.priceCurrency.trim() || undefined,
            taxGroupId: values.taxGroupId.trim() || null,
            isLotTracked: values.isLotTracked,
            isSerialized: values.isSerialized,
            hasExpiry: values.hasExpiry,
        }, {
            onSuccess: product => {
                setCreatedProduct( product )
                form.reset( defaultValues )
            },
        } )
    }

    const trackingOptions = [
        { name: 'isLotTracked' as const, label: 'Track lots', description: 'Group stock by production or receipt lot.' },
        { name: 'isSerialized' as const, label: 'Track serial numbers', description: 'Identify each unit with a unique serial number.' },
        { name: 'hasExpiry' as const, label: 'Track expiry dates', description: 'Record expiration dates for this product.' },
    ]

    return (
        <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6">
                <Button asChild variant="pill-ghost" size="sm" className="mb-5 -ml-2 text-(--ink-soft) hover:bg-(--paper-2)">
                    <Link to="/dashboard"><ArrowLeft size={ 15 } />Dashboard</Link>
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

            { mutation.isError ? <div className="mb-5 rounded-xl border border-(--accent)/25 bg-(--accent-soft) p-4 text-sm text-(--accent-deep)" role="alert">{ getErrorMessage( mutation.error ) }</div> : null }

            <Form { ...form }>
                <form onSubmit={ form.handleSubmit( onSubmit ) } className="grid gap-5">
                    <Card>
                        <CardHeader>
                            <CardEyebrow>Product identity</CardEyebrow>
                            <CardTitle>Basic information</CardTitle>
                            <CardDescription>Give this product a unique SKU and a clear name.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <FormField control={ form.control } name="sku" render={ ( { field } ) => <FormItem><FormLabel>SKU <span className="text-(--accent)">*</span></FormLabel><FormControl><Input { ...field } className={ textInputClass } placeholder="WIDGET-001" maxLength={ 64 } disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                            <FormField control={ form.control } name="name" render={ ( { field } ) => <FormItem><FormLabel>Product name <span className="text-(--accent)">*</span></FormLabel><FormControl><Input { ...field } className={ textInputClass } placeholder="Standard Widget" maxLength={ 255 } disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                            <FormField control={ form.control } name="category" render={ ( { field } ) => <FormItem><FormLabel>Category</FormLabel><FormControl><Input { ...field } className={ textInputClass } placeholder="Widgets" maxLength={ 128 } disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                            <FormField control={ form.control } name="imageUrl" render={ ( { field } ) => <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input { ...field } className={ textInputClass } type="url" placeholder="https://example.com/widget.png" maxLength={ 2048 } disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                            <FormField control={ form.control } name="description" render={ ( { field } ) => <FormItem className="sm:col-span-2"><FormLabel>Description</FormLabel><FormControl><textarea { ...field } className="min-h-28 w-full resize-y rounded-[10px] border border-(--rule) bg-(--card) px-3.5 py-3 text-sm outline-none placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:shadow-[0_0_0_3px_rgb(23_22_15_/_6%)] disabled:cursor-not-allowed disabled:opacity-70" placeholder="Describe what this product is used for." maxLength={ 2000 } disabled={ mutation.isPending } /></FormControl><p className="text-right font-mono text-[10px] text-(--muted)">{ form.watch( 'description' ).length } / 2,000</p><FormMessage /></FormItem> } />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardEyebrow>Pricing & tax</CardEyebrow>
                            <CardTitle>How you sell it</CardTitle>
                            <CardDescription>Set the list price and optional tax group for this product.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <FormField control={ form.control } name="listPrice" render={ ( { field } ) => <FormItem><FormLabel>List price <span className="text-(--accent)">*</span></FormLabel><FormControl><Input { ...field } className={ textInputClass } type="number" inputMode="decimal" min="0" step="any" placeholder="0.00" disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                            <FormField control={ form.control } name="priceCurrency" render={ ( { field } ) => <FormItem><FormLabel>Price currency</FormLabel><FormControl><Input { ...field } className={ textInputClass } placeholder="USD" disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                            <FormField control={ form.control } name="taxGroupId" render={ ( { field } ) => <FormItem className="sm:col-span-2"><FormLabel>Tax group ID</FormLabel><FormControl><Input { ...field } className={ textInputClass } placeholder="Optional tax group UUID" disabled={ mutation.isPending } /></FormControl><FormMessage /></FormItem> } />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardEyebrow>Inventory tracking</CardEyebrow>
                            <CardTitle>Tracking options</CardTitle>
                            <CardDescription>Turn on the inventory details this product requires. All are off by default.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-3">
                            { trackingOptions.map( option => (
                                <FormField key={ option.name } control={ form.control } name={ option.name } render={ ( { field } ) => (
                                    <label className="flex cursor-pointer gap-3 rounded-xl border border-(--rule) bg-(--paper) p-3.5 transition-colors hover:border-(--muted-2) has-[:disabled]:cursor-not-allowed has-[:checked]:border-(--moss) has-[:checked]:bg-(--moss-soft)/45">
                                        <input ref={ field.ref } name={ field.name } type="checkbox" checked={ field.value } onBlur={ field.onBlur } onChange={ field.onChange } disabled={ mutation.isPending } className="mt-0.5 size-4 shrink-0 accent-(--moss)" />
                                        <span><span className="block text-sm font-medium">{ option.label }</span><span className="mt-1 block text-xs leading-relaxed text-(--muted)">{ option.description }</span></span>
                                    </label>
                                ) } />
                            ) ) }
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                            <Button asChild variant="pill-ghost" className="text-(--ink-soft) hover:bg-(--paper-2)"><Link to="/dashboard">Cancel</Link></Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ mutation.isPending }>
                                <PackagePlus size={ 16 } aria-hidden="true" />{ mutation.isPending ? 'Creating…' : 'Create product' }
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}
