import CitySelector from "./_components/CitySelector";
import CurrentWeatherCard from "./_components/CurrentWeatherCard";
import ForecastCard from "./_components/ForecastCard";
import useControlWeather from "./useControlWeather";
import Layout from "@/components/Layout/Layout";

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

  const cityLabel = vietnamCities.find((c) => c.value === city)?.name ?? city;

  return (
    <Layout>
      <div className="weather-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[150px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            DỰ BÁO THỜI TIẾT
          </h1>
          <p className="text-lg text-gray-400">
            Để đảm bảo dự án của bạn không bị ảnh hưởng bởi thời tiết, hãy kiểm
            tra dự báo thời tiết tại đây.
          </p>
        </div>

        {/* City Selector */}
        <CitySelector
          city={city}
          cities={vietnamCities}
          onCityChange={setCity}
        />

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900 p-4 rounded-lg text-center">
            <p className="text-white">Đã xảy ra lỗi: {error}</p>
          </div>
        )}

        {/* Weather Data */}
        {!loading && !error && weatherData && (
          <>
            <CurrentWeatherCard cityLabel={cityLabel} data={weatherData} />

            <h2 className="text-2xl font-bold mb-4">Dự báo 7 ngày tới</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <ForecastCard key={index} day={day} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
