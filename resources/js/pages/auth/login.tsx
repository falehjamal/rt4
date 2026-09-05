import { Form, Head, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

const fieldClassName =
    'h-12 rounded-[14px] border border-[#cfd4dc] bg-transparent px-4 text-sm text-[#334155] shadow-none placeholder:text-transparent focus-visible:border-[#6366f1] focus-visible:ring-[#6366f1]/20';

function OutlinedField({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <div className="relative">
                <label
                    htmlFor={id}
                    className="absolute -top-2 left-3 z-10 bg-white px-1.5 text-[11px] font-medium tracking-[0.14em] text-[#9aa3b2] uppercase"
                >
                    {label}
                </label>
                {children}
            </div>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export default function Login({ status }: Props) {
    const { csrf_token } = usePage().props;
    const [forgotOpen, setForgotOpen] = useState(false);

    return (
        <div className="flex min-h-svh items-center justify-center bg-[#e8eaee] p-4">
            <Head title="Login" />

            <div className="w-full max-w-[380px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                <div className="relative bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] px-8 pt-10 pb-14">
                    <img
                        src="/logo.png"
                        alt="RT 4"
                        className="mb-4 size-14 rounded-2xl object-contain shadow-lg"
                    />
                    <p className="text-[15px] text-white">
                        Sistem Informasi RT 4,
                    </p>
                    <h1 className="mt-1 text-[34px] leading-none font-bold text-white">
                        Login
                    </h1>
                    <svg
                        className="absolute bottom-0 left-0 h-[70px] w-full"
                        viewBox="0 0 380 70"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 28C70 62 150 68 210 42C270 16 320 10 380 34V70H0V28Z"
                            fill="white"
                        />
                    </svg>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6 px-8 pt-2 pb-10"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="_token"
                                value={csrf_token}
                            />

                            <OutlinedField
                                id="login"
                                label="Username / Nomor HP"
                                error={errors.login}
                            >
                                <input
                                    id="login"
                                    type="text"
                                    name="login"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="admin atau 081234567890"
                                    className={`flex w-full min-w-0 outline-none ${fieldClassName}`}
                                />
                            </OutlinedField>

                            <OutlinedField
                                id="password"
                                label="Password"
                                error={errors.password}
                            >
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className={fieldClassName}
                                />
                            </OutlinedField>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    tabIndex={3}
                                    className="text-sm font-medium text-[#6366f1]"
                                    onClick={() => setForgotOpen(true)}
                                >
                                    Lupa password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                tabIndex={4}
                                data-test="login-button"
                                className="mx-auto mt-2 flex h-12 w-[210px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] text-base font-semibold text-white shadow-[0_10px_20px_rgba(99,102,241,0.35)] transition duration-200 hover:brightness-105 disabled:opacity-70"
                            >
                                {processing && <Spinner />}
                                Log in
                            </button>
                        </>
                    )}
                </Form>

                {status && (
                    <div className="px-8 pb-6 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </div>

            <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Lupa password?</DialogTitle>
                        <DialogDescription>
                            Hubungi admin atau pengurus RT untuk mereset
                            password akun Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            className="bg-brand-500 hover:bg-brand-600"
                            onClick={() => setForgotOpen(false)}
                        >
                            Mengerti
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
