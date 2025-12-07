'use client'

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/builder", label: "Builder" },
        { href: "/templates", label: "Templates" },
        { href: "/executions", label: "Executions" },
    ];

    return (
        <nav className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            AgentForge-XT
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === link.href
                                    ? "text-blue-600"
                                    : "text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{session.user?.name || "User"}</p>
                                            <p className="text-xs text-slate-500">{session.user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href="/settings" className="w-full cursor-pointer">
                                        <DropdownMenuItem>
                                            Settings
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/sign-in">
                                <Button>Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
