"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Recycle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppHeader() {
    const pathname = usePathname()

    const navItems = [
        { href: "/", label: "Dashboard" },
        { href: "/map", label: "Map" },
        { href: "/upload", label: "Upload" },
        { href: "/leaderboard", label: "Leaderboard" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                        <Image
                            src="/sortex_logo.webp"
                            alt="Sortex Logo"
                            width={40}
                            height={40}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold leading-none tracking-tight text-foreground">Sortex</span>
                        <span className="text-xs text-muted-foreground">Recycle Smartly</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "w-10 h-10 border-2 border-border",
                            userButtonPopoverCard: "bg-card border border-border shadow-lg",
                        },
                    }}
                />
            </div>
        </header>
    )
}
