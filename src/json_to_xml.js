const xmlWriter = require("xml-writer");

function Convertor() {

    this.json_to_xml = function(json) {
        var xw = new xmlWriter(true);
        add_elements(xw, json);
        xw.endDocument();
        return xw.toString();
    }

    add_attributes = function(xw, json) {
        if(json.hasOwnProperty('attributes')) { 
            enter_attributes(xw, json);
        }
    }

    enter_attributes = function(xw, json) {
        for ( var attribute in json['attributes']){ 
            xw.writeAttribute(attribute, String(json['attributes'][attribute]))
            xw.endAttribute();
        }
        delete json['attributes']
    }
    
    add_text = function(xw, json) {
        if(json.hasOwnProperty('self')) { 
            xw.text(json['self']);
            delete json['self']
        }
    }
    
    add_elements = function(xw, json) {
        for (var prop in json) {
            enter_element(xw, prop, json); 
        }
    }

    enter_element = function(xw, prop, json) {
       if ( json.hasOwnProperty(prop)) {
            create_element(xw, prop, json[prop]);
            decide_how_to_handle_element(xw, json, prop)
            xw.endElement();
        }
    }

    add_array_of_elements = function(xw, array_of_elements) { 
        for( var idx = 0; idx < array_of_elements.length; idx++) { 
            add_element_from_array(idx, array_of_elements, xw);
        }
    }

    add_element_from_array = function(idx, array_of_elements, xw) {
        for ( var element_name in array_of_elements[idx]) {
            enter_element(xw, element_name, array_of_elements[String(idx)])
        }
    }

    decide_how_to_handle_element = function(xw, json, prop) { 
        if(typeof json[prop] == 'object') {
            add_array_of_elements_or_single_element(xw, json, prop);     
        } else {  
            xw.text(json[prop]);
        }
    }

    add_array_of_elements_or_single_element = function(xw, json, prop) {
        if (Array.isArray(json[prop])) {
            add_array_of_elements(xw, json[prop]);
        } else { 
            add_elements(xw, json[prop]);          
        }
    }

    create_element = function( xw, prop, json) {
        xw.startElement(prop);
        add_attributes(xw, json);
        add_text(xw, json);
    }
}

module.exports = Convertor
