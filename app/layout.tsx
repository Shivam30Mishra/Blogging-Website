import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "PulsePress",
  description: "Premium SaaS-style blogging platform with AI summaries and role-aware dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
