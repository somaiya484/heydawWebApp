"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { UserContext } from "@/contexts/UserContext";
// import store from "@/hooks/store";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
// import { open as openit } from "@tauri-apps/api/shell";
// import msgstore from "@/hooks/messagestore";
// import ProtectRoute from "@/components/ProtectRoute";
import { dawOptions, useMessageContext } from "@/contexts/MessageContext";
// import { event } from "@tauri-apps/api";
import { Tooltip } from "@material-tailwind/react";
import { get } from "http";

interface ProfileInfo {
    daw: string;
    version: string;
    proficiency: string;
    personalization: boolean;
}

const Profile = () => {
    const { user, getInfo } = useContext(UserContext)!;
    const { logout: logoutAuth, tokens } = useContext(AuthContext)!;
    const { logout: logoutUser, setUser } = useContext(UserContext)!;
    const { selections, setSelections } = useMessageContext();
    const router = useRouter();
    const handleLogout = () => {
        logoutAuth(); // Call logout function from AuthContext
        logoutUser(); // Call logout function from UserContext
        router.replace("/auth/login"); // Redirect to login or home page after logout
    };
    const proficiencyLevels = ["Newbie", "Beginner", "Intermediate", "Pro"];

    const handleUpgrade = () => {
        // openit("https://heydaw.ai/pricing");
    };

    const storeSettings = async (changeObj: {}) => {
        console.log("Saving selections", selections);
        // await store.set("profileInfo", { ...selections, ...changeObj });
        // await store.save();
    };

    const handleProficiencyChange = (event: any) => {
        const level = proficiencyLevels[event.target.value];
        setSelections((prev) => ({ ...prev, proficiency: level }));
        storeSettings({ proficiency: level });
    };

    const handlePersonalizationToggle = (event: any) => {
        setSelections((prev) => ({
            ...prev,
            personalization: !prev.personalization,
        }));
        storeSettings({ personalization: !selections.personalization });
    };

    const handleDAWChange = (event: any) => {
        const newDAW = event.target.value;
        const newVersion =
            dawOptions.find((daw) => daw.daw === newDAW)?.versions[0] || "";
        setSelections((prevState) => ({
            ...prevState,
            daw: newDAW,
            version: newVersion,
        }));
        storeSettings({ daw: newDAW, version: newVersion });
    };

    const handleVersionChange = (event: any) => {
        setSelections((prev) => ({ ...prev, version: event.target.value }));
        storeSettings({ version: event.target.value });
    };

    function formatDate(timestamp: string | number | Date | null) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.toLocaleString("en-IN", { month: "long" }); // Get the month in words
        const day = date.getDate();
        return `${day} ${month} ${year}`;
    }

    const fetchProfileInfo = async () => {
        // try {
        //     const savedProfileInfo = (await store.get(
        //         "profileInfo"
        //     )) as ProfileInfo | null; // Type assertion
        //     console.log(savedProfileInfo);
        //     if (savedProfileInfo && typeof savedProfileInfo === "object") {
        //         // Type checking
        //         setSelections((prevState) => ({
        //             ...prevState,
        //             ...savedProfileInfo,
        //             daw: savedProfileInfo.daw ? savedProfileInfo.daw : dawOptions[0].daw,
        //             version: savedProfileInfo.version
        //                 ? savedProfileInfo.version
        //                 : dawOptions[0].versions[0],
        //             proficiency: savedProfileInfo.proficiency
        //                 ? savedProfileInfo.proficiency
        //                 : "beginner",
        //             personalization: savedProfileInfo.personalization
        //                 ? savedProfileInfo.personalization
        //                 : false,
        //         }));
        //     }
        // } catch (err) {
        //     console.error("Error fetching profile info from store", err);
        // }
    };

    useEffect(() => {
        fetchProfileInfo();
        getInfo(tokens);
    }, []);

    // useEffect(() => {
    //   const storeSettings = async () => {
    //     // console.log("Saving selections", selections);
    //     await store.set("profileInfo", selections);
    //     await store.save();
    //   };
    //   storeSettings();
    // }, [selections]);

    const filteredVersions =
        dawOptions.find((daw) => daw.daw === selections.daw)?.versions || [];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full pb-4 bg-newblack">
            {/* Header */}
            <div className="sticky top-0 z-10 grid w-screen grid-cols-3 items-center bg-purplishblack glass border-b border-secondary/25 text-white p-6">
                <button
                    onClick={() => router.replace("/")}
                    className="flex justify-self-start items-center justify-center col-start-1"
                >
                    <Icon icon="ph:caret-left" className="mr-2" />
                    {/* Margin for spacing */}
                    <span>Back</span>
                </button>
                <h1 className="text-xl font-bold col-start-2 col-span-1 text-center">
                    Profile
                </h1>
            </div>
            {/* User Profile Information */}
            <div className="flex items-center justify-center m-4 mt-0 mb-0 bg-black2 p-6 rounded-lg shadow-md col-span-full ">
                {/* <Image
                    src={user.profilePictureUrl || "https://picsum.photos/300"}
                    width={300}
                    height={300}
                    alt="User Profile"
                    className="rounded-full h-24 w-24 mr-4" // Adjust size as needed
                /> */}
                <div className="flex flex-col">
                    <h3 className="text-white text-2xl font-bold">
                        {user.name ? user.name : "Shankar"}
                    </h3>
                    <p className="text-gray-400">
                        {user.email ? user.email : "pi@heydaw.ai"}
                    </p>
                </div>
            </div>

            {/* User Subscription Details */}
            <div className="bg-black2 p-6 ml-4 rounded-lg shadow-md flex flex-col items-center justify-center space-y-6">
                <div className="flex flex-col items-center border-b pb-4">
                    <h2 className="text-white text-2xl font-bold mb-2">
                        Subscription Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <span className="text-gray-400 font-bold">Subscription Tier</span>
                        <span className="text-gray-400">
                            {user.subscriptionType ? user.subscriptionType : "Free"}
                        </span>
                        <span className="text-gray-400 font-bold">Next Renewal</span>
                        <span className="text-gray-400">
                            {formatDate(user.nextRenewalDate)}
                        </span>
                        <span className="text-gray-400 font-bold">Credits Remaining</span>
                        <span className="text-gray-400">{user.credits}</span>
                    </div>
                </div>
                <div className="flex gap-4 justify-evenly">
                    <button
                        onClick={handleUpgrade}
                        className="bg-primary text-white py-2 px-4 rounded w-full"
                    >
                        Buy Credits
                    </button>
                    {user.subscriptionType === null && (
                        <button
                            // onClick={handleUpgrade}
                            className="bg-primary text-white py-2 px-4 rounded justify-self-center"
                        >
                            <a
                                href="https://heydaw.ai/pricing"
                                target="_blank"
                                className="no-underline"
                            >
                                Upgrade
                            </a>
                        </button>
                    )}
                </div>
            </div>

            {/* User Profile Settings */}
            <div className="bg-black2 p-6 mr-4 rounded-lg shadow-md">
                {/* DAW Selection */}
                <div className="mb-4 relative flex items-center justify-between">
                    <label className="text-white text-lg font-normal self-center mx-4 ml-0 block">
                        DAW
                    </label>
                    <div className="w-fit h-fit relative flex self-center items-center bg-buttonAccent rounded-md">
                        <select
                            className="w-fit appearance-none bg-transparent text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="daw"
                            id="daw"
                            value={selections.daw}
                            onChange={handleDAWChange}
                        >
                            {dawOptions.map((dawOption) => (
                                <option key={dawOption.daw} value={dawOption.daw}>
                                    {dawOption.daw}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none p-3">
                            <Icon icon="ph:caret-down" />
                        </div>
                    </div>
                </div>

                {/* DAW Version Selection */}
                <div className="mb-4 flex justify-between">
                    <label className="text-white text-lg font-normal mx-4 ml-0 self-center block">
                        DAW Version
                    </label>
                    <div className="w-fit h-fit relative flex items-center self-center bg-buttonAccent rounded-md">
                        <select
                            className="w-fit appearance-none bg-transparent text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="dawVersion"
                            id="dawVersion"
                            onChange={handleVersionChange}
                        >
                            {filteredVersions.map((version) =>
                                version == selections.version ? (
                                    <option key={version} value={version} selected>
                                        {version}
                                    </option>
                                ) : (
                                    <option key={version} value={version}>
                                        {version}
                                    </option>
                                )
                            )}
                        </select>
                        <div className="pointer-events-none p-3">
                            <Icon icon="ph:caret-down" />
                        </div>
                    </div>
                </div>

                {/* Proficiency Slider */}
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <label className="text-white text-lg self-center font- m-1">
                            Your Proficiency with {selections.daw}
                        </label>
                        <Tooltip
                            content={
                                <div className="w-64 h-fit p-3">
                                    <p className="text-white text-sm">
                                        The slider gauges your familiarity with {selections.daw},
                                        assisting in personalized responses to match your
                                        expertise level. Proficiency is categorized into four
                                        levels: Newbie, Beginner, Intermediate, and Pro.
                                    </p>
                                </div>
                            }
                        >
                            <Icon icon="ph:question" width={15} />
                        </Tooltip>
                    </div>

                    <input
                        type="range"
                        min="0"
                        step="1"
                        max="3"
                        value={proficiencyLevels.indexOf(selections.proficiency)}
                        onChange={handleProficiencyChange}
                        className="slider w-full"
                        id="proficiencySlider"
                    />
                    <div className="flex justify-between">
                        <span className="text-white text-xs">Newbie</span>
                        <span className="text-white text-xs">Beginner</span>
                        <span className="text-white text-xs">Intermediate</span>
                        <span className="text-white text-xs">Pro</span>
                    </div>
                </div>

                {/* Personalization Toggle */}
                <div className="flex items-center">
                    <label className="text-white text-lg font-normal mr-4">
                        Personalization
                    </label>
                    <div
                        onClick={handlePersonalizationToggle}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${selections.personalization ? "bg-primary" : "bg-gray-400"
                            }`}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform ${selections.personalization ? "translate-x-6" : ""
                                }`}
                        ></div>
                    </div>
                </div>
            </div>
            {/* Logout and Contact Us Buttons */}
            <div className="col-span-full lg:col-auto bg-black2 p-4 rounded-lg shadow-md mx-4 flex justify-between items-center gap-4">
                <a
                    href="mailto:support@heydaw.ai"
                    className="bg-blue-500 text-white w-30 py-2 px-4 rounded"
                >
                    Contact Us
                </a>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 w-30 text-white py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
