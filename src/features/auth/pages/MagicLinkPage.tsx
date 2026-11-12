import { Link, useSearch } from '@tanstack/react-router'
import { IconCheck } from '@/components/ui/hugeicons'
import { AuthLayout } from '@/src/features/auth/components/AuthLayout'
import { MagicLinkForm } from '@/src/features/auth/components/MagicLinkForm'
import { MagicLinkConsume } from '@/src/features/auth/components/MagicLinkConsume'

export const MagicLinkPage = () =>
{
    const { token } = useSearch( { from: '/magic-link' } )

    return (
        <AuthLayout
            title={ token ? 'Authenticating your link' : 'Sign in without a password' }
            description={ token ? 'Please wait while we securely sign you in.' : "We'll email you a secure link to instantly sign in." }
            variant="editorial"
            editorialIntro={ <div className="mb-8"><div className="mb-5 font-mono text-[11px] tracking-[0.14em] text-(--ink-soft) uppercase">{ token ? 'Almost there' : 'A simpler way in' }</div><h1 className="mb-3.5 max-w-[12ch] font-display text-[46px] leading-[0.98] font-light tracking-[-0.03em] text-(--ink) max-[520px]:text-[38px]">{ token ? <>Your way back is <em className="text-(--accent) italic">right here.</em></> : <>One link. <em className="text-(--accent) italic">No password.</em></> }</h1><p className="max-w-[40ch] text-[15px] text-(--ink-soft)">{ token ? 'We are checking your link and preparing your workspace.' : 'Get a secure sign-in link in your inbox and return to your workspace in seconds.' }</p></div> }
            headerAction={ <Link to="/auth/signin" className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-2 text-[13px] text-(--ink-soft) transition-[border-color,background-color] duration-150 hover:border-(--rule) hover:bg-(--paper-2)"><span>Prefer a password?</span><strong className="font-medium text-(--ink)">Log in</strong></Link> }
            editorialContent={ <div><span className="mb-7 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-(--accent-light) uppercase before:h-px before:w-6 before:bg-(--accent-light) before:content-['']">{ token ? 'Securely connected' : 'A clear way forward' }</span><blockquote className="mb-6 max-w-[18ch] font-display text-[38px] leading-[1.08] font-light tracking-[-0.025em] text-(--paper) italic max-[520px]:text-[30px]">{ token ? <>Your workspace is waiting, <em className="text-(--accent-light)">just as you left it.</em></> : <>The fastest route back to the <em className="text-(--accent-light)">whole shop.</em></> }</blockquote><div className="grid gap-3 font-mono text-[11px] tracking-[0.05em] text-[rgb(246_241_230/65%)]">{ ( token ? ['Link verified securely', 'No password to remember', 'Back to work in a moment'] : ['One secure sign-in link', 'No password to type', 'Back to work in a moment'] ).map( ( item ) => <span key={ item } className="flex items-center gap-2.5"><span className="grid size-5.5 place-items-center rounded-full bg-[rgb(61_90_58/20%)] text-[#8FB58B]"><IconCheck aria-hidden="true" size={ 12 } strokeWidth={ 2.4 } /></span>{ item }</span> ) }</div></div> }
            editorialFooter={ <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.05em] text-(--muted)"><span>Status</span><span>Security</span><span>Docs</span></div> }
        >
            { token ? <MagicLinkConsume token={ token } /> : <MagicLinkForm /> }
        </AuthLayout>
    )
}
