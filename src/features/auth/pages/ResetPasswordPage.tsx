import { Link, useSearch } from '@tanstack/react-router'
import { IconCheck } from '@/components/ui/hugeicons'
import { AuthLayout } from '@/src/features/auth/components/AuthLayout'
import { ResetPasswordForm } from '@/src/features/auth/components/ResetPasswordForm'

export const ResetPasswordPage = () =>
{
    const { token } = useSearch( { from: '/reset-password' } )

    return (
        <AuthLayout
            title={ token ? 'Create a new password' : 'Invalid reset link' }
            description={ token ? 'Choose a new password to secure your account.' : 'This password reset link is invalid or missing a token.' }
            variant="editorial"
            editorialIntro={ <div className="mb-8"><div className="mb-5 font-mono text-[11px] tracking-[0.14em] text-(--ink-soft) uppercase">{ token ? 'Secure your account' : "Let's try again" }</div><h1 className="mb-3.5 max-w-[12ch] font-display text-[46px] leading-[0.98] font-light tracking-[-0.03em] text-(--ink) max-[520px]:text-[38px]">{ token ? <>A fresh start, <em className="text-(--accent) italic">right here.</em></> : <>That link has <em className="text-(--accent) italic">expired.</em></> }</h1><p className="max-w-[40ch] text-[15px] text-(--ink-soft)">{ token ? 'Set a password you will remember and get back to the work that matters.' : 'Request a new reset link and we will help you get back into your workspace.' }</p></div> }
            headerAction={ <Link to={ token ? '/auth/signin' : '/auth/forgot-password' } className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-2 text-[13px] text-(--ink-soft) transition-[border-color,background-color] duration-150 hover:border-(--rule) hover:bg-(--paper-2)"><span>{ token ? 'Remember your password?' : 'Need a new link?' }</span><strong className="font-medium text-(--ink)">{ token ? 'Log in' : 'Request one' }</strong></Link> }
            editorialContent={ <div><span className="mb-7 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-(--accent-light) uppercase before:h-px before:w-6 before:bg-(--accent-light) before:content-['']">{ token ? 'Back in your hands' : 'A simple way forward' }</span><blockquote className="mb-6 max-w-[18ch] font-display text-[38px] leading-[1.08] font-light tracking-[-0.025em] text-(--paper) italic max-[520px]:text-[30px]">{ token ? <>Your workspace is waiting, <em className="text-(--accent-light)">just as you left it.</em></> : <>We can get you back, <em className="text-(--accent-light)">one step at a time.</em></> }</blockquote><div className="grid gap-3 font-mono text-[11px] tracking-[0.05em] text-[rgb(246_241_230/65%)]">{ ( token ? ['A password only you know', 'Your account stays protected', 'Back to work in a moment'] : ['Request a fresh reset link', 'No changes to your workspace', 'Back to work in a moment'] ).map( ( item ) => <span key={ item } className="flex items-center gap-2.5"><span className="grid size-5.5 place-items-center rounded-full bg-[rgb(61_90_58/20%)] text-[#8FB58B]"><IconCheck aria-hidden="true" size={ 12 } strokeWidth={ 2.4 } /></span>{ item }</span> ) }</div></div> }
            editorialFooter={ <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.05em] text-(--muted)"><span>Status</span><span>Security</span><span>Docs</span></div> }
        >
            { token ? <ResetPasswordForm token={ token } /> : <div className="text-center text-sm"><Link to="/auth/forgot-password" className="text-primary hover:underline font-medium">Request a new link</Link></div> }
        </AuthLayout>
    )
}
