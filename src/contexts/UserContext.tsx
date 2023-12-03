"use client";
// import store from "@/hooks/store";
import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from "react";
import { AuthContext } from "./AuthContext";
// import { getClient } from "@tauri-apps/api/http";

export type User = {
    id: string | null;
    name: string | null;
    email: string | null;
    profilePictureUrl: string | null;
    subscriptionType: string | null;
    credits: number | null;
    nextRenewalDate: number | null;
};

export interface UserContextProps {
    user: User;
    open: boolean;
    setOpen: (open: boolean) => void;
    setUser: (user: User) => void;
    getInfo: (tokens: any) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
    undefined
);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({
        id: null,
        name: "Shankar",
        email: "pi@heydaw.ai",
        profilePictureUrl: "https://picsum.photos/300",
        subscriptionType: null,
        credits: 10,
        nextRenewalDate: new Date(2024, 3, 5).getTime(),
    });
    const [open, setOpen] = useState(false);

    const logout = () => {
        setUser({
            id: null,
            name: null,
            email: null,
            profilePictureUrl: null,
            subscriptionType: null,
            credits: null,
            nextRenewalDate: null,
        });
        // store.delete("user");
    };

    const getInfo = async (tokens: any) => {
        // try {
        //     // const client = await getClient();
        //     const head = {
        //         headers: { Authorization: `Bearer ${tokens.accessToken}` },
        //     };

        //     const userResponse = await client.get(
        //         "https://server.heydaw.ai/api/users/me",
        //         head
        //     );
        //     console.log(userResponse.data);

        //     // // Save user profile information to context
        //     const {
        //         id,
        //         name,
        //         email,
        //         profilePictureUrl,
        //         subscriptionType,
        //         nextRenewalDate,
        //         credits,
        //     }: any = userResponse.data;
        //     setUser({
        //         id,
        //         name,
        //         email,
        //         profilePictureUrl,
        //         subscriptionType,
        //         nextRenewalDate,
        //         credits,
        //     });
        // } catch (error) {
        //     console.error(error);
        // }
    };

    // useEffect(() => {
    //     (async () => {
    //         const jsonUser = (await store.get("user")) as string | null;
    //         if (jsonUser) {
    //             const {
    //                 id,
    //                 name,
    //                 email,
    //                 profilePictureUrl,
    //                 subscriptionType,
    //                 credits,
    //                 nextRenewalDate,
    //             } = JSON.parse(jsonUser);
    //             setUser({
    //                 id,
    //                 name,
    //                 email,
    //                 profilePictureUrl,
    //                 subscriptionType,
    //                 credits,
    //                 nextRenewalDate,
    //             });
    //         }
    //     })();
    // }, []);

    useEffect(() => {
        if (user.id && user.name && user.email && user.profilePictureUrl) {
            const jsonUser = JSON.stringify(user);
            // store.set("user", jsonUser);
        }
    }, [user]);

    return (
        <UserContext.Provider
            value={{ user, open, setOpen, setUser, getInfo, logout }}
        >
            {children}
        </UserContext.Provider>
    );
};
