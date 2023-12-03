// AuthContext.tsx
"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
// import store from "@/hooks/store";

type Tokens = {
    accessToken: string | null;
    refreshToken: string | null;
};

export interface AuthContextProps {
    tokens: Tokens;
    setTokens: (tokens: Tokens) => void;
    logout: () => void;
    isAuthChecked: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [tokens, setTokens] = useState<Tokens>({
        accessToken: null,
        refreshToken: null,
    });
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const logout = () => {
        setTokens({ accessToken: null, refreshToken: null });
        // store.delete("tokens");
        // store.delete("profileInfo");
    };

    // useEffect(() => {
    //     (async () => {
    //         const jsonTokens = (await store.get("tokens")) as string | null;
    //         if (jsonTokens) {
    //             const { accessToken, refreshToken } = JSON.parse(jsonTokens);
    //             setTokens({ accessToken, refreshToken });
    //         }
    //         setIsAuthChecked(true);
    //     })();
    // }, []);

    // useEffect(() => {
    //     if (tokens.accessToken && tokens.refreshToken) {
    //         const jsonTokens = JSON.stringify(tokens);
    //         store.set("tokens", jsonTokens);
    //         store.save();
    //     }
    // }, [tokens]);

    return (
        <AuthContext.Provider value={{ tokens, setTokens, logout, isAuthChecked }}>
            {children}
        </AuthContext.Provider>
    );
};
