import countries from "world-countries";

// Lightweight dynamic country + city data for pickers

export type CountryOption = {
    code: string;
    name: string;
    callingCode: string;
    flag: string;
};

// Build country list from world-countries
export const COUNTRY_OPTIONS: CountryOption[] = countries
    .map((c) => ({
        code: c.cca2,
        name: c.name.common,
        // Build a single calling code string like "+972"
        callingCode:
            c.idd?.root && Array.isArray(c.idd?.suffixes) && c.idd.suffixes.length > 0
                ? `${c.idd.root}${c.idd.suffixes[0]}`
                : "",
        // Some builds of world-countries expose "flag"
        // If not present, fall back to empty string.
        flag: (c as any).flag ?? "",
    }))
    // Filter out countries without a dialing prefix (not useful in phone picker)
    .filter((c) => !!c.callingCode)
    // Sort alphabetically by display name
    .sort((a, b) => a.name.localeCompare(b.name));

// Optional: cities by country using the "country-city" package, if available.
// This is best-effort – if the library is missing or a country name
// is not recognised, we just return an empty array for that country.
/* eslint-disable @typescript-eslint/no-var-requires */
let countryCity: any = null;
try {
    // country-city is a CommonJS package,
    // so `require` is the safest way to load it in RN/Expo.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    countryCity = require("country-city");
} catch {
    countryCity = null;
}
/* eslint-enable @typescript-eslint/no-var-requires */

export const CITIES_BY_COUNTRY: Record<string, string[]> = COUNTRY_OPTIONS.reduce(
    (acc, country) => {
        let cities: string[] = [];
        if (countryCity && typeof countryCity.getCities === "function") {
            try {
                // The underlying data set expects a country *name* (e.g. "Israel")
                cities = countryCity.getCities(country.name) || [];
            } catch {
                cities = [];
            }
        }
        acc[country.code] = cities;
        return acc;
    },
    {} as Record<string, string[]>
);
