import { Icon } from "@iconify/react/dist/iconify.js";
import exp from "constants";
import { useEffect, useRef, useState } from "react";

const AudioPlayer = ({ src }: any) => {
    const audioRef = useRef(new Audio(src));
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        const onTimeUpdate = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };
    const onDragStart = (event: any) => {
        event.dataTransfer.setData("application/x-moz-file", src);
    };

    const onScrub = (value: any) => {
        const audio = audioRef.current;
        audio.currentTime = (audio.duration / 100) * value;
        setProgress(value);
    };
    const fileName = src.split("/").pop();

    return (
        <div className="custom-audio-player">
            <button onClick={togglePlayPause} className="bg-secondary/75">
                {isPlaying ? (
                    <Icon icon="ph:pause-fill" />
                ) : (
                    <Icon icon="ph:play-fill" />
                )}
            </button>
            <input
                type="range"
                className=""
                value={progress}
                onChange={(e) => onScrub(e.target.value)}
            />
            <a href={src} download={fileName} className="">
                <Icon icon="ph:arrow-circle-down" />
            </a>
            <div
                className="self-center items-center my-auto"
                draggable="true"
                onDragStart={onDragStart}
            >
                <Icon icon="ph:paperclip" />
            </div>
        </div>
    );
};

export default AudioPlayer;
