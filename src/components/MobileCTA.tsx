import Link from "next/link";

export function MobileCTA({
  href,
  label,
  title,
  subtitle,
}: {
  href: string;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-border px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {title}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <Link
          href={href}
          className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
