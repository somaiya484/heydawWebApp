"use client";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Message, useMessageContext } from "@/contexts/MessageContext";
import SidePanel from "./SidePanel";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import SuggesterModal from "./modal";
import AudioPlayer from "./AudioPlayer";

export default function MessageContainer() {
    const { messages, loading, showModal, closeModal } = useMessageContext();
    // const lastUserMessageIndex = messages.map((m) => m.type).lastIndexOf("user");
    const latestMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const groupMessages = () => {
        const grouped = [];
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].type === "user") {
                const group = [messages[i]];
                if (i + 1 < messages.length && messages[i + 1].type === "response") {
                    group.push(messages[i + 1]);
                    i++; // Skip the next message as it's already included
                }
                grouped.push(group);
            } else if (messages[i].type === "system") {
                grouped.push([messages[i]]);
            }
        }
        return grouped;
    };
    const isAudioLink = (message: Message) => {
        // Regex for checking if the URL ends with .mp3, .wav, or .m4a
        const audioRegex = /\.(mp3|wav|m4a)$/i;
        // Regex for checking if the URL starts with d.lalal.ai
        const lalalRegex = /^https?:\/\/d\.lalal\.ai/i;
        return audioRegex.test(message.content) || lalalRegex.test(message.content);
    };

    const groupedMessages = groupMessages();

    return (
        <div
            id="message-container"
            className="bg-newblack relative p-4 pt-0 transition-transform duration-500 ease-in-out transform z-0 row-start-1 row-span-full h-full w-full overflow-y-auto"
        >
            {groupedMessages.map((group, index) => (
                <div
                    key={index}
                    ref={index === groupedMessages.length - 1 ? latestMessageRef : null}
                    className="mt-4 max-w-3xl"
                >
                    {group.map((message, idx) => (
                        <div
                            key={idx}
                            className={`rounded-lg m-1 text-white self-start flex flex-col gap-1 items-start`}
                        >
                            <div
                                className={`text-white p-3 self-start break-words whitespace-pre-wrap w-fit shadow-xl ${message.type === "user"
                                        ? "bg-gradient-to-b from-[#4641ad] to-[#343371] rounded-tr-lg user"
                                        : message.type === "response"
                                            ? "bg-gradient-to-b from-[#212045] to-[#181832] rounded-br-lg heydaw"
                                            : "bg-gradient-to-r from-[#2b276a] to-[#1b1b3e] rounded-lg"
                                    }`}
                            >
                                {message.type === "system" && isAudioLink(message) ? (
                                    <AudioPlayer src={message.content} />
                                ) : (
                                    <span>{message.content}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && index === groupedMessages.length - 1 && (
                        <div className="loading-container flex m-1 justify-center items-center bg-gradient-to-t from-[#1f1f39] to-[#292857] text-white p-4 rounded-br-lg self-start w-fit">
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
