"use client";

import { Button } from "@/components/ui/button";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { CoinAlert } from "@/types/types";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import UpdatePriceAlertDialog from "./UpdatePriceAlertDialog";

export default function AlertsTable({
    refetch,
    setRefetch,
}: {
    refetch: boolean;
    setRefetch: (refetch: boolean) => void;
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const [alerts, setAlerts] = useState<CoinAlert[]>([]);

    const fetchAllAlerts = async (): Promise<void> => {
        setLoading(true);
        try {
            const res = await api.get("/coins/getAll");
            const data = res.data;
            if (data.success && Array.isArray(data.data)) {
                setAlerts(data.data.reverse());
            } else {
                toast.error(data.message || "Failed to fetch alerts table");
                setAlerts([]);
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error("API limit reached — please try again in 1-2 minutes.");
            } else {
                console.error("Error fetching alerts:", err);
                toast.error("Failed to fetch alerts");
            }
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = async (alertId: string): Promise<void> => {
        try {
            const res = await api.delete(`coins/delete/${alertId}`);
            const data = res.data;
            if (data.success) {
                toast.success("Alert deleted successfully");
                setRefetch(!refetch);
            } else {
                toast.error(data.message || "Failed to delete alert");
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error("API limit reached — please try again in 1-2 minutes.");
            } else {
                console.error("Error deleting alert:", err);
                toast.error(err?.error || "Internal Server Error");
            }
        }
    };

    const muteAlert = async (alertId: string): Promise<void> => {
        try {
            const res = await api.patch(`coins/mute/${alertId}`);
            const data = res.data;
            if (data.success) {
                setRefetch(!refetch);
                toast.success("Alert muted successfully");
            } else {
                toast.error(data.message || "Failed to mute alert");
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error("API limit reached — please try again in 1-2 minutes.");
            } else {
                console.error("Error deleting alert:", err);
                toast.error(err?.error || "Internal Server Error");
            }
        }
    };

    const unMuteAlert = async (alertId: string): Promise<void> => {
        try {
            const res = await api.patch(`coins/unmute/${alertId}`);
            const data = res.data;
            if (data.success) {
                setRefetch(!refetch);
                toast.success(data.message || "Alert unmuted successfully");
            } else {
                toast.error(data.message || "Failed to unmute alert");
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error("API limit reached — please try again in 1-2 minutes.");
            } else {
                console.error("Error deleting alert:", err);
                toast.error(err?.error || "Internal Server Error");
            }
        }
    };

    const updateAlertPrice = async (id: string, newPrice: number) => {
        try {
            const res = await api.patch(`/coins/update-alert/${id}`, {
                targetPrice: newPrice,
            });
            const data = res.data;
            if (!data.success) {
                toast.error(data.message || "Failed to update alert");
                return;
            } else {
                toast.success("Alert price updated!");
                setRefetch(!refetch);
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error("API limit reached — please try again in 1-2 minutes.");
            } else {
                console.error("Error deleting alert:", err);
                toast.error(err?.error || "Internal Server Error");
            }
        }
    };

    useEffect(() => {
        fetchAllAlerts();
        setLoading(false);
    }, [refetch]);

    return (
        <div className="bg-muted/10 border border-border rounded-2xl p-4 mt-15 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h3 className="text-lg sm:text-xl font-semibold">Your Alerts</h3>

                {/*<input
                    type="text"
                    placeholder="Filter alerts..."
                    className="border border-input rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-64"
                />*/}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-separate border-spacing-y-2">
                    <thead className="text-left text-muted-foreground">
                        <tr>
                            <th className="px-3 py-2 font-medium">Logo</th>
                            <th className="px-3 py-2 font-medium">Coin ID</th>
                            <th className="px-3 py-2 font-medium">Symbol</th>
                            <th className="px-3 py-2 font-medium">Target Price</th>
                            <th className="px-3 py-2 font-medium">Status</th>
                            <th className="px-3 py-2 font-medium whitespace-nowrap">
                                Triggered At
                            </th>
                            <th className="px-3 py-2 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <Spinner />}

                        {!loading && alerts.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-3 py-3 text-center text-muted-foreground"
                                >
                                    No Alerts Found
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            alerts &&
                            alerts.map((alert) => (
                                <tr
                                    key={alert._id}
                                    className={`${alert.muteEmailNotifications ? "" : "bg-card"
                                        } hover:bg-muted transition rounded-lg`}
                                >
                                    <td className="px-3 py-3 flex items-center gap-2 min-w-[50px]">
                                        <img
                                            src={alert.image}
                                            alt="ethereum"
                                            className="w-6 h-6 rounded-full"
                                        />
                                    </td>
                                    <td
                                        className={`${alert.muteEmailNotifications ? "text-accent" : ""
                                            } px-3 py-3`}
                                    >
                                        {alert.coinId}
                                    </td>
                                    <td className="px-3 py-3">
                                        <span
                                            className={`${alert.muteEmailNotifications ? "text-accent" : ""
                                                } border border-border rounded-md px-2 py-0.5 text-xs font-medium`}
                                        >
                                            {alert.symbol}
                                        </span>
                                    </td>
                                    <td
                                        className={`${alert.muteEmailNotifications ? "text-accent" : ""
                                            } px-3 py-3`}
                                    >
                                        ${alert.targetPrice}
                                    </td>
                                    <td className="px-3 py-3">
                                        {alert.isActive ? (
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
                                                🟡 Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                                ⚪ Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                                        {alert.triggeredAt
                                            ? new Date(alert.triggeredAt).toLocaleString()
                                            : "Not Triggered Yet"}
                                    </td>
                                    <td className="px-3 py-3 flex items-center gap-2 sm:gap-3">
                                        {alert.isActive && (
                                            <>
                                                {!alert.muteEmailNotifications ? (
                                                    <Button
                                                        onClick={() => {
                                                            if (alert._id) {
                                                                muteAlert(alert._id);
                                                            }
                                                        }}
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-muted-foreground cursor-pointer hover:text-foreground"
                                                    >
                                                        <div title="Mute Alert">
                                                            <BellOff className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                                                        </div>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => {
                                                            if (alert._id) {
                                                                unMuteAlert(alert._id);
                                                            }
                                                        }}
                                                        size="icon"
                                                        variant="ghost"
                                                        className="cursor-pointer hover:text-foreground"
                                                    >
                                                        <div title="Unmute Alert">
                                                            <Bell className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                                                        </div>
                                                    </Button>
                                                )}

                                                <UpdatePriceAlertDialog
                                                    alertId={alert._id!}
                                                    currentPrice={alert.targetPrice}
                                                    onUpdate={(alertId, newPrice) =>
                                                        updateAlertPrice(alertId, newPrice)
                                                    }
                                                />
                                            </>
                                        )}

                                        <Button
                                            onClick={() => {
                                                if (alert._id) {
                                                    deleteAlert(alert._id);
                                                }
                                            }}
                                            size="icon"
                                            variant="ghost"
                                            className="text-destructive cursor-pointer hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-2">
                <p className="text-sm text-muted-foreground">Page 1 of 1</p>
            </div>
        </div>
    );
}
