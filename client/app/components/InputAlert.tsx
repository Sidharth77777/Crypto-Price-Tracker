"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../lib/axios";
import { CoinSuggestion } from "@/types/types";
import toast from "react-hot-toast";
import SmallSpinner from "./SmallSpinner";

export default function InputAlert({refetch, setRefetch}: {refetch:boolean, setRefetch: (refetch:boolean)=>void}) {
  const [suggestions, setSuggestions] = useState<CoinSuggestion[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinSuggestion | null>(null);
  const [targetPrice, setTargetPrice]  = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length > 1) {
        void fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const fetchSuggestions = async (query: string): Promise<void> => {
    try {
      const res = await api.post("/fetch/coin", { query });
      const data = res.data;
      if (data.success && Array.isArray(data.data)) {
        setSuggestions(data.data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (coin: CoinSuggestion) => {
    setQuery(coin.name);
    setSelectedCoin(coin);
    setShowDropdown(false);
  };

  const handleAlertSubmit = async(e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try{
        const res = await api.post("/coins/create-alert", {
            coinId: selectedCoin?.id,
            symbol: selectedCoin?.symbol,
            targetPrice: parseFloat(targetPrice.trim()),
        })
        const data = res.data; 

        if(!data.success){
            toast.error(data.message || "Failed to create alert");
            return;
        } else {
            toast.success("Coin Alert created successfully");
        }

        setQuery("");
        setSelectedCoin(null);
        setTargetPrice("");
        setRefetch(!refetch);
    } catch(err:any){
        if (err.response?.status === 429) {
            toast.error("Rate limit hit, retrying after 60 seconds...");
            setTimeout(() => fetchSuggestions(query), 60000);
        } else {
            toast.error(err.response?.data?.message || "Internal Server Error");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-muted/10 border border-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold">Create New Alert</h2>

      <form onSubmit={handleAlertSubmit} className="space-y-4">
        <div className="relative space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Search Coin
          </label>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedCoin(null);
            }}
            type="text"
            placeholder="Search for a cryptocurrency... (coinId or symbol)"
            className="w-full border border-input rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:outline-none"
            autoComplete="off"
            onFocus={() => query.length > 1 && setShowDropdown(true)}
          />

          {showDropdown && (
            <ul
              ref={dropdownRef}
              className="absolute z-20 w-full border border-border rounded-lg bg-background shadow-lg max-h-56 overflow-y-auto"
            >
              {suggestions.length === 0 ? (
                <li className="p-3 text-sm text-muted-foreground text-center">
                  No coins found
                </li>
              ) : (
                suggestions.map((coin) => (
                  <li
                    key={coin.id}
                    onClick={() => handleSelect(coin)}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
                  >

                    {/* <img
                      src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                      alt={coin.name}
                      className="w-5 h-5 rounded-full"
                    /> */}

                    <span className="font-medium">{coin.name}</span>
                    <span className="text-muted-foreground text-xs uppercase">
                      ({coin.symbol})
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {selectedCoin && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Coin ID</label>
              <input
                value={selectedCoin.id}
                disabled
                className="w-full bg-muted/40 border border-input rounded-lg px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Symbol</label>
              <input
                value={selectedCoin.symbol.toUpperCase()}
                disabled
                className="w-full bg-muted/40 border border-input rounded-lg px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">
                Contract Address (Optional)
              </label>
              <input
                value={
                  selectedCoin.platforms
                    ? Object.values(selectedCoin.platforms)[0] ?? "—"
                    : "—"
                }
                disabled
                className="w-full bg-muted/40 border border-input rounded-lg px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Target Price (USD)
          </label>
          <input
            value={targetPrice}
            inputMode="decimal"
            onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                setTargetPrice(value);
                }
            }}
            onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
                }
            }}
            type="number"
            placeholder="Enter target price"
            className="w-full border border-input rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <Button
            disabled={!selectedCoin || targetPrice.trim() === "" || loading}
            type="submit"
            className="w-full sm:w-auto bg-primary cursor-pointer text-primary-foreground hover:opacity-90"
          >
           {loading ? <SmallSpinner /> : "Create Alert"}
          </Button>
        </div>
      </form>
    </div>
  );
}
