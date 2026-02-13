import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-foreground text-background/60 py-8 pb-24 md:pb-8", className)}>
      <div className="max-w-5xl mx-auto px-4 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} IftarBox Montreal. All rights reserved.</p>
      </div>
    </footer>
  );
}
