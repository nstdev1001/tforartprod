import WeatherIcon from "./WeatherIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForecastItem } from "@/types/weatherDataType";
import { Droplets, Wind } from "lucide-react";

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("vi-VN", {
    weekday: "short",
    month: "long",
    day: "2-digit",
  });
}

interface ForecastCardProps {
  day: ForecastItem;
}

export default function ForecastCard({ day }: ForecastCardProps) {
  const { weather, main, wind } = day;

  return (
    <Card className="bg-gray-950 border-gray-700 hover:bg-gray-900 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{formatDate(day.dt)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <WeatherIcon weatherCode={weather[0].id} />
            <p className="text-sm mt-1 capitalize">{weather[0].description}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{Math.round(main.temp)}°C</p>
            <p className="text-sm text-gray-400">
              {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 text-xs gap-y-1">
          <div className="flex items-center">
            <Droplets className="mr-1 h-3 w-3 text-blue-400" />
            <span>{main.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-1 h-3 w-3 text-green-400" />
            <span>{Math.round(wind.speed * 3.6)} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
