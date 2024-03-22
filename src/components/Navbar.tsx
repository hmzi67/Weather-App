"use client";
import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { TiWeatherPartlySunny } from "react-icons/ti";
import SearchBox from "./SearchBox";
import axios from "axios";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "@/app/atom";

type Props = { location?: string };
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Navbar({ location }: Props) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [place, setPlace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom);

    // to show suggestion
    const [suggestions, setSuggestion] = useState<string[]>([]);
    const [showSuggestion, setShowSuggestion] = useState(false);

    const handleChange = async (value: string) => {
        setCity(value);
        if (value.length > 3) {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
                );
                const suggestions = response?.data.list.map((item: any) => item.name);
                setSuggestion(suggestions);
                setError("");
                setShowSuggestion(true);
            } catch (error) {
                setSuggestion([]);
                setShowSuggestion(false);
            }
        } else {
            setSuggestion([]);
            setShowSuggestion(false);
        }
    };

    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestion(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
            setError('Location not found');
            setLoadingCity(false);
        } else {
            setError('')
            setTimeout(() => {
                setLoadingCity(false);
                setShowSuggestion(false)
                setPlace(city);
            }, 500);
        }
    }

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    setLoadingCity(true);
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
                    );
                    setTimeout(() => {
                        setLoadingCity(false)
                        setPlace(response.data.name)
                    }, 500);
                } catch (error) {
                    setLoadingCity(false)
                }
            })
        }
    }

    return (
        <>
            <nav className="top-0 left-0 w-screen fixed z-50 bg-blur bg-white/70">
                <div className="h-[72px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
                    <p className="flex items-center justify-center gap-2">
                        <h2 className="text-3xl text-gray-00">Weather</h2>
                        <TiWeatherPartlySunny className="text-3xl" />
                    </p>
                    <section className="flex gap-2 items-center">
                        <MdMyLocation
                            title="Your current location"
                            onClick={handleLocation}
                            className="text-2xl text-gray-700 hover:opacity-80 cursor-pointer" />
                        <IoLocationOutline

                            className="text-3xl text-gray-800" />
                        <p className="text-slate-900/80 text-sm">{location}</p>
                        <div className="relative hidden md:flex">
                            {/* Search Box */}
                            <SearchBox
                                value={city}
                                onChange={(e) => handleChange(e.target.value)}
                                onSubmit={handleSubmit}
                            />
                            <SuggestionBox
                                {...{
                                    showSuggestion,
                                    suggestions,
                                    handleSuggestionClick,
                                    error,
                                }}
                            />
                        </div>
                    </section>
                </div>
            </nav>

        <section className="flex max-w-7xl justify-center px-3 md:hidden mt-[4.5rem] w-screen  p-2">
            <div className="relative ">
                {/* Search Box */}
                <SearchBox
                    value={city}
                    onChange={(e) => handleChange(e.target.value)}
                    onSubmit={handleSubmit}
                />
                <SuggestionBox
                    {...{
                        showSuggestion,
                        suggestions,
                        handleSuggestionClick,
                        error,
                    }}
                />
            </div>
            </section>
        </>
    );

}

function SuggestionBox({
    showSuggestion,
    suggestions,
    handleSuggestionClick,
    error,
}: {
    showSuggestion: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {
    return (
        <>
            {((showSuggestion && suggestions.length > 1) || error) && (
                <ul className="absolute top-[44px] mb-4 bg-white/90 border left-0 border-gray-200/90 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
                    {error && suggestions.length < 1 && (
                        <li className="text-red-500 p-1">{error}</li>
                    )}
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className="cursor-pointer p-1 text-gray-900 rounded hover:bg-gray-400"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}

        </>
    )
}
