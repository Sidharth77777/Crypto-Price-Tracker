"use client"

import { ContextValuesType } from "@/types/types";
import { createContext, useContext, useState } from "react";

const WebContext = createContext<ContextValuesType | null>(null);

export const WebProvider = ({children}: {children:React.ReactNode}) => {
    const [tempEmail, setTempEmail] = useState<string>("");
    const [tempOTP, setTempOTP] = useState<string>("");

    const [userEmail, setUserEmail] = useState<string>("");
    const [isLogged, setIsLogged] = useState<boolean>(false);

    const values: ContextValuesType = {
        tempEmail, setTempEmail,
        tempOTP, setTempOTP,
        userEmail, setUserEmail,
        isLogged, setIsLogged,
    }

    return (
        <WebContext.Provider value={values}>
            {children}
        </WebContext.Provider>
    )

}

export const useWeb = () => {
    const ctx = useContext(WebContext);
    if (!ctx) throw new Error("useWeb must be used within <WebProvider>")
    return ctx
}
