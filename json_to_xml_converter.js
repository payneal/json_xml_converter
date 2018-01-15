const xml_work = require("./src/xml_to_json.js");
const json_work = require("./src/json_to_xml.js");

let xml_convert = new xml_work();
let json_convert = new json_work();

function Json_Xml_Converter() {

    this.json_to_xml = function(json) {
        if (json != null && typeof json == 'object')
            return json_convert.json_to_xml(json);
        throw Error ('must be json object');
    }

    this.xml_to_json = function(xml) {
        if (typeof xml  == 'string')
            return xml_convert.xml_to_json(xml);
        throw Error ('must be string');
    }

    this.add_elements_that_are_arrays= function(list_of_array_names) {
        if (Array.isArray(list_of_array_names))
            xml_convert.elements_that_are_arrays = list_of_array_names;
    }
    
    this.clear_xml_array_names = function() {
        xml_convert.elements_that_are_arrays = []; 
    }
}

module.exports = Json_Xml_Converter;
