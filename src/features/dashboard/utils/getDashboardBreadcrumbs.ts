type StaticBreadcrumbRoute = '/dashboard' | '/inventory' | '/finance/tax/groups' | '/finance/tax/rates'

type BreadcrumbTarget =
    | Readonly<{ to: StaticBreadcrumbRoute }>
    | Readonly<{ to: '/inventory/item/$uuid'; params: { uuid: string } }>

export type DashboardBreadcrumb = Readonly<{
    label: string
    target?: BreadcrumbTarget
}>

const workspaceBreadcrumb: DashboardBreadcrumb = {
    label: 'Workspace',
    target: { to: '/dashboard' },
}

const productsBreadcrumb: DashboardBreadcrumb = {
    label: 'Products',
    target: { to: '/inventory' },
}

const taxGroupsBreadcrumb: DashboardBreadcrumb = {
    label: 'Tax groups',
    target: { to: '/finance/tax/groups' },
}

const taxRatesBreadcrumb: DashboardBreadcrumb = {
    label: 'Tax rates',
    target: { to: '/finance/tax/rates' },
}

function formatRouteLabel ( segment: string ) {
    return segment
        .replace( /[-_]/g, ' ' )
        .replace( /\b\w/g, character => character.toUpperCase() )
}

export function getDashboardBreadcrumbs ( pathname: string ): DashboardBreadcrumb[] {
    if ( pathname === '/dashboard' ) {
        return [ { label: 'Workspace' }, { label: 'Overview' } ]
    }

    if ( pathname === '/inventory' ) {
        return [ workspaceBreadcrumb, { label: 'Inventory' }, { label: 'Products' } ]
    }

    if ( pathname === '/inventory/products/new' ) {
        return [ workspaceBreadcrumb, productsBreadcrumb, { label: 'New product' } ]
    }

    if ( pathname === '/inventory/settings/product-categories' ) {
        return [ workspaceBreadcrumb, { label: 'Inventory', target: { to: '/inventory' } }, { label: 'Product categories' } ]
    }

    const variantMatch = pathname.match( /^\/inventory\/item\/([^/]+)\/variant\/[^/]+$/ )
    if ( variantMatch ) {
        return [
            workspaceBreadcrumb,
            productsBreadcrumb,
            {
                label: 'Product',
                target: { to: '/inventory/item/$uuid', params: { uuid: decodeURIComponent( variantMatch[ 1 ] ) } },
            },
            { label: 'Variant' },
        ]
    }

    if ( /^\/inventory\/item\/[^/]+$/.test( pathname ) ) {
        return [ workspaceBreadcrumb, productsBreadcrumb, { label: 'Product details' } ]
    }

    if ( pathname === '/finance/tax/groups' ) {
        return [ workspaceBreadcrumb, { label: 'Finance & Accounting' }, { label: 'Tax groups' } ]
    }

    if ( pathname === '/finance/tax/groups/new' ) {
        return [ workspaceBreadcrumb, { label: 'Finance & Accounting' }, taxGroupsBreadcrumb, { label: 'New tax group' } ]
    }

    if ( /^\/finance\/tax\/groups\/[^/]+$/.test( pathname ) ) {
        return [ workspaceBreadcrumb, { label: 'Finance & Accounting' }, taxGroupsBreadcrumb, { label: 'Tax group details' } ]
    }

    if ( pathname === '/finance/tax/rates' ) {
        return [ workspaceBreadcrumb, { label: 'Finance & Accounting' }, { label: 'Tax rates' } ]
    }

    if ( pathname === '/finance/tax/rates/new' ) {
        return [ workspaceBreadcrumb, { label: 'Finance & Accounting' }, taxRatesBreadcrumb, { label: 'New tax rate' } ]
    }

    const lastSegment = pathname.split( '/' ).filter( Boolean ).at( -1 )
    return [ workspaceBreadcrumb, { label: lastSegment ? formatRouteLabel( lastSegment ) : 'Overview' } ]
}
