import React from "react";
import { FaRegEye } from "react-icons/fa";
import { GiSpeedometer, GiWindSlap } from "react-icons/gi";
import { LuDroplet } from "react-icons/lu";
import { TbSunset2 } from "react-icons/tb";
import { WiSunrise } from "react-icons/wi";

export interface WeatherDetailsProps  {
    visability: string,
    humidity: string,
    windSpeed: string,
    airPressure: string,
    sunrise: string,
    sunset: string
};

export default function WeatherDetails(props: WeatherDetailsProps) {
    const {
        visability= 'N/A',
        humidity= 'N/A',
        windSpeed= 'N/A',
        airPressure= 'N/A',
        sunrise= 'N/A',
        sunset= 'N/A',
    } = props;
    return <>
        <SingleWeatherDetail
            information="Visability"
            icon={ <FaRegEye /> }
            value={visability} />
        <SingleWeatherDetail
            information="Humidity"
            icon={ <LuDroplet /> }
            value={humidity} />
        <SingleWeatherDetail
            information="Wind Speed"
            icon={ <GiWindSlap /> }
            value={windSpeed} />
        <SingleWeatherDetail
            information="Air Pressure"
            icon={ <GiSpeedometer /> }
            value={airPressure} />
        <SingleWeatherDetail
            information="Sunrise"
            icon={ <WiSunrise /> }
            value={sunrise} />
        <SingleWeatherDetail
            information="Sunset"
            icon={ <TbSunset2 /> }
            value={sunset} />
    </>
}

export interface SingleWeatherDetail {
    information: string,
    icon: React.ReactNode,
    value: string
}
function SingleWeatherDetail(props: SingleWeatherDetail) {
    return (
        <div className="flex flex-col justify-between gap-2 items-center text-sm font-semibold text-black/80">
            <p className="text-nowrap">{props.information}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}
