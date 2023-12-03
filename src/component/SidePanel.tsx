"use client";
import { UserContext } from "@/contexts/UserContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Tooltip, Typography, slider } from "@material-tailwind/react";
// import { Body, getClient } from "@tauri-apps/api/http";
import { useMessageContext } from "@/contexts/MessageContext";
// import msgstore from "@/hooks/messagestore";
// import { listen } from "@tauri-apps/api/event";

interface DropdownConfig {
    label: string;
    optionsFree: string[];
    optionsPaid?: string[];
    showToolTip?: boolean;
    premium: boolean;
}

interface Condition {
    to: string;
    smooth?: boolean;
    spy?: boolean;
    activeClass?: string;
    // Add other props specific to your component
}

interface HeaderConfig {
    text: string;
}

interface ToolTip {
    text: string;
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
    icon: any;
}

interface CheckConfig {
    label: string;
    optionsFree: string[];
    optionsPaid?: string[];
}

interface PanelConfig {
    dropdowns?: DropdownConfig[];
    checkboxes?: CheckConfig[];
    fileDrop?: boolean;
    sliders?: SliderConfig[];
    button?: ButtonConfig;
    header?: HeaderConfig;
    toolTip?: ToolTip;
    icon?: ScrollButton;
    condition: Condition;
}

interface SidePanelProps {
    content: PanelConfig;
    isOpen: boolean;
    onClose: () => void;
}

const SidePanel = ({ content, isOpen, onClose }: SidePanelProps) => {
    const { user } = useContext(UserContext)!;
    const { setMessages, messages, setLoading } = useMessageContext();
    const [isDragOver, setIsDragOver] = useState(false);
    const isPremium = user.subscriptionType === "premium";

    const [activeCheck, setActiveCheck] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{
        [key: string]: string[];
    }>({});
    const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>(
        {}
    );
    const [dropdownValues, setDropdownValues] = useState<{
        [key: string]: string;
    }>({});
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
        console.log(selectedFile);
    };

    const handlePanel = async (kind: string) => {
        setLoading(true);
        let composeUrl: string = "";
        let tempoLabel;
        let energyLabel;
        let body;
        let head;

        if (kind === "gen") {
            head = { headers: { "Content-Type": "application/json" } };

            const tempoValue = sliderValues.Tempo;
            if (tempoValue == 100) tempoLabel = "high";
            else if (tempoValue == 50) tempoLabel = "normal";
            else tempoLabel = "low";

            // Map the energy slider value to the corresponding label
            const energyValue = sliderValues.Energy;
            if (energyValue === 0) energyLabel = "Muted";
            else if (energyValue <= 25) energyLabel = "Low";
            else if (energyValue <= 50) energyLabel = "Medium";
            else if (energyValue <= 75) energyLabel = "High";
            else energyLabel = "Very High";
            composeUrl = "/musicgen";
            body = {
                genres: selectedOptions.Genres ? selectedOptions.Genres : [],
                moods: selectedOptions.Moods ? selectedOptions.Moods : [],
                themes: selectedOptions.Themes ? selectedOptions.Themes : [],
                mute_stems: [],
                file_format: ["mp3"],
                energy_levels: [
                    {
                        start: 0,
                        end: sliderValues.length ? sliderValues.length : 30,
                        energy: energyLabel ? energyLabel : "Medium",
                    },
                ],
                length: sliderValues.Length ? sliderValues.Length : 30,
                tempo: tempoLabel ? [tempoLabel] : ["normal"],
            };
            // body = Body.json(body);
        } else if (kind === "spl") {
            head = { headers: { "Content-Type": "multipart/form-data" } };
            composeUrl = "/split";
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append(
                    "model",
                    dropdownValues["Stems to Separate"]
                        ? dropdownValues["Stems to Separate"]
                        : "vocals"
                );
                if (isPremium)
                    formData.append(
                        "filter_type",
                        dropdownValues["Clean Up"] === "None"
                            ? "0"
                            : dropdownValues["Clean Up"] === "Normal"
                                ? "1"
                                : "2"
                    );
                else formData.append("filter_type", "1");
                // body = Body.form(formData);
            } else {
                console.error("No file selected");
                setLoading(false);
                return;
            }
            console.log(body);
        } else if (kind === "den") {
            head = { headers: { "Content-Type": "multipart/form-data" } };
            composeUrl = "/audo";
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                // body = Body.form(formData); // Directly use FormData for 'den' type
            } else {
                console.error("No file selected");
                setLoading(false);
                return;
            }
        }
        try {
            // const client = await getClient();
            console.log("Request body: ", body);
            // Send the POST request using Tauri's HTTP client
            // const response = await client.post(
            //     "https://assistant.heydaw.ai" + composeUrl,
            //     body,
            //     head
            // );
            // console.log("Response: ", response);

            // Check if the request was successful
            // if (response.ok) {
            //     // Handle the successful response
            //     const data: any = await response.data;
            //     console.log("Success: ", data.link);
            //     if (Array.isArray(data.link)) {
            //         // If it is, process each link
            //         data.link.forEach(async (link: any) => {
            //             setMessages((prevMessages) => [
            //                 ...prevMessages,
            //                 { type: "system", content: link },
            //             ]);
            //             await msgstore.set("messages", [
            //                 ...messages,
            //                 { type: "system", content: link },
            //             ]);
            //             console.log("Link: ", link);
            //         });
            //     } else {
            //         // If it's not, process the single link
            //         setMessages((prevMessages) => [
            //             ...prevMessages,
            //             { type: "system", content: data.link },
            //         ]);
            //         await msgstore.set("messages", [
            //             ...messages,
            //             { type: "system", content: data.link },
            //         ]);
            //     }
            //     // Process the data as needed
            // } else {
            //     // Handle any non-200 responses
            //     console.error("Error generating music:", response.status);
            //     setMessages((prevMessages) => [
            //         ...prevMessages,
            //         { type: "system", content: "Error processing file" },
            //     ]);
            //     await msgstore.set("messages", [
            //         ...messages,
            //         { type: "system", content: "Error processing file" },
            //     ]);
            // }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error("Error during music generation request:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: "system", content: "Error during music generation request" },
            ]);
            // await msgstore.set("messages", [
            //     ...messages,
            //     { type: "system", content: "Error during music generation request" },
            // ]);
        } finally {
            setLoading(false);
            // await msgstore.save();
        }
    };

    const handleSliderChange = (
        label: string,
        value: number,
        maxFree: number
    ) => {
        if (!isPremium && value > maxFree) {
            // Immediately reset value to maxFree for non-premium users
            setSliderValues((prev) => ({
                ...prev,
                [label]: maxFree,
            }));

            // Show warning toast
            toast.info(`Only premium users can go beyond ${maxFree} seconds.`, {
                autoClose: 2000,
            });
        } else {
            // Update the slider value as usual
            setSliderValues((prev) => ({
                ...prev,
                [label]: value,
            }));
        }
    };

    const toggleCheckDrop = (label: string) => {
        setActiveCheck(activeCheck === label ? null : label);
    };

    function renderCheckboxes(checkbox: CheckConfig, index: number) {
        function handleCheckboxChange(
            label: string,
            option: string,
            isChecked: boolean
        ) {
            setSelectedOptions((prev) => {
                const currentSelected = prev[label] || [];
                const isPremiumOption = content.checkboxes
                    ?.find((checkbox) => checkbox.label === label)
                    ?.optionsPaid?.includes(option);

                if (!isPremium && isPremiumOption && isChecked) {
                    toast.info("Upgrade to premium to access this feature.", {});

                    return prev;
                }

                if (isChecked) {
                    if (currentSelected.length < 3) {
                        return { ...prev, [label]: [...currentSelected, option] };
                    } else {
                        toast.warn("Maximum of 3 selections allowed.", {
                            autoClose: 2000,
                        });
                    }
                    return prev;
                } else {
                    return {
                        ...prev,
                        [label]: currentSelected.filter((opt) => opt !== option),
                    };
                }
            });
            console.log(selectedOptions);
        }
        function handleRemoveSelectedOption(label: string, optionToRemove: string) {
            setSelectedOptions((prev) => ({
                ...prev,
                [label]: prev[label].filter((option) => option !== optionToRemove),
            }));
        }
        const options = [...checkbox.optionsFree, ...(checkbox.optionsPaid ?? [])];

        return (
            <div
                key={index}
                className="dropdown relative justify-self-start flex -mt-5"
            >
                <div
                    className="dropdown-header rounded-lg flex p-2 w-32 bg-primary border border-1 border-buttonAccent glass text-white my-4 mx-2 cursor-pointer"
                    onClick={() => toggleCheckDrop(checkbox.label)}
                >
                    {checkbox.label}
                    <span className="dropdown-arrow inline-flex self-center justify-self-end">
                        <Icon
                            icon={
                                activeCheck === checkbox.label
                                    ? "mingcute:up-line"
                                    : "mingcute:down-line"
                            }
                            className="justify-self-end"
                        />
                    </span>
                </div>
                {activeCheck === checkbox.label && (
                    <div
                        className={`dropdown-content absolute mt-16 bg-black text-white border border-secondary rounded-xl shadow-md p-2 grid grid-cols-2 w-max z-20 max-h-60 overflow-auto ${activeCheck === checkbox.label ? "" : "hidden"
                            }`}
                    >
                        {options.map((option, idx) => {
                            const isChecked =
                                selectedOptions[checkbox.label]?.includes(option);
                            const isPremiumOption = checkbox.optionsPaid?.includes(option);
                            const isDisabled = isPremiumOption && !isPremium;

                            return (
                                <div
                                    key={idx}
                                    className="checkbox-container grid grid-cols-1 items-center m-1 p-1 overflow-clip"
                                >
                                    <input
                                        type="checkbox"
                                        id={option}
                                        name={checkbox.label}
                                        value={option}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                checkbox.label,
                                                option,
                                                e.target.checked
                                            )
                                        }
                                        checked={isChecked}
                                        disabled={isDisabled}
                                    />
                                    <label
                                        htmlFor={option}
                                        className={`cursor-pointer px-3 py-1 border-2 ${isChecked ? "bg-secondary text-black" : ""
                                            } ${isDisabled ? "border-gray-400 text-gray-400" : ""
                                            }  rounded-full`}
                                    >
                                        {option}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Render selected options next to the checkboxes */}
                {selectedOptions[checkbox.label]?.length > 0 && (
                    <div className="selected-options flex flex-row self-center items-center">
                        <div className="flex flex-wrap">
                            {selectedOptions[checkbox.label].map((selectedOption, idx) => (
                                <span
                                    key={idx}
                                    className="text-buttonAccent text-sm mr-2 cursor-pointer self-center"
                                    onClick={() =>
                                        handleRemoveSelectedOption(checkbox.label, selectedOption)
                                    }
                                >
                                    {selectedOption}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    function renderDropdown(dropdown: DropdownConfig, index: number) {
        const handleDropdownChange = (label: string, value: string) => {
            setDropdownValues((prev) => ({
                ...prev,
                [label]: value,
            }));
            console.log(dropdownValues);
        };

        const handleDropdownClick = () => {
            console.log(dropdown.premium);
            if (dropdown.premium) {
                toast.warn("Upgrade to premium to access this feature.", {
                    autoClose: 2000,
                });
            }
        };

        return (
            <div
                key={index}
                className="text-white m-4 justify-center self-center justify-self-center flex items-center"
            >
                <label className="text-transparent text-right bg-clip-text bg-secondary font-semibold mr-2">
                    {dropdown.label}
                </label>
                <div
                    className={`relative flex items-center justify-center ${dropdown.premium && !isPremium ? "bg-gray-500" : "bg-purplishblack"
                        }`}
                >
                    <select
                        className={`text-white appearance-none bg-transparent  rounded p-2`}
                        disabled={dropdown.premium && !isPremium}
                        onChange={(e) =>
                            handleDropdownChange(dropdown.label, e.target.value)
                        }
                    >
                        {dropdown.optionsFree.map((option, idx) => (
                            <option key={idx}>{option}</option>
                        ))}
                        {dropdown.optionsPaid?.map((option, idx) => (
                            <option disabled={!isPremium} key={idx}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none p-1">
                        <Icon icon="ph:caret-down" />
                    </div>
                    {dropdown.showToolTip && (
                        <Tooltip
                            content={
                                <div className="w-80 p-4">
                                    <Typography
                                        variant="small"
                                        color="white"
                                        className="font-normal opacity-80"
                                    >
                                        <span className="font-semibold">None</span>: Minimal
                                        adjustment to enhance audio subtly while keeping it true to
                                        the original.
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="white"
                                        className="font-normal opacity-80 mt-2"
                                    >
                                        <span className="font-semibold">Normal</span>: Moderate
                                        enhancement for improved clarity and definition without
                                        significantly altering the original.
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="white"
                                        className="font-normal opacity-80 mt-2"
                                    >
                                        <span className="font-semibold">Aggressive</span>: Intensive
                                        refinement for distinct audio elements, might change the
                                        original character of original.
                                    </Typography>
                                </div>
                            }
                        >
                            <button className="w-[18px] cursor-pointer  text-base border border-secondary/20 border-dashed bg-primary/20 rounded-full ml-1 mt-[3px] ">
                                <Icon icon="material-symbols-light:info-i" />
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>
        );
    }

    function renderSlider(slider: SliderConfig) {
        const calculateLabelPosition = (
            min: number,
            maxFree: number,
            maxPaid: number | undefined
        ) => {
            const range = (maxPaid ? maxPaid : maxFree) - min;
            const position = ((maxFree - min) / range) * 100;
            return `${position}%`;
        };
        const maxFreeLabelPosition = calculateLabelPosition(
            slider.min,
            slider.maxFree,
            slider.maxPaid
        );

        const renderSliderLabels = () => {
            if (slider.noValue) {
                return (
                    <div className="flex justify-between text-xs text-white mt-1">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                    </div>
                );
            } else if (slider.noValue2) {
                return (
                    <div className="flex justify-between text-xs text-white mt-1">
                        <span>Muted</span>
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                        <span>Max</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex justify-between text-xs text-white mt-1">
                        <span>{slider.min}</span>
                        <span
                            style={{ left: maxFreeLabelPosition }}
                            className="absolute hidden"
                        >
                            {slider.maxFree}
                        </span>
                        <span className="ml-auto">
                            {isPremium ? slider.maxPaid : slider.maxPaid}
                        </span>
                    </div>
                );
            }
        };
        const sliderValue = sliderValues[slider.label] || slider.min;

        // const sliderValue = isPremium
        //   ? sliderValues[slider.label] || slider.min
        //   : slider.maxFree;
        return (
            <div className="col-span-full flex flex-col my-4">
                <label className="mb-1 text-center text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                    {slider.label}
                </label>
                <div className="relative">
                    <input
                        type="range"
                        className="slider-thumb bg-transparent h-2 w-full cursor-pointer appearance-none rounded-lg focus:outline-none focus:ring"
                        min={slider.min}
                        max={slider.maxPaid}
                        step={slider.step || 1} // Use step from config, default to 1 if not specified
                        value={sliderValue}
                        onChange={(e) =>
                            handleSliderChange(
                                slider.label,
                                parseInt(e.target.value, 10),
                                slider.maxFree
                            )
                        }
                    />

                    {renderSliderLabels()}
                </div>
            </div>
        );
    }

    const convertLengthToDecimal = (minutes: number, seconds: number): number => {
        return parseFloat((minutes + seconds / 60).toFixed(1));
    };
    function renderFileDrop() {
        const handleFileChange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const fileSizeInMB = file.size / (1024 * 1024);

                if (!isPremium && fileSizeInMB > 500) {
                    toast.error(
                        "File size exceeds the limit. Upgrade to premium for larger uploads.",
                        {
                            autoClose: 3000,
                        }
                    );
                    return;
                }
                setSelectedFile(file);
                console.log(selectedFile);
            }

            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                let durationInUnits = convertLengthToDecimal(
                    Math.floor(audio.duration / 60),
                    audio.duration % 60
                );
                if (durationInUnits > 500) {
                    toast.error(
                        "You don't have sufficient credits to upload this audio file.",
                        {
                            autoClose: 3000,
                        }
                    );

                    return;
                }
            };
        };

        return (
            <div className="text-white items-center grid grid-cols-1">
                <p className="text-transparent bg-clip-text bg-secondary font-semibold">
                    Upload Audio
                </p>
                <label
                    htmlFor="file-upload"
                    className={`cursor-pointer p-8 border-4 border-dashed justify-center items-center glass rounded overflow-clip text-center transition-all duration-300 ease-in-out ${isDragOver ? "bg-opacity-90 pulsate-load" : "bg-opacity-70"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                // style={{ minHeight: "100px",   fontSize: "1.5rem" }}
                >
                    {selectedFile
                        ? selectedFile.name
                        : "Drag & Drop or Click to Choose a File"}
                </label>
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".mp3, .wav, .m4a"
                />
            </div>
        );
    }

    function renderContent() {
        if (!content) {
            return <p>No configuration provided.</p>;
        }

        const contentElements = Object.keys(content)
            .map((key) => {
                switch (key) {
                    case "dropdowns":
                        return content.dropdowns?.map(renderDropdown);
                    case "checkboxes":
                        return content.checkboxes?.map(renderCheckboxes);
                    case "fileDrop":
                        return content.fileDrop ? renderFileDrop() : null;
                    case "sliders":
                        return content.sliders?.map(renderSlider);
                    default:
                        return null;
                }
            })
            .filter(Boolean);

        return contentElements.length > 0 ? (
            <div className="m-4 grid">
                {content.toolTip && (
                    <Tooltip
                        content={
                            <div className="w-80 p-4">
                                <Typography
                                    variant="small"
                                    color="white"
                                    className="font-normal opacity-80"
                                >
                                    {content.toolTip.text}
                                </Typography>
                            </div>
                        }
                    >
                        <button className="w-6 h-6 cursor-pointer absolute text-xl border border-secondary/20 border-dashed bg-primary/20 rounded-full ml-1 text-white top-0 right-0 m-4 ">
                            <Icon icon="bx:question-mark" />
                        </button>
                    </Tooltip>
                )}

                {content.header && (
                    <p className="col-span-full m-4 text-center top-0 text-3xl text-white/10 drop-shadow-md bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                        {content.header.text}
                    </p>
                )}

                {/* {
          content.icon && (
            <div className="text-white absolute right-0 top-[450px] bg-primary p-5 z-30">
              <p>{content.icon.scrollIcon}</p>
            </div>

            <Link
              activeClass='active'
              smooth={true}
              spy={true}
              to='home' c
              lassName='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
              <p>{content.icon.scrollIcon}</p>

            </Link>

          )
        } */}
                {contentElements}

                {content.button && (
                    <button
                        onClick={() => handlePanel(content.button?.onClick || "")}
                        className="col-span-full bottom-0 right-4 m-8 mx-auto bg-primary gap-2 text-white text-center p-2 rounded-lg flex items-center justify-items-center justify-center"
                    >
                        <p>{content.button.text}</p>
                        <p className="text-xl" id="skills">
                            {content.button.icon}
                        </p>
                    </button>
                )}
            </div>
        ) : (
            <p>No valid configuration found.</p>
        );
    }

    if (!isOpen) {
        return null;
    }

    return (
        isOpen && (
            <div
                className="fixed top-0 right-0 w-2/5 h-full bg-black p-2 z-50 overflow-y-auto flex flex-col glass"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <button
                    onClick={onClose}
                    className="absolute left-0 transform bg-black2 m-1 mx-2 h-8 w-8 justify-center rounded-full flex items-center justify-self-center self-center text-white shadow-md"
                    aria-label="Close"
                >
                    <Icon icon="ph:x" width={18} />
                </button>
                {renderContent()}
            </div>
        )
    );
};

export default SidePanel;
