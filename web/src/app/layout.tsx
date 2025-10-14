import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import NavClient from "@/components/NavClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookYourTrip",
  description: "Ticket Booking & Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Basic SSR token presence for nav (client pages still read localStorage)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">B</div>
                <span className="font-semibold">BookYourTrip</span>
              </div>
              <NavClient />
            </div>
          </header>
          <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-white/80">
            <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500">© {new Date().getFullYear()} BookYourTrip</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
