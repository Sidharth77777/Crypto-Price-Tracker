"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { useWeb } from "../context/ContextProvider";

export default function Header() {
	const router: AppRouterInstance = useRouter();
	const { isLogged, setIsLogged, userEmail } = useWeb();
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedEmail = localStorage.getItem("email");
		if (storedEmail) { setEmail(storedEmail); }
		setIsLogged(true);
		setIsLoggedIn(!!token);
	}, [isLogged]);

	const handleLogout = (): void => {
		localStorage.removeItem("token");
		localStorage.removeItem("email");
		setIsLoggedIn(false);
		setIsLogged(false);
		toast.success("Logged out successfully");
		router.push("/");
	};

	const scrollToHero = (): void => {
		const scrollSection = document.getElementById("HeroSection");
		if (scrollSection) {
			scrollSection.scrollIntoView({ behavior: "smooth" });
		} else {
			router.push("/");
		}
	};

	return (
		<header className="fixed top-0 w-full border-b border-border bg-background/60 backdrop-blur-md shadow-sm z-50">
			<div className="container mx-auto flex justify-between items-center py-4 px-6">
				<div
					onClick={() => router.push("/")}
					className="text-lg sm:text-2xl font-semibold tracking-tight text-primary cursor-pointer"
				>
					WATCH MY CRYPTO
				</div>

				<div className="hidden md:flex gap-3 items-center">
					<Button
						onClick={scrollToHero}
						variant="ghost"
						className="hover:text-primary cursor-pointer sm:text-lg transition-colors duration-200"
					>
						Get Started
					</Button>

					{!isLoggedIn ? (
						<>
							<Button
								onClick={() => router.push("/login")}
								variant="ghost"
								className="hover:text-primary cursor-pointer sm:text-lg transition-colors duration-200"
							>
								Login
							</Button>
							<Button
								onClick={() => router.push("/signUp")}
								className="bg-primary text-primary-foreground cursor-pointer sm:text-lg hover:bg-primary/80 transition-colors duration-200"
							>
								Sign Up
							</Button>
						</>
					) : (<>
						<h1>{email}</h1>
						<Button
							onClick={handleLogout}
							className="bg-destructive text-destructive-foreground cursor-pointer sm:text-lg hover:bg-destructive/90 transition-colors duration-200 flex items-center gap-2"
						>
							<LogOut className="w-4 h-4" />
							Logout
						</Button>
						</>
					)}
				</div>

				<div className="md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label="Toggle menu"
					>
						{menuOpen ? (
							<X className="h-5 w-5 transition-all duration-200" />
						) : (
							<Menu className="h-5 w-5 transition-all duration-200" />
						)}
					</Button>
				</div>
			</div>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						key="mobile-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
						onClick={() => setMenuOpen(false)}
					>
						<motion.nav
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -50, opacity: 0 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
							className="absolute top-[72px] left-0 right-0 bg-background border-t border-border shadow-md py-4 px-6"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex flex-col items-start gap-3">
								<Button
									variant="ghost"
									className="w-full justify-start text-base hover:text-primary"
									onClick={() => {
										setMenuOpen(false);
										scrollToHero();
									}}
								>
									Get Started
								</Button>

								{!isLoggedIn ? (
									<>
										<Button
											variant="ghost"
											className="w-full justify-start text-base hover:text-primary"
											onClick={() => {
												setMenuOpen(false);
												router.push("/login");
											}}
										>
											Login
										</Button>

										<Button
											className="w-full justify-start text-base bg-primary text-primary-foreground hover:bg-primary/80"
											onClick={() => {
												setMenuOpen(false);
												router.push("/signUp");
											}}
										>
											Sign Up
										</Button>
									</>
								) : (
									<>
									<h1>{email}</h1>
									<Button
										onClick={() => {
											setMenuOpen(false);
											handleLogout();
										}}
										className="w-full justify-start text-base bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
									>
										<LogOut className="w-4 h-4" />
										Logout
									</Button>
									</>
								)}
							</div>
						</motion.nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
