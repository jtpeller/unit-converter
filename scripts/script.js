// =================================================================
// = script.js
// =  Description:  Handles unit conversion for the site.
// =  Author:       jtpeller
// =  Date:         September 03, 2022
// =================================================================
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // input & output units
    let units = LENGTH;
    let i = units.names[0];
    let o = units.names[1];

    // Unit Type dropdown
    let ut_dd = select('#unit-type-dd');

    // Input elements
    let in_dd = select('#input');           // input unit dropdown
    let in_box = select('#input-box');      // input unit text field

    // Output elements
    let out_dd = select('#output');         // output unit dropdown
    let out_box = select('#output-box');    // output unit text field

    // Formula vars
    let formula = select('#wrap')
    let in_span = select('#input-span');    // input's unit in the formula
    let f_span = select('#factor');         // factor in the formula
    let out_span = select('#output-span');  // output's unit in the formula

    // Save other values
    const FORM = select('#wrap').innerHTML;     // saved formula for later use
    let tform = T_FORM.fahrenheit;              // temperature formula

    // Initialize all listeners
    initListeners();

    // First-time load in requires init events
    ut_dd.dispatchEvent(new Event('change', { bubbles: true }));
    in_box.dispatchEvent(new Event('input', { bubbles: true }));
    in_dd.dispatchEvent(new Event('change', { bubbles: true }));
    out_dd.dispatchEvent(new Event('change', { bubbles: true }));

    // Populate dropdowns based on default unit-set
    populateDropdowns(LENGTH.names);

    /** Wrapper for appendChild, combo'd with my create function */
    function append(appendee, elem, options = {}) {
        return appendee.appendChild(create(elem, options));
    }

    /** Wrapper for Object.assign(). Creates an element and assigns it options */
    function create(elem, options = {}) {
        return Object.assign(document.createElement(elem), options)
    }

    /** Wrapper for query selector */
    function select(elem, origin = document) {
        return origin.querySelector(elem);
    }

    /** Initializes all listeners for the page */
    function initListeners() {
        // Listener on the input box
        in_box.addEventListener("input", () => {
            let converted = 0;
            if (units == TEMP) {
                converted = convertTemperature(+in_box.value, in_dd.value, out_dd.value);
            } else {
                converted = convertUnits(units.factors, +in_box.value, in_dd.value, out_dd.value, units.root);
            }
            out_box.value = converted;
        });

        // Output box can be used as an input field
        out_box.addEventListener("input", () => {
            in_box.value = convertUnits(units.factors, +out_box.value, out_dd.value, in_dd.value, units.root);
        });

        // Activate listener on the Unit Type dropdown
        ut_dd.addEventListener("change", () => {
            changeUnit(UNITS_LIST[ut_dd.value]);
        })

        // Activate listeners on unit dropdowns
        in_dd.addEventListener("change", () => {
            in_box.value = 1;
            in_box.dispatchEvent(new Event('input', { bubbles: true }));
            updateFormula();
        })

        out_dd.addEventListener("change", () => {
            in_box.dispatchEvent(new Event('input', { bubbles: true }));
            updateFormula();
        })
    }

    /**
     * changeUnit() - performs the required updates to variables and the page
     * @param {number} mode     which unit to change to. Range: 0 thru 6, which 
     * aligns with length, area, volume, mass, time, energy, and temperature.
     */
    function changeUnit(unit_obj) {
        // Set this unit object.
        units = unit_obj;

        // Set the unit dropdowns to these names.
        populateDropdowns(unit_obj.names);

        // Change the input value to 1.
        in_box.value = 1;
        in_box.dispatchEvent(new Event('input', { bubbles: true }));

        // Update the formula.
        updateFormula();
    }

    /**
     * populateDropdowns() - clears dropdowns, then populates them
     * @param {string[]} unit_names  string arr to create dropdown options from
     */
    function populateDropdowns(unit_names) {
        // Clear out current options
        in_dd.innerText = "";
        out_dd.innerText = "";

        // Loop through units and add the options
        for (var i = 0; i < unit_names.length; i++) {
            append(in_dd, 'option', {
                value: unit_names[i],
                id: `unit-${i}`,
                textContent: unit_names[i]
            });
            append(out_dd, 'option', {
                value: unit_names[i],
                id: `unit-${i}`,
                textContent: unit_names[i]
            });
        }

        // Default which units are selected at first
        select('#unit-0', in_dd).setAttribute('selected', 0)
        select('#unit-1', out_dd).setAttribute('selected', 0)
    }

    /**
     * convertUnits() -- performs the conversion of input to output
     * @param {object} factors      which factors are being used
     * @param {number} input        value to convert
     * @param {string} input_unit   unit of the input value
     * @param {string} output_unit  unit to convert to
     * @param {string} root         this conversion's root unit
     */
    function convertUnits(factors, input, input_unit, output_unit, root) {
        const [i, o] = cleanUnit(input_unit, output_unit);

        // Decide how to convert
        if (input_unit == root) {           // convert directly from root unit
            return input * factors[o];
        } else if (output_unit == root) {   // converting directly to root
            return input * (1 / factors[i])
        } else {                            // convert to root, then to output
            return input * (1 / factors[i]) * factors[o];
        }
    }

    /**
     * convertTemperature() -- performs the conversion of input temp to output temp
     * @param {number} input        value to convert
     * @param {string} input_unit   unit of the input value
     * @param {string} output_unit  unit to convert to
     */
    function convertTemperature(input, input_unit, output_unit) {
        const [i, o] = cleanUnit(input_unit, output_unit);

        // Figure out which formula to use
        if (i.startsWith("c")) {   // celcius
            if (o.startsWith("c")) {    // c -> c
                tform = T_FORM.def;
                return input;
            }
            tform = T_FORM[o];
            return TEMP_FACTORS[o](input);    // c -> k or f
        } else if (i.startsWith("f")) {
            if (o.startsWith('c')) { // f -> c
                tform = T_FORM.ftoc;
                return TEMP_FACTORS.ftoc(input);
            } else {                 // f -> k
                tform = T_FORM.ftok;
                return TEMP_FACTORS.kelvin(TEMP_FACTORS.ftoc(input));
            }
        } else {
            if (o.startsWith('c')) { // k -> c
                tform = T_FORM.ktoc;
                return TEMP_FACTORS.ktoc(input);
            } else {
                tform = T_FORM.ktof;
                return TEMP_FACTORS.fahrenheit(TEMP_FACTORS.ktoc(input));
            }
        }
    }

    /** Performs visual update of the formula in the DOM */
    function updateFormula() {
        const [i, o] = cleanUnit(in_dd.value, out_dd.value);

        if (units != TEMP) {
            formula.innerHTML = FORM;
            in_span = select('#input-span');
            f_span = select('#factor');
            out_span = select('#output-span');

            // Set units
            let text1 = in_dd.value.toLowerCase() + "s";
            let text2 = out_dd.value.toLowerCase() + "s";
            in_span.innerText = fixGrammar(text1);
            out_span.innerText = fixGrammar(text2);

            // Set factor
            f_span.innerText = 1.0 / units.factors[i] * units.factors[o];
        } else {
            formula.innerHTML = tform;
        }

        in_box.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /** 
     * Cleans up unit strings so it can be used for indexing 
     * @param {string} input_unit   Input unit raw string name.
     * @param {string} output_unit  Output unit raw string name.
     */
    function cleanUnit(input_unit, output_unit) {
        i = input_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();
        o = output_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();
        return [i, o];
    }

    /** Adjusts grammar for specific wording; like foots -> feet; us -> U.S., etc. */
    function fixGrammar(text) {
        return text.replace('foots', 'feet').replace('us', 'U.S.').replace('imperial', 'Imperial');
    }
});
