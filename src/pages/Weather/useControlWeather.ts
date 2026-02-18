import {
  ForecastData,
  ForecastItem,
  WeatherData,
} from "@/types/weatherDataType";
import { useEffect, useState } from "react";

const useControlWeather = () => {
  const [city, setCity] = useState<string>("Hanoi");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const vietnamCities = [
    { name: "Hà Nội", value: "Hanoi" },
    { name: "Hồ Chí Minh", value: "Ho Chi Minh City" },
    { name: "Đà Nẵng", value: "Da Nang" },
    { name: "Hải Phòng", value: "Hai Phong" },
    { name: "Cần Thơ", value: "Can Tho" },
    { name: "Huế", value: "Hue" },
    { name: "Nha Trang", value: "Nha Trang" },
    { name: "Đà Lạt", value: "Da Lat" },
    { name: "Vũng Tàu", value: "Vung Tau" },
    { name: "Hạ Long", value: "Ha Long" },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather via server proxy (API key is hidden on server)
        const currentWeatherResponse = await fetch(
          `/api/weather?city=${encodeURIComponent(city)}&type=weather`,
        );

        if (!currentWeatherResponse.ok) {
          throw new Error(`Failed to fetch current weather data for ${city}.`);
        }

        const currentWeatherData =
          (await currentWeatherResponse.json()) as WeatherData;
        setWeatherData(currentWeatherData);

        // Fetch 5-day forecast via server proxy
        const forecastResponse = await fetch(
          `/api/weather?city=${encodeURIComponent(city)}&type=forecast`,
        );

        if (!forecastResponse.ok) {
          throw new Error(`Failed to fetch forecast data for ${city}.`);
        }

        const forecastData = (await forecastResponse.json()) as ForecastData;

        // Process forecast data
        const processedForecast = processForecastData(forecastData);
        setForecast(processedForecast.slice(0, 7)); // Limit to 7 days
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchWeather();
  }, [city]);

  const processForecastData = (forecastData: ForecastData): ForecastItem[] => {
    const dailyForecasts: Record<string, ForecastItem[]> = {};

    forecastData.list.forEach((item: ForecastItem) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split("T")[0];

      if (!dailyForecasts[day]) {
        dailyForecasts[day] = [];
      }

      dailyForecasts[day].push(item);
    });

    return Object.keys(dailyForecasts).map((day) => {
      const entries = dailyForecasts[day];
      let bestEntry = entries[0];
      let minDiff = Infinity;

      entries.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const hoursDiff = Math.abs(date.getHours() - 12);
        if (hoursDiff < minDiff) {
          minDiff = hoursDiff;
          bestEntry = entry;
        }
      });

      return bestEntry;
    });
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unknown error occurred.");
    }
  };

  return {
    city,
    setCity,
    weatherData,
    forecast,
    loading,
    error,
    vietnamCities,
  };
};

export default useControlWeather;
