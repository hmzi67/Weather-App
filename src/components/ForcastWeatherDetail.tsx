import React from "react";
import Container from "./Container";
import WeatherIcons from "./WeatherIcons";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import { convertKelvinToCelcius } from "@/utils/convertKelvinToCelcius";

export interface ForcastWeatherDetailProps extends WeatherDetailsProps {
    weatherIcon: string,
    date: string,
    day: string,
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    description: string
}

export default function ForcastWeatherDetail(props: ForcastWeatherDetailProps) {
    const {
        weatherIcon = '02d',
        date = "02:02",
        day = "Monday",
        temp,
        feels_like,
        temp_min,
        temp_max,
        description
    } = props;
  return (
    <Container className=" gap-4">
        {/* left */}
        <section className="flex items-center gap-4 px-4">
            <div className="flex flex-col gap-1 items-center">
                <WeatherIcons iconName={props.weatherIcon}/>
                <p>{ date }</p>
                <p className="text-sm"> { day } </p>
            </div>
            <div className="flex flex-col px-4">
                <span className="text-5xl">{ convertKelvinToCelcius(temp ?? 0)}°</span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                    <span>Feels Like</span>
                    <span>{convertKelvinToCelcius(feels_like ?? 0)}°</span>
                </p>
                <p className="capitalize">
                    {description}
                </p>
            </div>
        </section>
        {/* right */}
        <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
            <WeatherDetails {...props} />

        </section>
    </Container>
  )
}
