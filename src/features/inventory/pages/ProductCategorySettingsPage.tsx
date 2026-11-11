import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, Plus, Tag, Trash2, X } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription as DialogText, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useCreateProductCategory, useDeactivateProductCategory, useProductCategories, useUpdateProductCategory } from '@/src/features/inventory/api/productCategories'
import type { ProductCategoryResponse } from '@/src/features/inventory/types/productCategories'
import { getApiErrorMessage } from '@/src/lib/api-error'

const categorySchema = z.object( {
    name: z.string().trim().min( 1, 'Category name is required' ).max( 128, 'Category name must be 128 characters or fewer' ),
    description: z.string().max( 2000, 'Description must be 2,000 characters or fewer' ),
} )

const categoryDetailsSchema = categorySchema.extend( { isActive: z.boolean() } )

type CategoryValues = z.infer<typeof categorySchema>

const emptyCategory: CategoryValues = { name: '', description: '' }
const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

const ProductCategoryEditor = () => {
    const createMutation = useCreateProductCategory()
    const isPending = createMutation.isPending
    const form = useForm( {
        defaultValues: emptyCategory,
        validators: { onSubmit: categorySchema },
        onSubmit: ( { value } ) => {
            const request = {
                name: value.name.trim(),
                description: value.description.trim(),
            }

            createMutation.mutate( { ...request, description: request.description || undefined }, {
                onSuccess: created => {
                    toast.success( 'Category created', { description: `${ created.name } is ready to use.` } )
                    form.reset()
                },
                onError: error => toast.error( 'Could not create category', { description: getApiErrorMessage( error, 'Product categories could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to manage product categories. Ask an administrator for inventory:write access.' } ) } ),
            } )
        },
    } )

    return (
        <Card>
            <CardHeader>
                <CardEyebrow>Category setup</CardEyebrow>
                <CardTitle>Add a product category</CardTitle>
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
                        <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                            { isPending ? <Spinner className="size-4 text-current" aria-label="Saving category" /> : <Plus size={ 15 } /> }
                            { isPending ? 'Saving…' : 'Add category' }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

type CategoryDetailsDialogProps = Readonly<{
    category: ProductCategoryResponse
    onOpenChange: ( open: boolean ) => void
}>

const CategoryDetailsDialog = ( { category, onOpenChange }: CategoryDetailsDialogProps ) => {
    const updateMutation = useUpdateProductCategory()
    const deactivateMutation = useDeactivateProductCategory()
    const isPending = updateMutation.isPending || deactivateMutation.isPending
    const form = useForm( {
        defaultValues: {
            name: category.name,
            description: category.description ?? '',
            isActive: category.isActive,
        },
        validators: { onSubmit: categoryDetailsSchema },
        onSubmit: ( { value } ) => {
            updateMutation.mutate( {
                id: category.id,
                name: value.name.trim(),
                description: value.description.trim(),
                isActive: value.isActive,
            }, {
                onSuccess: updated => {
                    toast.success( 'Category updated', { description: `${ updated.name } is ${ updated.isActive ? 'enabled' : 'disabled' }.` } )
                    onOpenChange( false )
                },
            onError: error => toast.error( 'Could not update category', { description: getApiErrorMessage( error, 'Product categories could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to manage product categories. Ask an administrator for inventory:write access.' } ) } ),
            } )
        },
    } )

    const deleteCategory = () => {
        deactivateMutation.mutate( category.id, {
            onSuccess: () => {
                toast.success( 'Category deleted', { description: `${ category.name } is no longer available for new products.` } )
                onOpenChange( false )
            },
            onError: error => toast.error( 'Could not delete category', { description: getApiErrorMessage( error, 'Product categories could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to manage product categories. Ask an administrator for inventory:write access.' } ) } ),
        } )
    }

    return (
        <Dialog open onOpenChange={ open => { if ( !open && !isPending ) onOpenChange( false ) } }>
            <DialogContent className="data-open:slide-in-from-bottom-1 data-closed:slide-out-to-bottom-1 top-[12%] max-h-[80dvh] overflow-y-auto duration-200 sm:max-w-xl">
                <div className="grid gap-1.5 pr-7">
                    <DialogTitle className="font-display text-2xl font-normal">Edit product category</DialogTitle>
                    <DialogText>Update the category details or choose whether it is available for new products.</DialogText>
                </div>
                <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="grid gap-5">
                    <FieldGroup className="grid gap-4">
                        <form.Field name="name" children={ field => {
                            const isInvalid = field.state.meta.errors.length > 0
                            return (
                                <Field data-invalid={ isInvalid }>
                                    <FieldLabel htmlFor={ `category-${ category.id }-name` }>Category name</FieldLabel>
                                    <Input id={ `category-${ category.id }-name` } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } maxLength={ 128 } disabled={ isPending } />
                                    { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                </Field>
                            )
                        } } />
                        <form.Field name="description" children={ field => {
                            const isInvalid = field.state.meta.errors.length > 0
                            return (
                                <Field data-invalid={ isInvalid }>
                                    <FieldLabel htmlFor={ `category-${ category.id }-description` }>Description</FieldLabel>
                                    <Textarea id={ `category-${ category.id }-description` } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className="min-h-24 resize-y rounded-[10px] border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" maxLength={ 2000 } disabled={ isPending } />
                                    <FieldDescription>{ field.state.value.length } / 2,000</FieldDescription>
                                    { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                </Field>
                            )
                        } } />
                        <form.Field name="isActive" children={ field => (
                            <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) bg-(--paper) p-3.5">
                                <div className="grid gap-0.5">
                                    <FieldLabel htmlFor={ `category-${ category.id }-enabled` } className="cursor-pointer">Enable category</FieldLabel>
                                    <FieldDescription>{ field.state.value ? 'Available for new products.' : 'Hidden from new product selections.' }</FieldDescription>
                                </div>
                                <Switch id={ `category-${ category.id }-enabled` } checked={ field.state.value } onCheckedChange={ field.handleChange } disabled={ isPending } aria-label="Enable category" />
                            </div>
                        ) } />
                    </FieldGroup>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--rule-soft) pt-4">
                        <Button type="button" variant="pill-ghost" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ deleteCategory } disabled={ isPending }>
                            { deactivateMutation.isPending ? <Spinner className="size-4 text-current" aria-label="Deleting category" /> : <Trash2 size={ 15 } /> }
                            { deactivateMutation.isPending ? 'Deleting…' : 'Delete category' }
                        </Button>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="pill-ghost" onClick={ () => onOpenChange( false ) } disabled={ isPending }><X size={ 15 } />Cancel</Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                { updateMutation.isPending ? <Spinner className="size-4 text-current" aria-label="Saving category" /> : <Check size={ 15 } /> }
                                { updateMutation.isPending ? 'Saving…' : 'Save changes' }
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export const ProductCategorySettingsPage = () => {
    const categoriesQuery = useProductCategories( { activeOnly: false } )
    const [ editingCategory, setEditingCategory ] = useState<ProductCategoryResponse | null>( null )

    useEffect( () => {
        const toastId = 'inventory-product-categories-management-fetch-error'
        if ( categoriesQuery.isError ) {
            toast.error( 'Could not load product categories', {
                id: toastId,
                description: getApiErrorMessage( categoriesQuery.error, 'Product categories could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to manage product categories. Ask an administrator for inventory:write access.' } ),
                action: { label: 'Retry', onClick: () => { void categoriesQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ categoriesQuery.error, categoriesQuery.isError, categoriesQuery.refetch ] )

    return (
        <DashboardShell>
            <div className="w-full">
                <div className="mb-7 border-b border-(--rule) pb-6">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory / Settings</p>
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Product categories</h1>
                    <p className="mt-2.5 text-[15px] text-(--ink-soft)">Keep product categories consistent across your organization.</p>
                </div>

                <div className="grid w-full gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.4fr)]">
                    <ProductCategoryEditor />

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
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        { categoriesQuery.data.map( category => (
                                            <TableRow
                                                key={ category.id }
                                                className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--ink)"
                                                tabIndex={ 0 }
                                                aria-label={ `Edit category ${ category.name }` }
                                                onClick={ () => setEditingCategory( category ) }
                                                onKeyDown={ event => {
                                                    if ( event.key === 'Enter' || event.key === ' ' ) {
                                                        event.preventDefault()
                                                        setEditingCategory( category )
                                                    }
                                                } }
                                            >
                                                <TableCell className="font-medium">{ category.name }</TableCell>
                                                <TableCell className="max-w-[32ch] truncate text-(--ink-soft)">{ category.description || '—' }</TableCell>
                                                <TableCell><span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ category.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ category.isActive ? 'Enabled' : 'Disabled' }</span></TableCell>
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
            { editingCategory ? <CategoryDetailsDialog key={ editingCategory.id } category={ editingCategory } onOpenChange={ open => { if ( !open ) setEditingCategory( null ) } } /> : null }
        </DashboardShell>
    )
}
