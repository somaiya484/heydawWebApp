"use client";

import React, {
    createContext,
    useContext,
    useState,
    FC,
    ReactNode,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import axios from "axios";
// import msgstore from "@/hooks/messagestore";
// import { Body, Response, getClient } from "@tauri-apps/api/http";

// Define the shape of the message
export type Message = {
    type: "user" | "response" | "system";
    content: string;
};

type HistoryType = {
    user: string[];
    response: string[];
};

interface ProfileInfo {
    daw: string;
    version: string;
    proficiency: string;
    personalization: boolean;
}

export const dawOptions: DAWOption[] = [
    {
        daw: "Logic Pro",
        versions: ["Version-10+"],
    },
    {
        daw: "Ableton Live",
        versions: ["Version-11", "Version-10"],
    },

    {
        daw: "Cubase",
        versions: ["Version-13+", "Version-12+", "Version-11+"],
    },
    {
        daw: "Pro Tools",
        versions: ["Version-22.12+", "Version-23.6+", "Version-23.9+"],
    },
    {
        daw: "FL Studio",
        versions: ["Version-21+", "Version-20+"],
    },
    { daw: "Reaper", versions: ["Version-7.0+"] },
    { daw: "Garage Band", versions: ["Version-10+"] },
    { daw: "Presonus", versions: ["V6+"] },
    { daw: "Bitwig", versions: ["V5+"] },
];
interface DAWOption {
    daw: string;
    versions: string[];
}

// Define the shape of the context with an interface.
interface MessageContextProps {
    messages: Message[];
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    handleSendMessage: () => Promise<void>;
    transcript: string;
    setTranscript: Dispatch<SetStateAction<string>>;
    isPanelOpen: boolean;
    setIsPanelOpen: Dispatch<SetStateAction<boolean>>;
    setPanelContent: Dispatch<SetStateAction<any>>;
    panelContent: any; // Replace `any` with a more specific type if possible
    onClose: () => void;
    config: any; // Replace `any` with a more specific type if possible
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    showModal: boolean;
    setMessages: Dispatch<SetStateAction<Message[]>>;
    selections: ProfileInfo;
    setSelections: Dispatch<SetStateAction<ProfileInfo>>;
    deleteMessages: () => void;
}

// Define the type for the children prop.
type MessageProviderProps = {
    children: ReactNode;
};

// Provide a default value matching the shape of the context.
const defaultContextValue: MessageContextProps = {
    messages: [],
    inputValue: "",
    setInputValue: () => { },
    loading: false,
    setLoading: () => { },
    handleSendMessage: async () => { },
    transcript: "",
    setTranscript: () => { },
    isPanelOpen: false,
    panelContent: null,
    setIsPanelOpen: () => { },
    setPanelContent: () => { },
    onClose: () => { },
    config: {},
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
    showModal: false,
    setMessages: () => { },
    selections: {
        daw: dawOptions[0].daw,
        version: dawOptions[0].versions[0],
        proficiency: "beginner",
        personalization: false,
    },
    setSelections: () => { },
    deleteMessages: () => { },
};

const MessageContext = createContext<MessageContextProps>(defaultContextValue);

export const useMessageContext = () => useContext(MessageContext);

export const MessageProvider: FC<MessageProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>("");
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
    const [panelContent, setPanelContent] = useState<any>(null); // Use a specific type if available
    const [showModal, setShowModal] = useState(false);
    const [selections, setSelections] = useState<ProfileInfo>({
        daw: dawOptions[0].daw,
        version: dawOptions[0].versions[0],
        proficiency: "beginner",
        personalization: false,
    });

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        // Load messages from storage and update state
        const loadMessages = async () => {
            // const storedMessages = (await msgstore.get("messages")) || [];
            // setMessages([...(storedMessages as Message[])]); // Cast to Message[] if necessary
        };
        loadMessages();
    }, []);

    const deleteMessages = async () => {
        // await msgstore.reset();
        setMessages([]);
    };

    const handleSendMessage = async () => {
        const lastThreeMessages = messages.slice(-6);

        const history: HistoryType = {
            user: [],
            response: [],
        };
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        setLoading(true);
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: "user", content: trimmedInput },
        ]);
        setInputValue("");

        try {
            // const client = await getClient();
            // Get the last three messages
            lastThreeMessages.forEach((message) => {
                if (message.type === "user") {
                    history.user.push(message.content);
                } else if (message.type === "response") {
                    history.response.push(message.content);
                }
            });

            // const body = Body.json({
            //     query: trimmedInput,
            //     history: history,
            //     prefs: selections,
            //     ident: "user",
            // });
            // console.log(body);
            // const response: any = await client.post(
            //     "https://assistant.heydaw.ai/query",
            //     body
            // );
            // console.log(response);
            // const result = response.data.answer ? response.data.answer : "No result";
            // const error = response.data.error;

            // if (error) throw new Error(error);

            // setMessages((prevMessages) => [
            //     ...prevMessages,
            //     { type: "response", content: result },
            // ]);
            // await msgstore.set("messages", [
            //     ...messages,
            //     { type: "user", content: trimmedInput },
            //     { type: "response", content: result },
            // ]);
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.error
                    : "An unknown error occurred";

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    type: "response",
                    content: `Sorry, an error occurred: ${errorMessage}`,
                },
            ]);
            // await msgstore.set("messages", [
            //     ...messages,
            //     { type: "user", content: trimmedInput },
            //     { type: "response", content: errorMessage },
            // ]);
        } finally {
            setLoading(false);
            // await msgstore.save();
        }
    };

    // The actual value provided to the context consumers
    const contextValue: MessageContextProps = {
        messages,
        inputValue,
        setInputValue,
        loading,
        setLoading,
        handleSendMessage,
        transcript,
        setTranscript,
        isPanelOpen,
        setIsPanelOpen,
        panelContent,
        setPanelContent,
        onClose: () => setIsPanelOpen(false), // Define the onClose method
        config: {}, // This should be the actual config object with a specific type
        isOpen: isPanelOpen,
        showModal,
        openModal,
        closeModal,
        setMessages,
        selections,
        setSelections,
        deleteMessages,
    };

    return (
        <MessageContext.Provider value={contextValue}>
            {children}
        </MessageContext.Provider>
    );
};
