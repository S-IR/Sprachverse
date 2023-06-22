"use client";
import { useEffect } from "react";
import Navbar from "@/components/general/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import "./css/fonts.css";
import { createContext, useContext, useState } from "react";
import { WebsiteLanguage } from "@/constants/display-language/website-languages";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AllModalBoxes from "@/components/general/modals/AllDialogBoxes";

const inter = Inter({ subsets: ["latin"] });

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60, // 1 hour
      },
    },
  });

  return (
    <html lang={"en"}>
      <body
        className={`${inter.className} bg-gradient-to-r from-[#1C1503] to-black`}
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Navbar />
          {children}
          <AllModalBoxes />
        </QueryClientProvider>
      </body>
    </html>
  );
}
