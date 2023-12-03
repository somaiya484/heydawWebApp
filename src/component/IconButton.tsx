"use client";
import { Icon } from "@iconify/react";

interface IconButtonProps {
    icon: string;
    title: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    color?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    title,
    className,
    onClick,
    disabled,
    color,
}) => {
    return (
        <button
            className={`button-nav self-center text-buttonAccent inline-flex w-12 h-12 sm:m-1 m-0.5 rounded-full border-primary border-opacity-25 border-1 border bg-[#5b54e039] ${className}`}
            title={title}
            onClick={onClick}
            disabled={disabled}
        >
            <Icon
                icon={icon}
                className="w-full h-full justify-self-center m-2 self-center duration-100 ease-in-out"
                width={24}
                color={color}
            />
        </button>
    );
};

export default IconButton;
