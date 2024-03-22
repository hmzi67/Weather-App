"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css"
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={`bg-img ${inter.className}`}>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
