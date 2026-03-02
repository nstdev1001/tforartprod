import useControlWeather from "./useControlWeather";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  // Cloud,
  // CloudFog,
  // CloudLightning,
  // CloudRain,
  // CloudSnow,
  Droplets,
  // Sun,
  Wind,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function WeatherApp() {
  const {
    city,
    weatherData,
    error,
    forecast,
    vietnamCities,
    loading,
    setCity,
  } = useControlWeather();

  const getWeatherIcon = (weatherCode: number): React.JSX.Element => {
    switch (true) {
      case weatherCode >= 200 && weatherCode < 300:
        // return <CloudLightning className="h-14 w-14" />;
        return (
          <img
            alt="thunderstorm"
            src="/weather-icon/storm-unscreen.gif"
            className="h-14 w-14"
          />
        );
      case weatherCode >= 300 && weatherCode < 400:
        // return <CloudRain className="h-14 w-14 opacity-70" />;
        return (
          <img
            alt="drizzle"
            src="/weather-icon/moderate-rain-unscreen.gif"
            className="h-14 w-14"
          />
        );
      case weatherCode >= 500 && weatherCode < 600:
        // return <CloudRain className="h-14 w-14" />;
        return (
          <img
            alt="light rain"
            src="/weather-icon/rain-unscreen.gif"
            className="h-14 w-14"
          />
        );
      case weatherCode >= 600 && weatherCode < 700:
        // return <CloudSnow className="h-14 w-14" />;
        return (
          <img
            alt="snow"
            src="/weather-icon/cloud-snow.gif"
            className="h-14 w-14"
          />
        );
      case weatherCode >= 700 && weatherCode < 800:
        // return <CloudFog className="h-14 w-14" />;
        return (
          <img
            alt="cloudy"
            src="/weather-icon/cloudy.gif"
            className="h-14 w-14"
          />
        );
      case weatherCode === 800:
        // return <Sun className="h-14 w-14 text-yellow-400" />;
        return (
          <img
            alt="sun"
            src="/weather-icon/sun-default-unscreen.gif"
            className="h-14 w-14"
          />
        );
      default:
        // return <Cloud className="h-14 w-14" />;
        return (
          <img
            alt="cloudy"
            src="/weather-icon/cloudy.gif"
            className="h-14 w-14"
          />
        );
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      month: "long",
      day: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="weather-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[150px] mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            DỰ BÁO THỜI TIẾT
          </h1>
          <p className="text-lg text-gray-400">
            Để đảm bảo dự án của bạn không bị ảnh hưởng bởi thời tiết, hãy kiểm
            tra dự báo thời tiết tại đây.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold mb-2">Chọn thành phố:</h2>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full md:w-72 bg-black border-gray-700">
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent className="bg-gray-950 border-gray-700 text-white">
              {vietnamCities.map((city) => (
                <SelectItem
                  key={city.value}
                  value={city.value}
                  className="hover:bg-gray-800 focus:bg-gray-800"
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 p-4 rounded-lg text-center">
            <p className="text-white">Đã xảy ra lỗi: {error}</p>
          </div>
        )}

        {!loading && !error && weatherData && (
          <>
            {/* Current Weather */}
            <Card className="mb-8 bg-transparent border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl">
                  {vietnamCities.find((c) => c.value === city)?.name || city} -
                  hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  {getWeatherIcon(weatherData.weather[0].id)}
                  <div className="ml-4">
                    <p className="text-5xl font-bold">
                      {Math.round(weatherData.main.temp)}°C
                    </p>
                    <p className="text-lg capitalize">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 lg:scale-125">
                  <div className="flex items-center">
                    {/* <Droplets className="mr-2 h-5 w-5 text-blue-400" /> */}
                    <img
                      alt="humidity"
                      src="/weather-icon/drop-unscreen.gif"
                      className="mr-2 h-5 w-5"
                    />
                    <span>{weatherData.main.humidity}% độ ẩm</span>
                  </div>
                  <div className="flex items-center">
                    {/* <Wind className="mr-2 h-5 w-5 text-green-400" /> */}
                    <img
                      alt="wind"
                      src="/weather-icon/wind-unscreen.gif"
                      className="mr-2 h-5 w-5"
                    />
                    <span>{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                  </div>
                  <div className="flex items-center">
                    {/* <Sun className="mr-2 h-5 w-5 text-yellow-400" /> */}
                    <img
                      alt="feels like"
                      src="/weather-icon/sun-glass-unscreen.gif"
                      className="mr-2 h-5 w-5"
                    />
                    <span>
                      Cảm giác: {Math.round(weatherData.main.feels_like)}°C
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/* <Cloud className="mr-2 h-5 w-5 text-gray-400" /> */}
                    <img
                      alt="clouds"
                      src="/weather-icon/cloudy.gif"
                      className="mr-2 h-5 w-5"
                    />
                    <span>{weatherData.clouds.all}% mây</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7-day Forecast */}
            <h2 className="text-2xl font-bold mb-4">Dự báo 7 ngày tới</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <Card
                  key={index}
                  className="bg-gray-950 border-gray-700 hover:bg-gray-900 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {formatDate(day.dt)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        {getWeatherIcon(day.weather[0].id)}
                        <p className="text-sm mt-1 capitalize">
                          {day.weather[0].description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {Math.round(day.main.temp)}°C
                        </p>
                        <p className="text-sm text-gray-400">
                          {Math.round(day.main.temp_min)}° /{" "}
                          {Math.round(day.main.temp_max)}°
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 text-xs gap-y-1">
                      <div className="flex items-center">
                        <Droplets className="mr-1 h-3 w-3 text-blue-400" />
                        <span>{day.main.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="mr-1 h-3 w-3 text-green-400" />
                        <span>{Math.round(day.wind.speed * 3.6)} km/h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <footer className="mt-12 text-center text-gray-500 text-sm">
              <p>
                Dữ liệu thời tiết được cung cấp bởi{" "}
                <Link
                  className="underline"
                  target="_blank"
                  to={"https://openweathermap.org/"}
                >
                  OpenWeatherMap
                </Link>
              </p>
            </footer>
          </>
        )}
      </div>
    </Layout>
  );
}
