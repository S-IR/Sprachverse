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
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: (language) => undefined,
});
export function useLanguage() {
  return useContext(LanguageContext);
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("en");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60, // 1 hour
      },
    },
  });

  return (
    <html lang={language}>
      <body
        className={`${inter.className} bg-gradient-to-r from-[#1C1503] to-black`}
      >
        <QueryClientProvider client={queryClient}>
          <LanguageContext.Provider value={{ language, setLanguage }}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Navbar />
            {children}
            <AllModalBoxes />
          </LanguageContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
