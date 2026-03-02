const WEATHER_ICON_BASE = "/images/icons/weather";

interface WeatherIconConfig {
  alt: string;
  src: string;
}

const WEATHER_ICON_MAP: {
  min: number;
  max: number;
  config: WeatherIconConfig;
}[] = [
  {
    min: 200,
    max: 300,
    config: {
      alt: "thunderstorm",
      src: `${WEATHER_ICON_BASE}/storm-unscreen.gif`,
    },
  },
  {
    min: 300,
    max: 400,
    config: {
      alt: "drizzle",
      src: `${WEATHER_ICON_BASE}/moderate-rain-unscreen.gif`,
    },
  },
  {
    min: 500,
    max: 600,
    config: {
      alt: "light rain",
      src: `${WEATHER_ICON_BASE}/rain-unscreen.gif`,
    },
  },
  {
    min: 600,
    max: 700,
    config: { alt: "snow", src: `${WEATHER_ICON_BASE}/cloud-snow.gif` },
  },
  {
    min: 700,
    max: 800,
    config: { alt: "cloudy", src: `${WEATHER_ICON_BASE}/cloudy.gif` },
  },
  {
    min: 800,
    max: 801,
    config: {
      alt: "sun",
      src: `${WEATHER_ICON_BASE}/sun-default-unscreen.gif`,
    },
  },
];

const DEFAULT_ICON: WeatherIconConfig = {
  alt: "cloudy",
  src: `${WEATHER_ICON_BASE}/cloudy.gif`,
};

function getWeatherIconConfig(weatherCode: number): WeatherIconConfig {
  const match = WEATHER_ICON_MAP.find(
    ({ min, max }) => weatherCode >= min && weatherCode < max,
  );
  return match?.config ?? DEFAULT_ICON;
}

interface WeatherIconProps {
  weatherCode: number;
  className?: string;
}

export default function WeatherIcon({
  weatherCode,
  className = "h-14 w-14",
}: WeatherIconProps) {
  const { alt, src } = getWeatherIconConfig(weatherCode);
  return <img alt={alt} src={src} className={className} />;
}
