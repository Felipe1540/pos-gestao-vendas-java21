import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Package, DollarSign } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breja's - POS",
  description: "Sistema de Gestão de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold text-white">Breja's</h1>
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              <Link href="/mesas" className="flex items-center gap-2 text-gray-300 hover:text-white">
                <ShoppingCart size={20} />
                Mesas
              </Link>
              <Link href="/pdv" className="flex items-center gap-2 text-gray-300 hover:text-white">
                <DollarSign size={20} />
                PDV
              </Link>
              <Link href="/inventario" className="flex items-center gap-2 text-gray-300 hover:text-white">
                <Package size={20} />
                Inventário
              </Link>
              <Link href="/financeiro" className="flex items-center gap-2 text-gray-300 hover:text-white">
                <DollarSign size={20} />
                Financeiro
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}