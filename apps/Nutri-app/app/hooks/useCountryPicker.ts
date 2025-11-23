import { useMemo, useState } from "react";
import { COUNTRY_OPTIONS } from "../utils/locationData";

export const useCountryPicker = (initialIso = "US") => {
    const [selectedCode, setSelectedCode] = useState(initialIso);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const selectedCountry = useMemo(
        () => COUNTRY_OPTIONS.find((item) => item.code === selectedCode) || COUNTRY_OPTIONS[0],
        [selectedCode]
    );

    const openPicker = () => setIsPickerOpen(true);
    const closePicker = () => setIsPickerOpen(false);

    const handleSelect = (code: string) => {setSelectedCode(code);closePicker();};

    return {countries: COUNTRY_OPTIONS, selectedCountry, selectedCode, isPickerOpen, openPicker, closePicker, handleSelect};
};