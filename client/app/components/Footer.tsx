"use client"

import { Button } from "@/components/ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/60 backdrop-blur-md shadow-sm mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-6 px-6 gap-4">
        
        <div className="text-sm sm:text-base font-medium tracking-tight text-primary">
          WATCH MY CRYPTO © {new Date().getFullYear()}
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:text-primary transition-colors"
            asChild
          >
            <a href="https://x.com/cryptoSid1564" target="_blank">
              <FaXTwitter className="h-5 w-5" /> Twitter
            </a>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:text-primary transition-colors"
            asChild
          >
            <a href="https://github.com/Sidharth77777/Watch-My-Crypto/blob/main/README.md" target="_blank">
              <FaGithub className="h-5 w-5" /> GitHub
            </a>
          </Button>
        </div>

      </div>
    </footer>
  )
}
