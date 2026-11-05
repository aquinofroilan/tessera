import { Link, useSearch } from '@tanstack/react-router'
import { IconCheck } from '@tabler/icons-react'
import { AuthLayout } from '@/src/features/auth/components/AuthLayout'
import { InvitationAcceptForm } from '@/src/features/auth/components/InvitationAcceptForm'

export const InvitationPage = () =>
{
    const { token } = useSearch( { from: '/join' } )

    return (
        <AuthLayout
            title={ token ? 'Join your organization' : 'Invitation not found' }
            description={ token ? "You've been invited to join an organization on Tessera." : 'This invitation link is invalid or missing a token.' }
            variant="editorial"
            editorialIntro={ <div className="mb-8"><div className="mb-5 font-mono text-[11px] tracking-[0.14em] text-(--ink-soft) uppercase">{ token ? 'You are invited' : "Let's try again" }</div><h1 className="mb-3.5 max-w-[12ch] font-display text-[46px] leading-[0.98] font-light tracking-[-0.03em] text-(--ink) max-[520px]:text-[38px]">{ token ? <>There is a place for you <em className="text-(--accent) italic">here.</em></> : <>That invitation is <em className="text-(--accent) italic">missing.</em></> }</h1><p className="max-w-[40ch] text-[15px] text-(--ink-soft)">{ token ? 'Complete your profile and step into a workspace built for the whole shop.' : 'Ask your administrator to send a fresh invitation so you can join the workspace.' }</p></div> }
            headerAction={ <Link to="/auth/signin" className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-2 text-[13px] text-(--ink-soft) transition-[border-color,background-color] duration-150 hover:border-(--rule) hover:bg-(--paper-2)">Already have an account?<strong className="ml-0.5 font-medium text-(--ink)">Log in</strong></Link> }
            editorialContent={ <div><span className="mb-7 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-(--accent-light) uppercase before:h-px before:w-6 before:bg-(--accent-light) before:content-['']">{ token ? 'A connected workspace' : 'A simple next step' }</span><blockquote className="mb-6 max-w-[18ch] font-display text-[38px] leading-[1.08] font-light tracking-[-0.025em] text-(--paper) italic max-[520px]:text-[30px]">{ token ? <>Good work happens better when it is <em className="text-(--accent-light)">shared.</em></> : <>The right workspace starts with the <em className="text-(--accent-light)">right invitation.</em></> }</blockquote><div className="grid gap-3 font-mono text-[11px] tracking-[0.05em] text-[rgb(246_241_230/65%)]">{ ( token ? ['One connected workspace', 'Your team is already here', 'Ready when you are'] : ['Ask for a fresh invitation', 'Your workspace stays protected', 'Join when you are ready'] ).map( ( item ) => <span key={ item } className="flex items-center gap-2.5"><span className="grid size-5.5 place-items-center rounded-full bg-[rgb(61_90_58/20%)] text-[#8FB58B]"><IconCheck aria-hidden="true" size={ 12 } stroke={ 2.4 } /></span>{ item }</span> ) }</div></div> }
            editorialFooter={ <nav aria-label="Resources" className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.05em] text-(--muted)"><a href="#">Status</a><a href="#">Security</a><a href="#">Docs</a></nav> }
        >
            { token ? <InvitationAcceptForm token={ token } /> : <div className="text-center text-sm text-muted-foreground">Please contact your administrator to request a new invitation.</div> }
        </AuthLayout>
    )
}
