"use client"
import Container from "@/components/Container";
import ForcastWeatherDetail from "@/components/ForcastWeatherDetail";

import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcons from "@/components/WeatherIcons";
import { convertKelvinToCelcius } from "@/utils/convertKelvinToCelcius";
import convertWindSpeed from "@/utils/convertWindSpeed";
import getDayOrNightIcons from "@/utils/getDayOrNightIcons";
import meterToKiloMeter from "@/utils/meterToKiloMeter";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { PiSpinnerBold } from "react-icons/pi";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherListItem[];
  city: CityData;
}

interface WeatherListItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface CityData {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}


export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loading] = useAtom(loadingCityAtom);
  // https://api.openweathermap.org/data/2.5/forecast?q=London,us&appid=237394c2cdfe9340cfb02024a06495e5&cnt=56

  const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async () => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&cnt=56`)
    return data;
  }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-img">
      <p className="animate-spin"><PiSpinnerBold className="text-3xl text-gray-900" /></p>
      <p className="ms-1 text-gray-900">Please wait</p>
    </div>
  )
  const firstData = data?.list[0];
  const cityData = data?.city;
  // console.log("data", data)

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const findDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    })
  });

  return (
    <div className="h-screen ">
      <Navbar location={data?.city.name}  />
      <main className="bg-blur">
          {
            loading ? <SkeletonLoading /> : (
              <>
              <main className="px-3 max-w-7xl mx-auto flex flex-col w-full pb-10 pt-4 gap-9">
                {/* Today Data */}
                <section className="space-y-4 mt-0 md:mt-20">
                  <div className="space-y-2">
                    <h2 className="flex gap-1 text-2xl items-end">
                      <p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
                      <p className="text-lg">{format(parseISO(firstData?.dt_txt ?? ''), "(dd/MM/yyyy)")}</p>
                    </h2>
                    <Container className="gap-10 px-6 items-center bg-yellow-300">
                      {/* Temprature */}
                      <div className="flex flex-col px-4">
                        <span className="text-5xl">
                          {convertKelvinToCelcius(firstData?.main.temp ?? 280.71)}°
                        </span>
                        <p className="text-sm space-x-1 whitespace-nowrap">
                          <span>
                            Feels like
                          </span>
                          <span>
                            {convertKelvinToCelcius(firstData?.main.feels_like ?? 280.71)}°
                          </span>
                        </p>
                        <p className="text-xs space-x-2 ">
                          <span>
                            {convertKelvinToCelcius(firstData?.main.temp_min ?? 0)}
                            °↓{" "}
                          </span>
                          <span>
                            {" "}
                            {convertKelvinToCelcius(firstData?.main.temp_max ?? 0)}
                            °↑
                          </span>
                        </p>
                      </div>
                      {/* Time and weather icon */}
                      <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between py-2 pr-3">
                        {
                          data?.list.map((index, key) =>
                            <div
                              key={key}
                              className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                              <p className="whitespace-nowrap">
                                {format(parseISO(index.dt_txt), "h:mm a")}
                              </p>
                              {/* <WeatherIcons iconName={index?.weather[0].icon ?? ""}/> */}
                              <WeatherIcons iconName={getDayOrNightIcons(index.weather[0].icon, index.dt_txt)} />
                              <p>
                                {convertKelvinToCelcius(index?.main.temp ?? 0)}°
                              </p>
                            </div>
                          )
                        }
                      </div>
                    </Container>
                  </div>
                  <div className="flex gap-4">
                    {/* left */}
                    <Container className="justify-center w-fit flex-col px-4 item-center">
                      <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                      <WeatherIcons
                        iconName={getDayOrNightIcons(firstData?.weather[0].icon ?? '',
                          firstData?.dt_txt ?? '')} />
                    </Container>
                    {/* right */}
                    <Container className=" px-6 gap-4 justify-between overflow-x-auto">


                      <WeatherDetails
                        visability={meterToKiloMeter(firstData?.visibility ?? 0)}
                        airPressure={`${firstData?.main.pressure} hPa`}
                        humidity={`${firstData?.main.humidity}%`}
                        windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
                        sunrise={`${format(fromUnixTime(cityData?.sunrise ?? 1710934584), "h:mm")}`}
                        sunset={`${format(fromUnixTime(cityData?.sunset ?? 1710978345), "h:mm")}`} />
                    </Container>
                  </div>
                </section>
                {/* 7Day Data */}
                <section className="flex flex-col w-full gap-4">
                  <p className="text-2xl">Forcast (7 Days)</p>
                  {findDataForEachDate.map((value, i) => (
                    <ForcastWeatherDetail
                      key={i}
                      description={value?.weather[0].description ?? ""}
                      weatherIcon={value?.weather[0].icon ?? "02d"}
                      date={value ? format(parseISO(value?.dt_txt), "dd.mm") : ""}
                      day={value ? format(parseISO(value?.dt_txt), "EEEE") : ""}
                      feels_like={value?.main.feels_like ?? 270}
                      temp={value?.main.temp ?? 0}
                      temp_max={value?.main.temp_max ?? 0}
                      temp_min={value?.main.temp_min ?? 0}
                      airPressure={`${value?.main.pressure} hPa`}
                      humidity={`${value?.main.humidity}`}
                      sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702517657), "H:mm")}
                      sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
                      visability={`${meterToKiloMeter(value?.visibility ?? 10000)}`}
                      windSpeed={`${convertWindSpeed(value?.wind.speed ?? 1.64)}`}
                    />

                  ))}
                </section>
              </main>
              </>
            )
          }
      </main>
      <footer className="flex justify-center bg-gray-200">
          <p>&copy; {new Date().getFullYear()} Weather App. Code with ❤ by <a href="https://vercel.com/hmzi67" className="text-blue-600 hover:opacity-80">Hamza Waheed Abbasi</a></p>
      </footer>
    </div>
  );
}
function SkeletonLoading() {
  return (
    (
      <div className="data-skeleton px-3 h-screen w-screen  flex flex-col pb-10 pt-4 gap-9 opacity-50 animate-pulse">
  <section className="animate-pulse space-y-4 mt-20 h-full">
    <div className="rounded-2xl bg-gradient-to-r animate-pulse from-gray-900 to-gray-800 shadow-md h-full">
      <h2 className="flex gap-1 text-2xl items-end rounded-2xl px-4 py-2 ">
      </h2>
      <div className="gap-10 px-6 items-center py-2">
        <div className="flex flex-col gap-1 px-4 rounded-2xl w-full">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-16 animate-pulse rounded-lg w-32"></div>
          <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-5 animate-pulse w-full mt-1 rounded-lg"></div>
          <div className="bg-gradient-to-r from-lime-500 to-green-600 h-4 animate-pulse w-3/4 mt-2 rounded-lg"></div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-4 animate-pulse w-3/5 mt-1 rounded-lg"></div>
        </div>
        <div className="flex gap-16 overflow-x-auto w-full justify-between pr-3 rounded-2xl">
        </div>
      </div>
      <div className="flex gap-4 px-6 pt-4">
        <div className="gap-4 flex justify-center flex-col px-4 items-center">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-8 w-20 rounded-lg"></div>
          <div className="bg-gradient-to-r from-red-500 to-violet-500 h-12 w-12 rounded-full"></div>
        </div>
        <div className="flex gap-1 flex-col justify-between overflow-x-auto w-screen mt-5">
          <div className="bg-gradient-to-r from-blue-500 to-sky-500 h-5 w-full rounded-lg"></div>
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-5 w-1/4 rounded-lg"></div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-5 w-2/4 rounded-lg"></div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-5 w-2/3 rounded-lg"></div>
          <div className="bg-gradient-to-r from-red-500 to-violet-500 h-5 w-72 rounded-lg"></div>
        </div>
      </div>

      <div className="flex gap-4 px-6 pt-4">
        <div className="gap-4 flex justify-center flex-col px-4 items-center">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-8 w-20 rounded-lg"></div>
          <div className="bg-gradient-to-r from-red-500 to-violet-500 h-12 w-12 rounded-full"></div>
        </div>
        <div className="flex gap-1 flex-col justify-between overflow-x-auto w-screen mt-5">
          <div className="bg-gradient-to-r from-blue-500 to-sky-500 h-5 w-full rounded-lg"></div>
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-5 w-1/4 rounded-lg"></div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-5 w-2/4 rounded-lg"></div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-5 w-2/3 rounded-lg"></div>
          <div className="bg-gradient-to-r from-red-500 to-violet-500 h-5 w-72 rounded-lg"></div>
        </div>
      </div>
      
    </div>
  </section>
</div>

    )
  )
}
