export type UserRole = 'superadmin' | 'admin' | 'member';

export function hasFullAccess(role: UserRole): boolean {
    return role === 'superadmin';
}

export function isMemberRole(role: UserRole): boolean {
    return role === 'admin' || role === 'member';
}

export function canManage(role: UserRole): boolean {
    return role === 'superadmin' || role === 'admin';
}

export type User = {
    id: number;
    name: string;
    username: string;
    phone: string;
    role: UserRole;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
