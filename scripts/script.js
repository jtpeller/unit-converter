// =================================================================
// = script.js
// =  Description:  Handles unit conversion for the site.
// =  Author:       jtpeller
// =  Date:         September 03, 2022
// =================================================================
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // input & output units
    let i = "meter";        // input unit, init to meter
    let o = "kilometer";    // output unit, init to km
    let factors = LEN;     // ptr to factors
    let unit_root;          // ptr to unit root

    // input elements
    let in_dd = select('#input');           // input unit dropdown
    let in_box = select('#input-box');      // input unit text field

    // output elements
    let out_dd = select('#output');         // output unit dropdown
    let out_box = select('#output-box');    // output unit text field

    // formula vars
    let formula = select('#wrap')
    let in_span = select('#input-span');    // input's unit in the formula
    let f_span = select('#factor');         // factor in the formula
    let out_span = select('#output-span');  // output's unit in the formula

    // get all buttons
    const length_btn = select('#length');
    const area_btn = select('#area');
    const volume_btn = select('#volume');
    const mass_btn = select('#mass');
    const time_btn = select('#time');
    const energy_btn = select('#energy');
    const temp_btn = select('#temperature');

    // save other values
    const FORM = select('#wrap').innerHTML;     // saved formula for later use
    let tform = T_FORM.fahrenheit;              // temperature formula

    // initialize all listeners
    initListeners();

    // first-time load in requires init events
    length_btn.click();
    in_box.dispatchEvent(new Event('input', { bubbles: true }));
    in_dd.dispatchEvent(new Event('change', { bubbles: true }));
    out_dd.dispatchEvent(new Event('change', { bubbles: true }));

    // populate dropdowns based on default unit-set
    populateDropdowns(LEN_NAMES);
    
    /** wrapper for appendChild, combo'd with my create function */
    function append(appendee, elem, options={}) {
        return appendee.appendChild(create(elem, options));
    }

    /** wrapper for Object.assign(). Creates an element and assigns it options */
    function create(elem, options={}) {
        return Object.assign(document.createElement(elem), options)
    }
    
    /** wrapper for query selector */
    function select(elem, origin = document) {
        return origin.querySelector(elem);
    }

    /** initializes all listeners for the page */
    function initListeners() {
        // listener on the input box
        in_box.addEventListener("input", () => {
            let converted = 0;
            if (factors == TEMP) {
                converted = convertTemperature(+in_box.value, in_dd.value, out_dd.value);
            } else {
                converted = convertUnits(factors, +in_box.value, in_dd.value, out_dd.value, unit_root);
            }
            out_box.value = converted;
        });

        // output box can be used as an input field
        out_box.addEventListener("input", () => {
            in_box.value = convertUnits(factors, +out_box.value, out_dd.value, in_dd.value, unit_root);;
        })

        // listeners on unit dropdowns
        in_dd.addEventListener("change", () => {
            in_box.value = 1;
            in_box.dispatchEvent(new Event('input', { bubbles: true }));
            updateFormula();
        })

        out_dd.addEventListener("change", () => {
            in_box.dispatchEvent(new Event('input', { bubbles: true }));
            updateFormula();
        })

        // listeners on the buttons
        length_btn.addEventListener("click", () => { changeUnit(0) });
        area_btn.addEventListener("click", () => { changeUnit(1)});
        volume_btn.addEventListener("click", () => { changeUnit(2) });
        mass_btn.addEventListener("click", () => { changeUnit(3) });
        time_btn.addEventListener("click", () => { changeUnit(4) });
        energy_btn.addEventListener("click", () => { changeUnit(5) });
        temp_btn.addEventListener("click", () => { changeUnit(6) });
    }

    /**
     * changeUnit() - performs the required updates to variables and the page
     * @param {number} mode     which unit to change to. Range: 0 thru 6, which 
     * aligns with length, area, volume, mass, time, energy, and temperature.
     */
    function changeUnit(mode) {
        switch (mode) {
            case 1:     // area
                updateUnits(AREA, AREA_ROOT, AREA_NAMES, area_btn);
                break;
            case 2:
                updateUnits(VOLUME, VOLUME_ROOT, VOLUME_NAMES, volume_btn);
                break;
            case 3:
                updateUnits(MASS, MASS_ROOT, MASS_NAMES, mass_btn);
                break;
            case 4:
                updateUnits(TIME, TIME_ROOT, TIME_NAMES, time_btn);
                break;
            case 5:
                updateUnits(ENERGY, ENERGY_ROOT, ENERGY_NAMES, energy_btn);
                break;
            case 6:
                updateUnits(TEMP, TEMP_ROOT, TEMP_NAMES, temp_btn);
                break;
            default:
                updateUnits(LEN, LEN_ROOT, LEN_NAMES, length_btn);
        }

        // general stuff like change input-box to 1
        in_box.value = 1;
        in_box.dispatchEvent(new Event('input', { bubbles: true }));

        // update units based on newly selected unit
        function updateUnits(unit, root, type, btn) {
            factors = unit;
            unit_root = root;
            populateDropdowns(type);

            // make sure the selected unit button is highlighted
            document.querySelectorAll('button').forEach((abtn) => {
                abtn.classList.remove('selected-btn');
            })
            btn.classList.add('selected-btn');

            updateFormula();        // update once completed
        }
    }

    /**
     * populateDropdowns() - clears dropdowns, then populates them
     * @param {string[]} units  string arr to create dropdown options from
     */
    function populateDropdowns(units) {
        // clear out current options
        in_dd.innerText = "";
        out_dd.innerText = "";

        // loop through units and add the options
        for (var i = 0; i < units.length; i++) {
            append(in_dd, 'option', {
                value: units[i],
                id: `unit-${i}`,
                textContent: units[i]
            });
            append(out_dd, 'option', {
                value: units[i],
                id: `unit-${i}`,
                textContent: units[i]
            });
        }

        // default which units are selected at first
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

        // decide how to convert
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

        // figure out which formula to use
        if (i.startsWith("c")) {   // celcius
            if (o.startsWith("c")) {    // c -> c
                tform = T_FORM.def;
                return input;
            }
            tform = T_FORM[o];
            return TEMP[o](input);    // c -> k or f
        } else if (i.startsWith("f")) {
            if (o.startsWith('c')) { // f -> c
                tform = T_FORM.ftoc;
                return TEMP.ftoc(input);
            } else {                 // f -> k
                tform = T_FORM.ftok;
                return TEMP.kelvin(TEMP.ftoc(input));
            }
        } else {
            if (o.startsWith('c')) { // k -> c
                tform = T_FORM.ktoc;
                return TEMP.ktoc(input);
            } else {
                tform = T_FORM.ktof;
                return TEMP.fahrenheit(TEMP.ktoc(input));
            }
        }
    }

    /** performs visual update of the formula in the DOM */
    function updateFormula() {
        const [i, o] = cleanUnit(in_dd.value, out_dd.value);

        if (factors != TEMP) {
            formula.innerHTML = FORM;
            in_span = select('#input-span');
            f_span = select('#factor');
            out_span = select('#output-span');

            // set units
            let text1 = in_dd.value.toLowerCase() + "s";
            let text2 = out_dd.value.toLowerCase() + "s";
            in_span.innerText = fixFoots(text1);
            out_span.innerText = fixFoots(text2);

            // set factor
            f_span.innerText = 1.0 / factors[i] * factors[o];
        } else {
            formula.innerHTML = tform;
        }
        in_box.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /** cleans up unit strings so it can be used for indexing */
    function cleanUnit(input_unit, output_unit) {
        i = input_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();
        o = output_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();
        return [i, o];
    }

    /** fixes "foots" usage (from applied plurality rules) */
    function fixFoots(text) {
        return text.replace('foots', 'feet').replace('us', 'U.S.').replace('imperial', 'Imperial');
    }
});
