type StaticBreadcrumbRoute = '/dashboard' | '/inventory' | '/inventory/products' | '/inventory/variants' | '/inventory/settings/uoms' | '/finance' | '/finance/tax/groups' | '/finance/tax/rates'

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

const inventoryBreadcrumb: DashboardBreadcrumb = {
    label: 'Inventory',
    target: { to: '/inventory' },
}

const productsBreadcrumb: DashboardBreadcrumb = {
    label: 'Products',
    target: { to: '/inventory/products' },
}

const variantsBreadcrumb: DashboardBreadcrumb = {
    label: 'Product variants',
    target: { to: '/inventory/variants' },
}

const unitsOfMeasureBreadcrumb: DashboardBreadcrumb = {
    label: 'Units of measure',
    target: { to: '/inventory/settings/uoms' },
}

const financeBreadcrumb: DashboardBreadcrumb = {
    label: 'Finance & Accounting',
    target: { to: '/finance' },
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
        return [ workspaceBreadcrumb, inventoryBreadcrumb, { label: 'Overview' } ]
    }

    if ( pathname === '/inventory/products' ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, { label: 'Products' } ]
    }

    if ( pathname === '/inventory/variants' ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, { label: 'Product variants' } ]
    }

    if ( pathname === '/inventory/products/new' ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, productsBreadcrumb, { label: 'New product' } ]
    }

    if ( pathname === '/inventory/settings/product-categories' ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, { label: 'Product categories' } ]
    }

    if ( pathname === '/inventory/settings/uoms' ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, { label: 'Units of measure' } ]
    }

    if ( pathname === '/inventory/settings/uoms/new' ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, unitsOfMeasureBreadcrumb, { label: 'New unit' } ]
    }

    if ( /^\/inventory\/settings\/uoms\/[^/]+$/.test( pathname ) ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, unitsOfMeasureBreadcrumb, { label: 'Unit details' } ]
    }

    if ( pathname === '/finance' ) {
        return [ workspaceBreadcrumb, financeBreadcrumb, { label: 'Overview' } ]
    }

    const variantMatch = pathname.match( /^\/inventory\/item\/([^/]+)\/variant\/[^/]+$/ )
    if ( variantMatch ) {
        return [
            workspaceBreadcrumb,
            inventoryBreadcrumb,
            variantsBreadcrumb,
            {
                label: 'Product',
                target: { to: '/inventory/item/$uuid', params: { uuid: decodeURIComponent( variantMatch[ 1 ] ) } },
            },
            { label: 'Variant' },
        ]
    }

    if ( /^\/inventory\/item\/[^/]+$/.test( pathname ) ) {
        return [ workspaceBreadcrumb, inventoryBreadcrumb, productsBreadcrumb, { label: 'Product details' } ]
    }

    if ( pathname === '/finance/tax/groups' ) {
        return [ workspaceBreadcrumb, financeBreadcrumb, { label: 'Tax groups' } ]
    }

    if ( pathname === '/finance/tax/groups/new' ) {
        return [ workspaceBreadcrumb, financeBreadcrumb, taxGroupsBreadcrumb, { label: 'New tax group' } ]
    }

    if ( /^\/finance\/tax\/groups\/[^/]+$/.test( pathname ) ) {
        return [ workspaceBreadcrumb, financeBreadcrumb, taxGroupsBreadcrumb, { label: 'Tax group details' } ]
    }

    if ( pathname === '/finance/tax/rates' ) {
        return [ workspaceBreadcrumb, financeBreadcrumb, { label: 'Tax rates' } ]
    }

    if ( pathname === '/finance/tax/rates/new' ) {
        return [ workspaceBreadcrumb, financeBreadcrumb, taxRatesBreadcrumb, { label: 'New tax rate' } ]
    }

    const lastSegment = pathname.split( '/' ).filter( Boolean ).at( -1 )
    return [ workspaceBreadcrumb, { label: lastSegment ? formatRouteLabel( lastSegment ) : 'Overview' } ]
}
