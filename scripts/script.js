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

window.onload = function init() {
    // get all the needed DOM elements
    elem.unit1 = d3.select('#unit1');    // first unit dropdown
    elem.unit2 = d3.select('#unit2');    // second unit dropdown
    elem.in1 = d3.select('#in1');        // in1 is first unit input
    elem.in2 = d3.select('#in2');        // in2 is second unit input
    elem.unit1span = d3.select('#unit1span');
    elem.factor = d3.select('#factor');
    elem.unit2span = d3.select('#unit2span');
    
    // get all buttons
    btns.length = d3.select('#length');
    btns.area = d3.select('#area');
    btns.volume = d3.select('#volume');
    btns.mass = d3.select('#mass');
    btns.time = d3.select('#time');
    
    initListeners();

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
        converted = convertUnits(units, +elem.in1.node().value, elem.unit1.node().value, elem.unit2.node().value, unit_root);
        elem.in2.node().value = converted;
    })

    elem.in2.on('input', function() {
        converted = convertUnits(units, +elem.in2.node().value, elem.unit2.node().value, elem.unit1.node().value, unit_root);
        elem.in1.node().value = converted;
    })

    // listeners on unit dropdowns
    elem.unit1.on('change', function() {
        updateFormula();

        // modify conversion
        elem.in1.node().value = 1;
        elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
    })

    elem.unit2.on('change', function() {
        updateFormula();

        // modify conversion
        elem.in1.node().dispatchEvent(new Event('input', {bubbles:true}));
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
    if (input_unit == root) {
        // we are going from root unit to the selected output unit
        // convert directly using saved factors
        o = output_unit.replaceAll(" ", '_').toLowerCase();
        return input * units[o];
    } else if (output_unit == root) {
        // converting directly to the root unit.
        i = input_unit.replaceAll(" ", '_').toLowerCase();
        return input * (1/units[i])
    }
    // convert to root unit, then convert to desired output
    i = input_unit.replaceAll(" ", '_').toLowerCase();
    o = output_unit.replaceAll(" ", '_').toLowerCase();
    return input * (1/units[i]) * units[o];
}

function updateFormula() {
    unit1 = elem.unit1.node().value.replaceAll(" ", "_").toLowerCase();
    unit2 = elem.unit2.node().value.replaceAll(" ", "_").toLowerCase();
    
    text = elem.unit1.node().value.toLowerCase() + "s";
    elem.unit1span.text(text.replace('foots', 'feet').replace('us', 'U.S.').replace('imperial', 'Imperial'))

    text = elem.unit2.node().value.toLowerCase() + "s";
    elem.unit2span.text(text.replace('foots', 'feet').replace('us', 'U.S.').replace('imperial', 'Imperial'))

    elem.factor.text(1/units[unit1] * units[unit2])

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