import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactCountryFlag from "react-country-flag";

interface CountryCode {
  name: string;
  code: string;
  dial_code: string;
}

export function CountryCodeSelector({
  onSelect,
  className
}: {
  onSelect: (dialCode: string) => void;
  className?: string;
}) {
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json')
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a: CountryCode, b: CountryCode) => a.name.localeCompare(b.name));
        setCountryCodes(sortedData);
      });
  }, []);

  useEffect(() => {
    // Find and select the default country *after* countryCodes is populated.
    const usCountry = countryCodes.find((country: CountryCode) => country.code === 'US');
    if (usCountry) {
      setSelectedCountry(usCountry);
      onSelect(usCountry.dial_code);
    }
  }, [countryCodes, onSelect]); // onSelect is now correctly included here because it's used inside the useEffect

  const handleValueChange = (value: string) => {
    const country = countryCodes.find(c => c.dial_code === value);
    if (country) {
      setSelectedCountry(country);
      onSelect(value);
    }
  };

  return (
    <Select
      onValueChange={handleValueChange}
      value={selectedCountry?.dial_code}
    >
      <SelectTrigger className={`${className} w-full flex items-center space-x-2`}>
        <SelectValue placeholder="Select country">
          {selectedCountry && (
            <div className="flex items-center space-x-2">
              <ReactCountryFlag
                countryCode={selectedCountry.code}
                svg
                style={{ width: '1.5em', height: '1.5em' }}
              />
              <span>{selectedCountry.dial_code}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto bg-[#112240] border-white/20">
        {countryCodes.map((country) => (
          <SelectItem
            key={country.code}
            value={country.dial_code}
            className="flex items-center space-x-2 hover:bg-white/10 focus:bg-white/20"
          >
            <div className="flex items-center space-x-2">
              <ReactCountryFlag
                countryCode={country.code}
                svg
                style={{ width: '1.5em', height: '1.5em' }}
              />
              <span>{country.name}</span>
              <span className="text-gray-400 ml-2">{country.dial_code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}