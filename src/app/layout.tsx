import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Shield } from "lucide-react"; // 1. Import the icon
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MorisGuard - Toxicity Detection",
  description: "Help us identify toxic comments in Kreol Morisien.",
};

/* ... imports ... */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        {/* Header: Less padding on mobile */}
        <header className="bg-white border-b border-slate-200 py-3 px-4 md:py-4 md:px-6 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 text-blue-900">
              <Shield className="w-6 h-6 md:w-8 md:h-8 fill-blue-100" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">MorisGuard</h1>
            </div>
            {/* Hide text on very small screens if needed, or keep small */}
            <span className="text-[10px] md:text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase font-semibold">
              Preview
            </span>
          </div>
        </header>

        {/* Main: p-4 on mobile, p-6 on desktop */}
        <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
          {children}
        </main>
        
        {/* ... footer ... */}
      </body>
    </html>
  );
}