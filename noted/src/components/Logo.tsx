import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm transition-transform group-hover:scale-105">
        <span className="text-lg font-black">N</span>
      </span>
      <span className="text-lg">Noted</span>
    </Link>
  );
}
