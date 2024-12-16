import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryCode {
  name: string;
  code: string;
  dial_code: string;
}

export function CountryCodeSelector({ onSelect }: { onSelect: (dialCode: string) => void }) {
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json')
      .then(response => response.json())
      .then(data => setCountryCodes(data));
  }, []);

  return (
    <Select onValueChange={(value) => onSelect(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {countryCodes.map((country) => (
          <SelectItem key={country.code} value={country.dial_code}>
            {country.name} ({country.dial_code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

