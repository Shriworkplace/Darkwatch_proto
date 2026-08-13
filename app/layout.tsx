import { Outfit } from 'next/font/google'
import "./globals.css"

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
  title: "DARKWATCH | SOC Analyst Platform",
  description: "Next-generation security operations center platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.className}>
      <body className="bg-zinc-50 text-zinc-950 antialiased min-h-[100dvh] flex flex-col">
        {children}
      </body>
    </html>
  );
}
