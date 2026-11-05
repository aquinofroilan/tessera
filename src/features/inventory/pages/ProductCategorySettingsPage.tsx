import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, Pencil, Plus, RotateCcw, Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useCreateProductCategory, useDeactivateProductCategory, useProductCategories, useUpdateProductCategory } from '@/src/features/inventory/api/productCategories'
import type { ProductCategoryResponse } from '@/src/features/inventory/types/productCategories'

const categorySchema = z.object( {
    name: z.string().trim().min( 1, 'Category name is required' ).max( 128, 'Category name must be 128 characters or fewer' ),
    description: z.string().max( 2000, 'Description must be 2,000 characters or fewer' ),
} )

type CategoryValues = z.infer<typeof categorySchema>

const emptyCategory: CategoryValues = { name: '', description: '' }
const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

function getCategoryErrorMessage ( error: unknown ) {
    if ( typeof error === 'object' && error !== null && 'response' in error ) {
        const response = error.response
        if ( typeof response === 'object' && response !== null && 'status' in response && response.status === 403 ) {
            return 'You do not have permission to manage product categories. Ask an administrator for inventory:write access.'
        }
        if ( typeof response === 'object' && response !== null && 'data' in response ) {
            const data = response.data
            if ( typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ) return data.message
        }
    }
    return 'Product categories could not be loaded. Check your connection and try again.'
}

type CategoryEditorProps = {
    category?: ProductCategoryResponse
    onSaved: () => void
    onCancel: () => void
}

const ProductCategoryEditor = ( { category, onSaved, onCancel }: CategoryEditorProps ) => {
    const createMutation = useCreateProductCategory()
    const updateMutation = useUpdateProductCategory()
    const isPending = createMutation.isPending || updateMutation.isPending
    const form = useForm( {
        defaultValues: category ? { name: category.name, description: category.description ?? '' } : emptyCategory,
        validators: { onSubmit: categorySchema },
        onSubmit: ( { value } ) => {
            const request = {
                name: value.name.trim(),
                description: value.description.trim(),
            }

            if ( category ) {
                updateMutation.mutate( { id: category.id, ...request }, {
                    onSuccess: () => {
                        toast.success( 'Category updated', { description: `${ request.name } is ready to use.` } )
                        onSaved()
                    },
                    onError: error => toast.error( 'Could not update category', { description: getCategoryErrorMessage( error ) } ),
                } )
            } else {
                createMutation.mutate( { ...request, description: request.description || undefined }, {
                    onSuccess: created => {
                        toast.success( 'Category created', { description: `${ created.name } is ready to use.` } )
                        form.reset()
                        onSaved()
                    },
                    onError: error => toast.error( 'Could not create category', { description: getCategoryErrorMessage( error ) } ),
                } )
            }
        },
    } )

    return (
        <Card>
            <CardHeader>
                <CardEyebrow>{ category ? 'Edit category' : 'Category setup' }</CardEyebrow>
                <CardTitle>{ category ? 'Update category details' : 'Add a product category' }</CardTitle>
                <CardDescription>Categories are shared across products in this organization.</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={ event => {
                        event.preventDefault()
                        event.stopPropagation()
                        void form.handleSubmit()
                    } }
                    className="grid gap-5"
                >
                    <FieldGroup className="grid gap-5 sm:grid-cols-2">
                        <form.Field name="name" children={ field => {
                            const isInvalid = field.state.meta.errors.length > 0
                            return (
                                <Field data-invalid={ isInvalid }>
                                    <FieldLabel htmlFor={ field.name }>Category name <span className="text-(--accent)">*</span></FieldLabel>
                                    <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } placeholder="Hardware" maxLength={ 128 } disabled={ isPending } />
                                    { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                </Field>
                            )
                        } } />
                        <form.Field name="description" children={ field => {
                            const isInvalid = field.state.meta.errors.length > 0
                            return (
                                <Field data-invalid={ isInvalid }>
                                    <FieldLabel htmlFor={ field.name }>Description</FieldLabel>
                                    <Textarea id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className="min-h-11 resize-y rounded-[10px] border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" placeholder="Optional note about this category." maxLength={ 2000 } disabled={ isPending } />
                                    <FieldDescription>{ field.state.value.length } / 2,000</FieldDescription>
                                    { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                </Field>
                            )
                        } } />
                    </FieldGroup>
                    <div className="flex justify-end gap-2">
                        { category ? <Button type="button" variant="pill-ghost" onClick={ onCancel } disabled={ isPending }><X size={ 15 } />Cancel</Button> : null }
                        <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                            { isPending ? <Spinner className="size-4 text-current" aria-label="Saving category" /> : category ? <Check size={ 15 } /> : <Plus size={ 15 } /> }
                            { isPending ? 'Saving…' : category ? 'Save category' : 'Add category' }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export const ProductCategorySettingsPage = () => {
    const categoriesQuery = useProductCategories( { activeOnly: false } )
    const deactivateMutation = useDeactivateProductCategory()
    const updateMutation = useUpdateProductCategory()
    const [ editingCategory, setEditingCategory ] = useState<ProductCategoryResponse | null>( null )
    const [ confirmingDeactivate, setConfirmingDeactivate ] = useState<string | null>( null )

    useEffect( () => {
        const toastId = 'inventory-product-categories-management-fetch-error'
        if ( categoriesQuery.isError ) {
            toast.error( 'Could not load product categories', {
                id: toastId,
                description: getCategoryErrorMessage( categoriesQuery.error ),
                action: { label: 'Retry', onClick: () => { void categoriesQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ categoriesQuery.error, categoriesQuery.isError, categoriesQuery.refetch ] )

    const deactivateCategory = ( category: ProductCategoryResponse ) => {
        deactivateMutation.mutate( category.id, {
            onSuccess: () => {
                setConfirmingDeactivate( null )
                toast.success( 'Category deactivated', { description: `${ category.name } will no longer be available for new products.` } )
            },
            onError: error => toast.error( 'Could not deactivate category', { description: getCategoryErrorMessage( error ) } ),
        } )
    }

    const reactivateCategory = ( category: ProductCategoryResponse ) => {
        updateMutation.mutate( { id: category.id, isActive: true }, {
            onSuccess: () => toast.success( 'Category reactivated', { description: `${ category.name } is available for new products again.` } ),
            onError: error => toast.error( 'Could not reactivate category', { description: getCategoryErrorMessage( error ) } ),
        } )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                <div className="mb-7 border-b border-(--rule) pb-6">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory / Settings</p>
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Product categories</h1>
                    <p className="mt-2.5 text-[15px] text-(--ink-soft)">Keep product categories consistent across your organization.</p>
                </div>

                <div className="grid w-full gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.4fr)]">
                    <ProductCategoryEditor key={ editingCategory?.id ?? 'new-category' } category={ editingCategory ?? undefined } onSaved={ () => setEditingCategory( null ) } onCancel={ () => setEditingCategory( null ) } />

                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardEyebrow>Organization list</CardEyebrow>
                            <CardTitle>Categories</CardTitle>
                            <CardDescription>{ categoriesQuery.data?.length ?? 0 } total, including inactive categories.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            { categoriesQuery.isPending ? (
                                <div className="flex items-center justify-center gap-2 p-10 text-sm text-(--muted)" role="status" aria-live="polite"><Spinner className="size-4 text-(--accent)" aria-label="Loading categories" />Loading categories…</div>
                            ) : categoriesQuery.isError ? (
                                <div className="p-8 text-center text-sm text-(--muted)">Category data is unavailable. Use the retry action in the notification to try again.</div>
                            ) : categoriesQuery.data?.length ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Category</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        { categoriesQuery.data.map( category => (
                                            <TableRow key={ category.id }>
                                                <TableCell className="font-medium">{ category.name }</TableCell>
                                                <TableCell className="max-w-[32ch] truncate text-(--ink-soft)">{ category.description || '—' }</TableCell>
                                                <TableCell><span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ category.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ category.isActive ? 'Active' : 'Inactive' }</span></TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-1.5">
                                                        { confirmingDeactivate === category.id ? (
                                                            <>
                                                                <Button type="button" variant="pill-ghost" size="xs" onClick={ () => setConfirmingDeactivate( null ) } disabled={ deactivateMutation.isPending }>Cancel</Button>
                                                                <Button type="button" variant="pill-ghost" size="xs" className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)" onClick={ () => deactivateCategory( category ) } disabled={ deactivateMutation.isPending }>{ deactivateMutation.isPending ? <><Spinner className="size-3.5 text-current" aria-label="Deactivating category" />Saving…</> : 'Confirm' }</Button>
                                                            </>
                                                        ) : category.isActive ? (
                                                            <>
                                                                <Button type="button" variant="pill-ghost" size="xs" onClick={ () => setEditingCategory( category ) } aria-label={ `Edit ${ category.name }` }><Pencil size={ 13 } />Edit</Button>
                                                                <Button type="button" variant="pill-ghost" size="xs" className="text-(--accent-deep)" onClick={ () => setConfirmingDeactivate( category.id ) }>Deactivate</Button>
                                                            </>
                                                        ) : (
                                                            <Button type="button" variant="pill-ghost" size="xs" onClick={ () => reactivateCategory( category ) } disabled={ updateMutation.isPending } aria-label={ `Reactivate ${ category.name }` }>{ updateMutation.isPending ? <><Spinner className="size-3.5 text-current" aria-label="Reactivating category" />Saving…</> : <><RotateCcw size={ 13 } />Reactivate</> }</Button>
                                                        ) }
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) ) }
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="px-5 py-14 text-center">
                                    <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-(--paper-2) text-(--ink)"><Tag size={ 19 } aria-hidden="true" /></div>
                                    <h2 className="font-display text-2xl">No categories yet</h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm text-(--muted)">Create categories here to make them available on product forms and filters.</p>
                                </div>
                            ) }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    )
}
