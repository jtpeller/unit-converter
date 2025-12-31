// =================================================================
// = units.js
// =  Description:  Contains all unit objects
// =  Author:       jtpeller
// =  Date:         September 03, 2022
// =================================================================
"use strict";

class Units {
    constructor({ names = [], factors = {} }) {
        this.names = names;
        this.factors = factors;

        // Discover the root by finding the unit for which the factor is 1.
        for (let [k, v] of Object.entries(factors)) {
            if (v == 1) {
                this.root = k;
                break;
            }
        }
    }
}

const LENGTH = new Units({
    names: [
        "Meter", "Kilometer", "Centimeter", "Millimeter", "Micrometer",
        "Nanometer", "Mile", "Yard", "Foot", "Inch", "Nautical Mile"
    ],
    factors: LEN_FACTORS,
});

const AREA = new Units({
    names: [
        "Square meter", "Square kilometer", "Square mile", "Square yard", "Square foot",
        "Square inch", "Hectare", "Acre"
    ],
    factors: AREA_FACTORS,
});

const VOLUME = new Units({
    names: [
        "US liquid gallon", "US liquid quart", "US liquid pint", "US liquid cup", "US legal cup",
        "US fluid ounce", "Imperial gallon", "Imperial quart", "Imperial pint", "Imperial cup",
        "Imperial fluid ounce", "Imperial tablespoon", "Imperial teaspoon", "US tablespoon",
        "US teaspoon", "Cubic foot", "Cubic inch", "Cubic meter", "Liter", "Milliliter"
    ],
    factors: VOLUME_FACTORS,
});

const MASS = new Units({
    names: [
        "Kilogram", "Pound", "Ounce", "Gram", "Milligram", "Microgram", "Metric Ton",
        "Imperial Ton", "US Ton", "Stone"
    ],
    factors: MASS_FACTORS,
});

const TIME = new Units({
    names: [
        "Nanosecond", "Microsecond", "Millisecond", "Second", "Minute", "Hour",
        "Day", "Week", "Month", "Year", "Decade", "Century", "Millennium"
    ],
    factors: TIME_FACTORS,
});

const ENERGY = new Units({
    names: [
        "Joule", "Kilojoule", "Gram calorie", "Kilocalorie", "Watt hour", "Kilowatt hour",
        "Electronvolt", "British Thermal Unit", "US therm", "Foot-pound"
    ],
    factors: ENERGY_FACTORS,
});

const TEMP = new Units({
    names: ["Celsius", "Fahrenheit", "Kelvin"],
    factors: TEMP_FACTORS,
});

const UNITS_LIST = [LENGTH, AREA, VOLUME, MASS, TIME, ENERGY, TEMP];
