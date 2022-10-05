// =================================================================
// = script.js
// =  Description:  Handles unit conversion for the site.
// =  Author:       jtpeller
// =  Date:         September 03, 2022
// =================================================================

let elem = {};
let btns = {};
let units = length;     // ptr to length factors
let unit_root;          // ptr to unit root
let unit1 = "meter";
let unit2 = "kilometer";
let formula;
let tform;

window.onload = function init() {
    // get all the needed DOM elements
    elem.unit1 = d3.select('#unit1');    // first unit dropdown
    elem.unit2 = d3.select('#unit2');    // second unit dropdown
    elem.in1 = d3.select('#in1');        // in1 is first unit input
    elem.in2 = d3.select('#in2');        // in2 is second unit input
    elem.unit1span = d3.select('#unit1span');
    elem.factor = d3.select('#factor');
    elem.unit2span = d3.select('#unit2span');
    elem.formula = d3.select('wrap');
    
    // get all buttons
    btns.length = d3.select('#length');
    btns.area = d3.select('#area');
    btns.volume = d3.select('#volume');
    btns.mass = d3.select('#mass');
    btns.time = d3.select('#time');
    btns.energy = d3.select('#energy');
    btns.temperature = d3.select('#temperature');
    
    initListeners();

    // save off formula
    formula = elem.formula.html();
    tform = temperature_formula.fahrenheit;

    // initialization events
    btns.length.node().click();
    elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
    elem.unit1.node().dispatchEvent(new Event('change', {bubbles:true}));
    elem.unit2.node().dispatchEvent(new Event('change', {bubbles:true}));

    populateDropdowns(length_units);
    
}

// initializes all listeners
function initListeners() {
    // listeners on the input boxes
    elem.in1.on('input', function() {
        if (units == temperature) {
            converted = convertTemperature(+elem.in1.node().value, elem.unit1.node().value, elem.unit2.node().value);
        } else {
            converted = convertUnits(units, +elem.in1.node().value, elem.unit1.node().value, elem.unit2.node().value, unit_root);
        }
        elem.in2.node().value = converted;
    })

    elem.in2.on('input', function() {
        converted = convertUnits(units, +elem.in2.node().value, elem.unit2.node().value, elem.unit1.node().value, unit_root);
        elem.in1.node().value = converted;
    })

    // listeners on unit dropdowns
    elem.unit1.on('change', function() {
        elem.in1.node().value = 1;
        elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
        updateFormula();
    })

    elem.unit2.on('change', function() {
        elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
        updateFormula();
    })

    // listeners on the buttons
    btns.length.on('click', function() {
        changeUnit(0);
    })

    btns.area.on('click', function() {
        changeUnit(1);
    })

    btns.volume.on('click', function() {
        changeUnit(2);
    })

    btns.mass.on('click', function() {
        changeUnit(3);
    })
    
    btns.time.on('click', function() {
        changeUnit(4);
    })

    btns.energy.on('click', function() {
        changeUnit(5);
    })

    btns.temperature.on('click', function() {
        changeUnit(6);
    })
}

function changeUnit(unit_value) {
    switch (unit_value) {
        case 1:
            units = area;
            unit_root = area_root;
            populateDropdowns(area_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.area.classed('selected-btn', true);
    
            // now update formula
            updateFormula();
            break;
        case 2:
            units = volume;
            unit_root = volume_root;
            populateDropdowns(volume_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.volume.classed('selected-btn', true);
            
            // now update formula
            updateFormula();
            break;
        case 3:
            units = mass;
            unit_root = mass_root;
            populateDropdowns(mass_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.mass.classed('selected-btn', true);
            
            // now update formula
            updateFormula();
            break;
        case 4:
            units = time;
            unit_root = time_root;
            populateDropdowns(time_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.time.classed('selected-btn', true);
            
            // now update formula
            updateFormula();
            break;
        case 5:
            units = energy;
            unit_root = energy_root;
            populateDropdowns(energy_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.energy.classed('selected-btn', true);

            // update formula
            updateFormula();
            break;
        case 6:
            units = temperature;
            unit_root = temperature_root;
            populateDropdowns(temperature_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.temperature.classed('selected-btn', true);
            
            updateFormula();
            break;
        default:
            units = length;
            unit_root = length_root;
            populateDropdowns(length_units);
            d3.selectAll('button').classed('selected-btn', false);
            btns.length.classed('selected-btn', true);

            // now update formula
            updateFormula();
    }

    // general stuff like change in1 to 1
    elem.in1.node().value = 1;
    elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
}

function populateDropdowns(units) {
    elem.unit1.text("");    // clear out all options
    elem.unit2.text("");    // clear out all options

    for (var i = 0; i < units.length; i++) {
        elem.unit1.append('option')
            .attr('value', units[i])
            .attr('id', "unit"+i)
            .text(units[i])
        elem.unit2.append('option')
            .attr('value', units[i])
            .attr('id', "unit"+i)
            .text(units[i])
    }

    // default which units are selected at first
    elem.unit1.select('#unit0').attr('selected', 0)
    elem.unit2.select('#unit1').attr('selected', 0)
}

function convertUnits(units, input, input_unit, output_unit, root) {
    i = input_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();
    o = output_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();

    if (input_unit == root) {           // convert directly from root unit
        return input * units[o];
    } else if (output_unit == root) {   // converting directly to root
        return input * (1/units[i])
    }
    // convert to root unit, then convert to desired output
    return input * (1/units[i]) * units[o];
}

function convertTemperature(input, input_unit, output_unit) {
    i = input_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();
    o = output_unit.replaceAll(" ", '_').replaceAll('-', '_').toLowerCase();

    // figure out which formula to use
    if (i.startsWith("c")) {   // celcius
        if (o.startsWith("c")) {
            tform = temperature_formula.def;
            return input;
        }
        tform = temperature_formula[o];
        return temperature[o](input);    // c -> k or f
    } else if (i.startsWith("f")) {
        if (o.startsWith('c')) { // f -> c
            tform = temperature_formula.ftoc;
            return temperature.ftoc(input);
        } else {                 // f -> k
            tform = temperature_formula.ftok;
            return temperature.kelvin(temperature.ftoc(input));
        }
    } else {
        if (o.startsWith('c')) { // k -> c
            tform = temperature_formula.ktoc;
            return temperature.ktoc(input);
        } else {
            tform = temperature_formula.ktof;
            return temperature.fahrenheit(temperature.ktoc(input));
        }
    }
}

function updateFormula() {
    unit1 = elem.unit1.node().value.replaceAll(" ", "_").replaceAll('-', '_').toLowerCase();
    unit2 = elem.unit2.node().value.replaceAll(" ", "_").replaceAll('-', '_').toLowerCase();

    if (units != temperature) {
        elem.formula.html(formula);
        elem.unit1span = d3.select('#unit1span');
        elem.factor = d3.select('#factor');
        elem.unit2span = d3.select('#unit2span');
        
        // set units
        text1 = elem.unit1.node().value.toLowerCase() + "s";
        text2 = elem.unit2.node().value.toLowerCase() + "s";
        elem.unit1span.text(text1.replace('foots', 'feet').replace('us', 'U.S.').replace('imperial', 'Imperial'))
        elem.unit2span.text(text2.replace('foots', 'feet').replace('us', 'U.S.').replace('imperial', 'Imperial'))
        
        // set factor
        elem.factor.text(1/units[unit1] * units[unit2])
    } else {
        elem.formula.html(tform);
    }


    elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
}

function format(num, count) {
    s = '' + num;
    
    // check for faulty count values
    if (count <= 0 || count > s.length) {
        return num;
    }
    return +s.slice(0, count);
}
