import WeatherIcon from "./WeatherIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeatherData } from "@/types/weatherDataType";

const WEATHER_ICON_BASE = "/images/icons/weather";

interface WeatherStatProps {
  icon: string;
  alt: string;
  children: React.ReactNode;
}

function WeatherStat({ icon, alt, children }: WeatherStatProps) {
  return (
    <div className="flex items-center">
      <img alt={alt} src={icon} className="mr-2 h-5 w-5" />
      <span>{children}</span>
    </div>
  );
}

interface CurrentWeatherCardProps {
  cityLabel: string;
  data: WeatherData;
}

export default function CurrentWeatherCard({
  cityLabel,
  data,
}: CurrentWeatherCardProps) {
  const { weather, main, wind, clouds } = data;

  return (
    <Card className="mb-8 bg-transparent border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl">{cityLabel} - hiện tại</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <WeatherIcon weatherCode={weather[0].id} />
          <div className="ml-4">
            <p className="text-5xl font-bold">{Math.round(main.temp)}°C</p>
            <p className="text-lg capitalize">{weather[0].description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-2 lg:scale-125">
          <WeatherStat
            icon={`${WEATHER_ICON_BASE}/drop-unscreen.gif`}
            alt="humidity"
          >
            {main.humidity}% độ ẩm
          </WeatherStat>
          <WeatherStat
            icon={`${WEATHER_ICON_BASE}/wind-unscreen.gif`}
            alt="wind"
          >
            {Math.round(wind.speed * 3.6)} km/h
          </WeatherStat>
          <WeatherStat
            icon={`${WEATHER_ICON_BASE}/sun-glass-unscreen.gif`}
            alt="feels like"
          >
            Cảm giác: {Math.round(main.feels_like)}°C
          </WeatherStat>
          <WeatherStat icon={`${WEATHER_ICON_BASE}/cloudy.gif`} alt="clouds">
            {clouds.all}% mây
          </WeatherStat>
        </div>
      </CardContent>
    </Card>
  );
}
