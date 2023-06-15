"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "../../lib/utils"
import { buttonVariants } from "../ui/button"
import path from "path"
import { useRouter } from "next/dist/client/router"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
    }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const router = useRouter();

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 pl-6",
                className
            )}
            {...props}
        >
            {items.map((item) => (
                <Link legacyBehavior key={item.href} href={item.href}>
                    <a
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            router.pathname === item.href
                                ? "bg-muted hover:bg-muted"
                                : "hover:bg-transparent hover:underline",
                            "justify-start"
                        )}
                    >
                        {item.title}
                    </a>
                </Link>
            ))}
        </nav>
    );
}