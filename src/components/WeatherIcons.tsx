import { cn } from "@/utils/cn";
import Image from "next/image";
import React from "react";

type Props = {};

export default function WeatherIcons(props: React.HTMLProps<HTMLDivElement> & {iconName: string}) {
    return (
        <div {...props} className={cn("relative h-20 w-20")}>
            <Image 
            alt="weather-icon" 
            height={100} 
            width={100}
            className="absolute h-full w-full"
            src={`https://openweathermap.org/img/wn/${props.iconName}.png`}  />
        </div>
    )
}
