import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iftar Box Montreal – Daily Ramadan Iftar Subscription",
  description:
    "Fresh, homemade Iftar prepared daily and delivered at Maghrib. Subscription-based Ramadan meal service in Montreal. Limited spots available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
