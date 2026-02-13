import Link from "next/link";
import { Moon, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/15141234567?text=I%20want%20to%20order%20an%20Iftar%20Box";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Moon className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground tracking-tight">
            IftarBox
          </span>
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Order via WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
