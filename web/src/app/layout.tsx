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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-white">
          <NavClient />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-white">
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} BookYourTrip. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
