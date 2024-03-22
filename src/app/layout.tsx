"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css"
import { QueryClient, QueryClientProvider } from 'react-query'
import Head from "next/head";

const queryClient = new QueryClient()

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Weather App</title>
        
      </head>
      <QueryClientProvider client={queryClient}>
        <body className={`bg-img ${inter.className}`}>
          {children}
        </body>
      </QueryClientProvider>
    </html>
  );
}
