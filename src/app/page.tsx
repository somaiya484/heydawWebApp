"use client";

import Footer from "@/component/Footer";
import MessageContainer from "@/component/MessageContainer";
import SidePanel from "@/component/SidePanel";
import { MessageProvider, useMessageContext } from "@/contexts/MessageContext";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// import { listen } from "@tauri-apps/api/event";
// import welcomeMessages from "@/hooks/welcomeText";

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

interface PanelConfig {
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
export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<any>();
  const { user, open, setOpen } = useContext(UserContext)!;
  const { showModal, closeModal } = useMessageContext();

  const handleOpenPanel = (content: any) => {
    setPanelContent(content);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  // const getWelcomeMessage = (username: string) => {
  //   const randomMessage =
  //     welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  //   return randomMessage.replace("{username}", username);
  // };

  // useEffect(() => {
  //   if (!open) {
  //     const message = getWelcomeMessage(user.name ? user.name : "user");
  //     toast(message, {
  //       type: "default",
  //       toastId: "welcome",
  //       style: {
  //         borderRadius: "15px",
  //         width: "auto",
  //         background: "#0d0d1b",
  //         color: "#f2f2f2",
  //       },
  //       position: "top-right",
  //     });
  //     setOpen(true);
  //   }
  // }, []);

  const handleCloseOnEscape = (e: any) => {
    if (e.key === "Escape") {
      handleClosePanel();
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleCloseOnEscape);
    return () => {
      window.removeEventListener("keydown", handleCloseOnEscape);
    };
  }, []);

  return (
    <main className="flex flex-col h-screen w-screen relative bg-newblack">

      <MessageContainer />
      <Footer onOpenPanel={handleOpenPanel} />
      {isPanelOpen && (
        <SidePanel
          content={panelContent}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
        />
      )}
      {/* {showModal && (
          <SuggesterModal openModal={showModal} closeModal={closeModal} />
        )} */}
      <ToastContainer />
    </main>
  );
}
