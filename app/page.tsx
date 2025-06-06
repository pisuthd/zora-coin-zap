"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { Features } from "./components/DemoComponents";
import { CoinList } from "./components/CoinList";
import { Home, Zap } from "lucide-react"
import { TradePage } from "./components/Trade";
import { PortfolioPage } from "./components/Portfolio";
import { CreatePage } from "./components/Create";
import { ActivityPage } from "./components/Activity";
import { CreatorProfilePage } from "./components/Profile"

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<any>("home");
  const [coin, setCoin] = useState<any>(null)

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
          <div className="flex items-center px-2">
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-500 rounded-full flex items-center justify-center mr-2 shadow-md">
              <Zap size={22} className="text-white transform rotate-12"/>
            </div> 
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Zap
            </h1>
          </div>
        </header>

        <main className="flex-1">
          {activeTab === "home" && <CoinList setActiveTab={setActiveTab} setCoin={setCoin} />}
          {activeTab === "trade" && <TradePage setActiveTab={setActiveTab} coin={coin} />}
          {activeTab === "mycoins" && <PortfolioPage setActiveTab={setActiveTab} setCoin={setCoin} />}
          {activeTab === "create" && <CreatePage setActiveTab={setActiveTab} />}
          {activeTab === "activity" && <ActivityPage setActiveTab={setActiveTab} />}
          {activeTab === "profile" && <CreatorProfilePage setActiveTab={setActiveTab} />}
 
          <div className="sticky bottom-0 bg-white border-t mt-auto">
            <div className="flex justify-around py-3">
              <button
                className={`flex flex-col items-center px-4 ${activeTab === "home" ? "text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("home")}
              >
                <Home />
                <span className="text-xs mt-1">Discover</span>
              </button> 
              <button
                className={`flex flex-col items-center px-4 ${activeTab === "mycoins" ? "text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("mycoins")}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-xs mt-1">Portfolio</span>
              </button>
              <button
                className={`flex flex-col items-center px-4 ${activeTab === "create" ? "text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("create")}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs mt-1">Create</span>
              </button> 
              <button
      className={`flex flex-col items-center px-4 ${activeTab === "profile" ? "text-blue-500" : "text-gray-500"}`}
      onClick={() => setActiveTab("profile")}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="text-xs mt-1">Profile</span>
    </button>
            </div>
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
