import Image from "next/image";
import logo from "../assets/logo.png";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { useMessageContext } from "@/contexts/MessageContext";
import { useRouter } from "next/navigation";
import { split } from "postcss/lib/list";
import { Icon } from "@iconify/react/dist/iconify.js";
// import SuggesterModal from "./modal";
// import { toast } from "react-toastify";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

interface HeaderConfig {
    text: string;
}

interface ToolTip {
    text: string;
}

interface ButtonConfig {
    text: string;
    onClick: string;
    icon: any;
}

interface DropdownConfig {
    label: string;
    optionsFree: string[];
    optionsPaid?: string[];
    showToolTip?: boolean;
    premium: boolean;
}

interface ScrollButton {
    scrollIcon: string;
}

interface SliderConfig {
    label: string;
    min: number;
    maxFree: number;
    maxPaid?: number;
    noValue?: boolean;
    noValue2?: boolean;
    step?: number;
}

interface ButtonConfig {
    text: string;
    onClick: string;
}

interface CheckConfig {
    label: string;
    optionsFree: string[];
    optionsPaid?: string[];
}
interface Notification {
    notification: any;
}

export interface PanelConfig {
    header?: HeaderConfig;
    dropdowns?: DropdownConfig[];
    checkboxes?: CheckConfig[];
    fileDrop?: boolean;
    sliders?: SliderConfig[];
    button?: ButtonConfig;
    scrollButton?: ScrollButton;
    toolTip?: ToolTip;
    icon?: ScrollButton;
    notificationText?: Notification;
}

const panelConfigs: { [key: string]: PanelConfig } = {
    split: {
        header: { text: "Separate" },
        toolTip: {
            text: `HeyDaw Separate is a game-changer for music enthusiasts and producers. <br/> By uploading your track and selecting the component to isolate (vocals or instruments), you receive two outputs: the isolated stem and the remaining track, ready for seamless integration into your DAW. It revolutionizes music analysis and production, unlocking endless possibilities. 🎵🔍🎶`,
        },
        fileDrop: true,
        dropdowns: [
            {
                label: "Stems to Separate",
                optionsFree: [
                    "Vocals",
                    "Voice",
                    "Drum",
                    "Bass",
                    "Piano",
                    "Electric guitar",
                    "Acoustic guitar",
                    "Synthesizer",
                    "Strings",
                    "Wind Instruments",
                ],
                premium: false,
            },
            {
                label: "Clean Up",
                optionsFree: ["None", "Normal", "Aggressive"],
                showToolTip: true,
                premium: true,
            },
        ],
        button: {
            text: "Separate",
            onClick: "spl",
            icon: <Icon icon="ph:arrows-split-light"></Icon>,
        },
    },
    denoise: {
        fileDrop: true,
        button: {
            text: "Denoise",
            onClick: "den",
            icon: <Icon icon="icon-park-outline:waves-right"></Icon>,
        },
        header: { text: "Denoise" },
        toolTip: {
            text: `HeyDaw Denoise is your go-to solution for pristine audio quality. By uploading your audio file, our advanced AI eliminates unwanted noise while preserving the original sound's integrity. Seamlessly integrate the polished audio into your DAW for crystal-clear results. Perfect for podcasters and audio professionals, HeyDaw Denoise ensures uncompromised sound clarity. 🎙️🔊✨
      `,
        },
    },
};

type FooterProps = {
    onOpenPanel: (config: PanelConfig) => void;
};

export default function Footer({ onOpenPanel }: FooterProps) {
    const router = useRouter();
    const {
        setInputValue,
        handleSendMessage,
        loading,
        inputValue,
        transcript,
        setIsPanelOpen,
        setPanelContent,
        openModal,
        closeModal,
        deleteMessages,
    } = useMessageContext();

    const recognitionRef = useRef<any>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const [pulsate, setPulsate] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const startRecording = () => {
        setIsRecording(true);
        // Create a new SpeechRecognition instance and configure it
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        // console.log(recognitionRef.current);

        // Event handler for speech recognition results
        recognitionRef.current.onresult = (event: any) => {
            const { transcript } = event.results[event.results.length - 1][0];

            // Log the recognition results and update the transcript state
            // console.log(event.results);
            // props.setTranscript(transcript);
            setInputValue(transcript);
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
            // props.setInputValue("");
            // props.handleSendMessage();
            // while (props.loading) props.setTranscript("Processing...");
            // props.handleSendMessage();
            // props.setTranscript("");
        };

        // recognitionRef.current.onerror = (event: any) => {
        //     if (event.error === "not-allowed") {
        //         toast.error("Please allow microphone access to use voice commands");
        //     }
        //     console.log("Recognition error: ", event.error);
        // };

        // Start the speech recognition
        recognitionRef.current.start();
    };

    useEffect(() => {
        return () => {
            // Stop the speech recognition if it's active
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Function to stop recording
    const stopRecording = () => {
        if (recognitionRef.current) {
            // Stop the speech recognition and mark recording as complete
            recognitionRef.current.stop();
            setRecordingComplete(true);
        }
    };

    // Toggle recording state and manage recording actions
    const handleToggleRecording = () => {
        setInputValue("");
        setIsRecording(!isRecording);
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    useEffect(() => {
        if (pulsate) {
            const timer = setTimeout(() => {
                setPulsate(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [pulsate]);

    const handlePulsate = () => {
        setPulsate(true);
    };
    const openPanelWithContent = (contentConfig: PanelConfig) => {
        onOpenPanel(contentConfig);
    };
    return (
        <div className="w-full h-auto bottom-0 items-center bg-footerblack border-t border-black2 shadow-lg grid">
            <div className="w-full h-full row-start-1 col-span-full z-0 justify-center grid">
                <Image
                    src={logo}
                    alt="HeyDaw Logo"
                    draggable={false}
                    className={`this sm:w-28 w-24 mt-2 select-none ${loading ? "pulsate-load" : ""
                        } ${pulsate ? "pulsate-image" : ""}`}
                    ref={logoRef}
                />
            </div>
            <div
                id="footer"
                className="grid grid-rows-2 p-3 row-start-1 col-span-full select-none z-10 w-full h-full bg-footerblack glass"
            >
                <div className="row-start-1 grid self-start grid-cols-3">
                    <div className="row-start-1 justify-self-start col-start-1 gap-4">
                        {/* <IconButton
              icon="ph:trash"
              title="Delete Messages"
              onClick={() => deleteMessages()}
            /> */}
                        <IconButton
                            icon="ph:arrows-split-light"
                            title="Separate"
                            onClick={() => openPanelWithContent(panelConfigs.split)}
                        />
                        <IconButton
                            icon="icon-park-outline:waves-right"
                            title="Denoise"
                            onClick={() => openPanelWithContent(panelConfigs.denoise)}
                        />
                    </div>
                    <div className="row-start-1 justify-self-center col-start-2">
                        <Image
                            src={logo}
                            alt="HeyDaw Logo"
                            className="sm:w-20 w-16"
                            onClick={handlePulsate}
                        />
                    </div>
                    <div className="row-start-1 justify-self-end col-start-3">
                        <IconButton
                            icon="ant-design:question-outlined"
                            title="Help"
                            onClick={openModal}
                        />

                        {/* <IconButton
              icon="ph:microphone"
              title="Voice Command"
              onClick={handleToggleRecording}
              color={isRecording ? "red" : ""}
              className={isRecording ? "pulsate-load" : ""}
              disabled={loading}
            /> */}
                        <IconButton
                            className="Profile-button"
                            icon="ph:user-circle-gear"
                            title="Profile"
                            onClick={() => router.replace("/profile")}
                        />
                    </div>
                </div>
                {/* <div className="text-white mb-2">{transcript}</div> */}
                <div className="row-start-2 grid grid-cols-8 grid-rows-1 self-end">
                    <input
                        type="text"
                        id="input"
                        className={`main-comm col-start-1 col-span-full row-start-1 mr-1 p-3 pl-6 mt-1 ml-0 rounded-full self-center text-white bg-transparent border border-white focus:border-secondary border-opacity-50 text-md ${inputValue && isRecording
                                ? "placeholder:text-white"
                                : "placeholder:text-white/60"
                            }`}
                        placeholder={
                            transcript && isRecording ? transcript : "Start by typing here..."
                        }
                        autoComplete="off"
                        maxLength={400}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                handleSendMessage();
                            }
                            if (e.code === "NumpadEnter") {
                                handleSendMessage();
                            }
                        }}
                        disabled={loading || isRecording}
                    />

                    <button
                        title="Send"
                        onClick={handleSendMessage}
                        disabled={loading || isRecording}
                        className="self-center justify-self-end w-12 h-12 row-start-1 bg-[#5b54e039] text-3xl rounded-full text-center pl-2 border border-primary text-secondary"
                    >
                        <Icon icon="ph:paper-plane-tilt" />
                    </button>
                </div>
            </div>
        </div>
    );
}
