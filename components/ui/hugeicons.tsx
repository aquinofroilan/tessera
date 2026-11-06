import { HugeiconsIcon, type HugeiconsIconProps, type IconSvgElement } from '@hugeicons/react'
import {
    Add01Icon as Add01Svg,
    Analytics01Icon as Analytics01Svg,
    ArrowDown01Icon as ArrowDown01Svg,
    ArrowLeft01Icon as ArrowLeft01Svg,
    ArrowRight01Icon as ArrowRight01Svg,
    ArrowUp01Icon as ArrowUp01Svg,
    ArrowUpRight01Icon as ArrowUpRight01Svg,
    BellIcon as BellSvg,
    BoxesIcon as BoxesSvg,
    Briefcase01Icon as Briefcase01Svg,
    Building01Icon as Building01Svg,
    Building03Icon as Building03Svg,
    CalendarClockIcon as CalendarClockSvg,
    Chart01Icon as Chart01Svg,
    CheckIcon as CheckSvg,
    CheckmarkCircle01Icon as CheckmarkCircle01Svg,
    CheckmarkCircle02Icon as CheckmarkCircle02Svg,
    ChevronLeftIcon as ChevronLeftSvg,
    ChevronRightIcon as ChevronRightSvg,
    CircleCheckIcon as CircleCheckSvg,
    CircleDotIcon as CircleDotSvg,
    CircleDollarSignIcon as CircleDollarSignSvg,
    Clock01Icon as Clock01Svg,
    CloudServerIcon as CloudServerSvg,
    CogIcon as CogSvg,
    DashboardSquare01Icon as DashboardSquare01Svg,
    Delete01Icon as Delete01Svg,
    EyeIcon as EyeSvg,
    EyeOffIcon as EyeOffSvg,
    Grid2x2Icon as Grid2x2Svg,
    HelpCircleIcon as HelpCircleSvg,
    InformationCircleIcon as InformationCircleSvg,
    LifebuoyIcon as LifebuoySvg,
    Loading03Icon as Loading03Svg,
    Logout01Icon as Logout01Svg,
    Menu02Icon as Menu02Svg,
    MessageSquareIcon as MessageSquareSvg,
    MoreHorizontalIcon as MoreHorizontalSvg,
    Notification01Icon as Notification01Svg,
    OctagonXIcon as OctagonXSvg,
    PackageIcon as PackageSvg,
    PackagePlusIcon as PackagePlusSvg,
    PencilIcon as PencilSvg,
    PlusSignIcon as PlusSignSvg,
    Search01Icon as Search01Svg,
    SecurityCheckIcon as SecurityCheckSvg,
    Settings01Icon as Settings01Svg,
    ShoppingCart01Icon as ShoppingCart01Svg,
    Tag01Icon as Tag01Svg,
    ToolsIcon as ToolsSvg,
    TrashIcon as TrashSvg,
    TriangleAlertIcon as TriangleAlertSvg,
    Tick01Icon as Tick01Svg,
    UserGroupIcon as UserGroupSvg,
    UserMultipleIcon as UserMultipleSvg,
    UserShield01Icon as UserShield01Svg,
    Wallet01Icon as Wallet01Svg,
    WorkflowSquare01Icon as WorkflowSquare01Svg,
    XIcon as XSvg,
} from '@hugeicons/core-free-icons'

type IconProps = Omit<HugeiconsIconProps, 'icon' | 'stroke' | 'strokeWidth'> & {
    stroke?: number | string
    strokeWidth?: number | string
}

function createIcon ( icon: IconSvgElement ) {
    const Icon = ( { stroke, strokeWidth, ...props }: IconProps ) => {
        const colorStroke = typeof stroke === 'string' ? stroke : undefined
        const resolvedStrokeWidth = Number( strokeWidth ?? ( typeof stroke === 'number' ? stroke : 1.8 ) )
        return <HugeiconsIcon icon={ icon } stroke={ colorStroke } strokeWidth={ resolvedStrokeWidth } { ...props } />
    }
    Icon.displayName = 'Hugeicon'
    return Icon
}

export const Add01Icon = createIcon( Add01Svg )
export const Analytics01Icon = createIcon( Analytics01Svg )
export const ArrowDown01Icon = createIcon( ArrowDown01Svg )
export const ArrowLeft = createIcon( ArrowLeft01Svg )
export const ArrowLeft01Icon = ArrowLeft
export const ArrowRight = createIcon( ArrowRight01Svg )
export const ArrowUp01Icon = createIcon( ArrowUp01Svg )
export const ArrowUpRight = createIcon( ArrowUpRight01Svg )
export const ArrowUpRight01Icon = ArrowUpRight
export const Bell = createIcon( BellSvg )
export const Boxes = createIcon( BoxesSvg )
export const Briefcase01Icon = createIcon( Briefcase01Svg )
export const Building01Icon = createIcon( Building01Svg )
export const Building03Icon = createIcon( Building03Svg )
export const CalendarClock = createIcon( CalendarClockSvg )
export const Chart01Icon = createIcon( Chart01Svg )
export const Check = createIcon( CheckSvg )
export const CheckCircle2 = createIcon( CheckmarkCircle02Svg )
export const CircleCheckIcon = createIcon( CircleCheckSvg )
export const CircleDollarSign = createIcon( CircleDollarSignSvg )
export const Clock = createIcon( Clock01Svg )
export const CloudServerIcon = createIcon( CloudServerSvg )
export const Cog = createIcon( CogSvg )
export const DashboardSquare01Icon = createIcon( DashboardSquare01Svg )
export const Delete01Icon = createIcon( Delete01Svg )
export const EyeIcon = createIcon( EyeSvg )
export const EyeOffIcon = createIcon( EyeOffSvg )
export const Grid2X2 = createIcon( Grid2x2Svg )
export const HelpCircleIcon = createIcon( HelpCircleSvg )
export const IconAlertOctagon = createIcon( OctagonXSvg )
export const IconAlertTriangle = createIcon( TriangleAlertSvg )
export const IconArrowLeft = ArrowLeft
export const IconArrowUpRight = ArrowUpRight
export const IconBell = Bell
export const IconCheck = Check
export const IconChevronLeft = createIcon( ChevronLeftSvg )
export const IconChevronRight = createIcon( ChevronRightSvg )
export const IconCircleCheck = createIcon( CheckmarkCircle01Svg )
export const IconClock = Clock
export const IconDots = createIcon( MoreHorizontalSvg )
export const IconEye = EyeIcon
export const IconEyeOff = EyeOffIcon
export const IconInfoCircle = createIcon( InformationCircleSvg )
export const IconLifebuoy = createIcon( LifebuoySvg )
export const IconLoader2 = createIcon( Loading03Svg )
export const IconMenu2 = createIcon( Menu02Svg )
export const IconPlus = createIcon( PlusSignSvg )
export const IconPointFilled = createIcon( CircleDotSvg )
export const IconSearch = createIcon( Search01Svg )
export const IconX = createIcon( XSvg )
export const InformationCircleIcon = createIcon( InformationCircleSvg )
export const LifebuoyIcon = createIcon( LifebuoySvg )
export const Loading03Icon = createIcon( Loading03Svg )
export const Logout01Icon = createIcon( Logout01Svg )
export const Menu02Icon = createIcon( Menu02Svg )
export const MessageSquare = createIcon( MessageSquareSvg )
export const Notification01Icon = createIcon( Notification01Svg )
export const OctagonXIcon = createIcon( OctagonXSvg )
export const PackageIcon = createIcon( PackageSvg )
export const Package = createIcon( PackageSvg )
export const PackagePlus = createIcon( PackagePlusSvg )
export const Pencil = createIcon( PencilSvg )
export const Plus = createIcon( PlusSignSvg )
export const Search = createIcon( Search01Svg )
export const SecurityCheckIcon = createIcon( SecurityCheckSvg )
export const Settings01Icon = createIcon( Settings01Svg )
export const ShoppingCart = createIcon( ShoppingCart01Svg )
export const ShoppingCart01Icon = createIcon( ShoppingCart01Svg )
export const Tag = createIcon( Tag01Svg )
export const Tag01Icon = Tag
export const Tick01Icon = createIcon( Tick01Svg )
export const ToolsIcon = createIcon( ToolsSvg )
export const Trash2 = createIcon( TrashSvg )
export const TriangleAlertIcon = createIcon( TriangleAlertSvg )
export const UserGroupIcon = createIcon( UserGroupSvg )
export const UserMultipleIcon = createIcon( UserMultipleSvg )
export const UserShield01Icon = createIcon( UserShield01Svg )
export const Users = createIcon( UserMultipleSvg )
export const Wallet01Icon = createIcon( Wallet01Svg )
export const WorkflowSquare01Icon = createIcon( WorkflowSquare01Svg )
export const X = createIcon( XSvg )
export const XIcon = X
export const InfoIcon = InformationCircleIcon
export const Loader2Icon = Loading03Icon
export const OctagonX = OctagonXIcon
export const PackagePlusIcon = PackagePlus
export const PencilIcon = Pencil
export const Search01Icon = Search
export const TriangleAlert = TriangleAlertIcon
