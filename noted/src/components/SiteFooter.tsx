import Link from "next/link";
import { Logo } from "./Logo";

const REPO = "https://github.com/Dipanshur19/LIT_hackathon";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Open app", href: "/app" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Source code", href: REPO, external: true },
      { label: "Try a sample", href: "/app" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-zinc-500">
            Study once. Post everywhere. Turn study notes into ready-to-post content packs in your own voice.
          </p>
          <p className="mt-4 text-xs text-zinc-400">
            Built for the LIT Hackathon · AI SaaS Builder Challenge (PS2)
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-zinc-900">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {"external" in l && l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 transition-colors hover:text-indigo-600"
                    >
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-indigo-600"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Noted. All rights reserved.</p>
          <p>Made with Next.js + Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
