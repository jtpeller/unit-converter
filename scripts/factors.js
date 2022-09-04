// =================================================================
// = factors.js
// =  Description:  Contains all unit conversion factors needed
// =  Author:       jtpeller
// =  Date:         September 03, 2022
// =================================================================

// length -- meter is the root unit, so unit 1 will be converted to it
// before being converted to the selected unit 2
length = {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    micrometer: 1e6,
    nanometer: 1e9,
    mile: 0.000621371,
    yard: 1.09361,
    foot: 3.28084,
    inch: 39.3701,
    nautical_mile: 0.000539957
};

// area -- square feet is the root unit
area = {
    square_foot: 1,
    square_meter: 0.092903,
    square_kilometer: 9.2903e-8,
    square_mile: 3.587e-8,
    square_yard: 1/9,
    square_inch: 144,
    hectare: 1/107600,
    acre: 1/43560,
};

// volume -- cubic foot is the root unit
volume = {
    us_liquid_gallon: 1,
    us_liquid_quart: 4,
    us_liquid_pint: 8,
    us_liquid_cup: 16,
    us_legal_cup: 15.7725,
    us_fluid_ounce: 128,
    us_tablespoon: 256,
    us_teaspoon: 768,
    imperial_gallon: 0.832674,
    imperial_quart: 3.3307,
    imperial_pint: 6.66139,
    imperial_cup: 13.3228,
    imperial_fluid_ounce: 133.228,
    imperial_tablespoon: 213.165,
    imperial_teaspoon: 639.494,
    cubic_foot: 0.133681,
    cubic_inch: 231,
    cubic_meter: 0.00378541,
    liter: 3.78541,
    milliliter: 3785.41,
};

// mass -- kilogram is the root unit 
mass = {
    kilogram: 1,
    pound: 2.20462262185,
    ounce: 35.27396195,
    metric_ton: 0.001,
    gram: 1000,
    milligram: 1e+6,
    microgram: 1e+9,
    imperial_ton: 1/1016,
    us_ton: 1/907.2,
    stone: 1/6.35
};

// time -- second is the root unit
time = {
    nanosecond: 1e9,
    microsecond: 1e6,
    millisecond: 1e3,
    second: 1,
    minute: 1/60,
    hour: 1/3600,
    day: 1/86400,
    week: 1/604800,
    month: 1/2627856,
    year: 1/31534272,
    decade: 1/315342720,
    century: 1/3153427200,
    millenium: 1/31534272000,
};

// energy -- joule is the root unit
energy = {
    joule: 1,
    kilojoule: 0.001,
    gram_calorie: 1/4.184,
    kilocalorie: 1/4184,
    watt_hour: 1/3600,
    kilowatt_hour: 1/3.6e6,
    electronvolt: 6.242e18,
    british_thermal_unit: 0.000947817,
    us_therm: 9.4804e-9,
    foot_pound: 0.737562
}

// temperature -- celsius is the root unit
temperature = {
    celsius: 1,
    fahrenheit: (c) => { return (c * 9/5) + 32; },
    kelvin: (c) => { return c + 273.15; },
    ktoc: (k) => { return k - 273.15; },
    ftoc: (f) => { return (f - 32) * 5/9; },
}

temperature_formula = {
    fahrenheit: "f = (c * 9/5) + 32",
    kelvin: "k = c + 273.15",
    ktoc: "c = k - 273.15",
    ftoc: "c = (f - 32) * 5/9",
    ftok: "k = (f - 32) * 5/9 + 273.15",
    ktof: "f = (k - 273.15 * 9/5) + 32",
    def: "1",
}