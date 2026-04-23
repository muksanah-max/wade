"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/formulas", label: "公式库" },
  { href: "/extract", label: "反推公式" },
  { href: "/generate", label: "生成脚本" },
  { href: "/history", label: "历史记录" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link href="/" className="text-lg font-bold text-brand">
          爆款工坊
        </Link>
        <div className="flex gap-1 text-sm">
          {LINKS.slice(1).map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
