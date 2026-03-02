import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface City {
  name: string;
  value: string;
}

interface CitySelectorProps {
  city: string;
  cities: City[];
  onCityChange: (value: string) => void;
}

export default function CitySelector({
  city,
  cities,
  onCityChange,
}: CitySelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="font-semibold mb-2">Chọn thành phố:</h2>
      <Select value={city} onValueChange={onCityChange}>
        <SelectTrigger className="w-full md:w-72 bg-black border-gray-700">
          <SelectValue placeholder="Chọn thành phố" />
        </SelectTrigger>
        <SelectContent className="bg-gray-950 border-gray-700 text-white">
          {cities.map((c) => (
            <SelectItem
              key={c.value}
              value={c.value}
              className="hover:bg-gray-800 focus:bg-gray-800"
            >
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
