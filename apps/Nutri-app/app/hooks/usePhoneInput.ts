import { useMemo, useState } from "react";
import { useCountryPicker } from "./useCountryPicker";
import { cleanPhoneInput } from "../utils/format";
import { validatePhone } from "../utils/validators";

export const usePhoneInput = (
    initialPhone = "",
    initialCountryIso = "US"
) => {
    const [phone, setPhone] = useState(initialPhone);
    const countryPicker = useCountryPicker(initialCountryIso);

    const cleanedPhone = useMemo(() => cleanPhoneInput(phone), [phone]);
    const phoneError = useMemo(() => validatePhone(cleanedPhone), [cleanedPhone]);

    const setCountryByCode = (code: string) => {
        countryPicker.handleSelect(code);
    };

    return {
        phone,
        setPhone,
        cleanedPhone,
        phoneError,
        selectedCountry: countryPicker.selectedCountry,
        selectedCode: countryPicker.selectedCode,
        isPickerOpen: countryPicker.isPickerOpen,
        openPicker: countryPicker.openPicker,
        closePicker: countryPicker.closePicker,
        setCountryByCode,
        countryOptions: countryPicker.countries,
    };
};
