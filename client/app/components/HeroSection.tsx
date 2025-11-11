"use client"

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export default function HeroSection() {
    const router: AppRouterInstance = useRouter();

    const scrollToFeatures = () => {
        const section = document.getElementById("featureSection")
        if (section) {
            section.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div id="HeroSection" className="min-h-screen flex justify-center items-center">
            <div>
                <h1 className="text-primary text-center sm:text-7xl text-5xl mb-5 text-wrap">WATCH MY CRYPTO</h1>
                <h3 className="text-foreground text-center sm:text-xl text-xl mb-10 text-wrap">Stay ahead of the market with <span className="text-accent">instant crypto alerts</span></h3>
            <div className="flex justify-center items-center mb-15 flex-wrap gap-10">
                <Button 
                    onClick={() => router.push('/login')}
                    variant="outline" 
                    className="px-15 py-6 hover:text-primary cursor-pointer sm:text-lg transition-colors duration-200">Login
                </Button>
                <Button 
                    onClick={() => router.push('/signUp')}
                    className="px-15 py-6 bg-primary text-primary-foreground cursor-pointer sm:text-lg hover:bg-primary/80 transition-colors duration-200">Sign Up
                </Button>
            </div>
            <div className="flex justify-center items-center">
                <Button 
                    onClick={scrollToFeatures}
                    variant="ghost" 
                    className="px-15 py-6 cursor-pointer">Explore Features <ArrowDown className="animate-bounce" />
                </Button>
            </div>
            </div>
        </div>
    )
}