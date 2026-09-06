import { Link, usePage } from '@inertiajs/react';
import {
    FileSpreadsheet,
    Landmark,
    LayoutGrid,
    ScrollText,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { dashboard } from '@/routes';
import { laporan as laporanKeuangan } from '@/routes/keuangan';
import { index as iuranIndex } from '@/routes/keuangan/iuran';
import { index as kasIndex } from '@/routes/keuangan/kas';
import { audit as auditIndex } from '@/routes/manajemen';
import { index as usersIndex } from '@/routes/manajemen/users';
import { canManage } from '@/types/auth';
import type { NavGroup, NavItem } from '@/types';

const footerNavItems: NavItem[] = [];

const manajemenNavGroup: NavGroup = {
    title: 'Manajemen',
    items: [
        {
            title: 'Users',
            href: usersIndex(),
            icon: Users,
        },
        {
            title: 'Audit Log',
            href: auditIndex(),
            icon: ScrollText,
        },
    ],
};

export function AppSidebar() {
    const { auth } = usePage().props;
    const manage = auth.user ? canManage(auth.user.role) : false;
    const closeMobileNav = useMobileNavigation();

    const groups: NavGroup[] = [
        {
            title: 'Menu Utama',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        },
        {
            title: manage ? 'Keuangan & Kas' : 'Keuangan',
            items: manage
                ? [
                      {
                          title: 'Iuran Member',
                          href: iuranIndex(),
                          icon: Wallet,
                      },
                      {
                          title: 'Kas RT',
                          href: kasIndex(),
                          icon: Landmark,
                      },
                      {
                          title: 'Laporan Keuangan',
                          href: laporanKeuangan(),
                          icon: FileSpreadsheet,
                      },
                  ]
                : [
                      {
                          title: 'Iuran Saya',
                          href: iuranIndex(),
                          icon: Wallet,
                      },
                  ],
        },
    ];

    if (manage) {
        groups.push(manajemenNavGroup);
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={dashboard()}
                                onClick={closeMobileNav}
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={groups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
