import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "@tanstack/react-router"
import { useResetPassword } from "@/src/features/auth/api/resetPassword"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input"
import { toastApiError } from "@/src/lib/api-error"

const resetPasswordSchema = z.object( {
    newPassword: z.string().min( 8, { message: "Password must be at least 8 characters" } ),
    confirmPassword: z.string(),
} ).refine( ( data ) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
} )

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

type ResetPasswordFormProps = Readonly<{
    token: string
}>

export const ResetPasswordForm = ( { token }: ResetPasswordFormProps ) =>
{
    const navigate = useNavigate()
    const resetPasswordMutation = useResetPassword()

    const form = useForm<ResetPasswordValues>( {
        resolver: zodResolver( resetPasswordSchema ),
        defaultValues: { newPassword: "", confirmPassword: "" },
    } )

    const onSubmit = ( values: ResetPasswordValues ) =>
    {
        resetPasswordMutation.mutate(
            { token, newPassword: values.newPassword },
            {
                onSuccess: () =>
                {
                    navigate( { to: "/auth/signin" } )
                },
                onError: ( error: any ) =>
                {
                    toastApiError( error, "Failed to reset password. The link might be expired." )
                }
            }
        )
    }

    return (
        <Form { ...form }>
            <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-4">
                <FormField
                    control={ form.control }
                    name="newPassword"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="••••••••" { ...field } disabled={ resetPasswordMutation.isPending } />
                            </FormControl>
                            <PasswordStrengthMeter value={ field.value } />
                            <FormMessage />
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="confirmPassword"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="••••••••" { ...field } disabled={ resetPasswordMutation.isPending } />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />

                <Button type="submit" className="w-full" disabled={ resetPasswordMutation.isPending }>
                    { resetPasswordMutation.isPending ? "Resetting..." : "Reset Password" }
                </Button>
            </form>
        </Form>
    )
}
