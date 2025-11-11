"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { hasToken } from "../lib/checkToken";
import Spinner from "../components/Spinner";
import InputAlert from "../components/InputAlert";
import AlertsTable from "../components/AlertsTable";

export default function DashBoard() {
	const router: AppRouterInstance = useRouter();
	const [loading, setLoading] = useState<boolean>(true);
	const [refetch, setRefetch] = useState<boolean>(false);

	useEffect(() => {
		if (!hasToken()) {
			router.replace("/login");
			return;
		}
		setLoading(false);
	}, [router]);

	if (loading) return <Spinner />;

	return (
		<main className="min-h-screen bg-background text-foreground p-4 sm:p-6">
			<div className="max-w-6xl mx-auto space-y-8">
				<header className="space-y-2 text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
						Crypto Alert Dashboard
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base">
						Monitor your cryptocurrency price targets and receive instant alerts
					</p>
				</header>

				<section className="space-y-6">

					<InputAlert refetch={refetch} setRefetch={setRefetch} />
					<AlertsTable refetch={refetch} setRefetch={setRefetch} />

				</section>
			</div>
		</main>
	);
}
