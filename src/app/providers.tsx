"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import StaticNavbar from "./components/StaticNavbar";
import { Footer } from "./components/Footer";

import { getConfig } from "@/wagmi";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <StaticNavbar />
        {props.children}
        <Footer />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
