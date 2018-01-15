const xmlParser = require("xml-parser");

function  Convertor_for_xml_to_json() {    

    // private vars
    var self = this;

    // public vars
    this.created_json = {}; 
    this.elements_that_are_arrays = []

    // callable functions
    this.xml_to_json = function(xml) {
        self.created_json = {};
        xml = xmlParser(xml);
        create_json(xml["root"], add_name_args_content(xml["root"], []));
    	return self.created_json;
	}

    // private function
    function create_json(parsed_xml, keys_used) {
        check_out_location(parsed_xml, keys_used);
        for (x of parsed_xml['children']) {
            convert_next_level_of_xml(x, keys_used);
        }
    }
  
    function check_out_location(parsed_xml, keys_used) {
        var location = get_json_location(keys_used);
        if (typeof(location) == 'string') add_attributes_in_single_element(parsed_xml);
    }

    function add_attributes_in_single_element(parsed_xml) {
        var name = set_name_attributes_content(parsed_xml['attributes'], parsed_xml); 
        self.created_json[name] = {};
        self.created_json[name]['self'] =  parsed_xml['attributes'][name];;
        delete  parsed_xml['attributes'][name];
        self.created_json[name]['attributes'] = parsed_xml['attributes']; 
    }

    function convert_next_level_of_xml(next_line, level) { 
        if (check_if_children_in_xml(next_line)) {
            more_levels_to_convert(next_line, level);
        } else  {
            add_name_args_content(next_line, level);
        }
    }

    function check_if_children_in_xml(parsed_xml) {
        return  parsed_xml['children'].length > 0;
    }

    function more_levels_to_convert(next_line, level) {
        new_level = set_up_for_more_converting(next_line, level);
        more_converting(next_line, new_level);
    }

   function more_converting(next_line, new_level) {
        for  (x of next_line['children']) {
            convert_next_level_of_xml(x, new_level);
        }
    }

    function set_up_for_more_converting(next_line, level) { 
       var name = add_name_args_content(next_line, level);
        var new_level = level.slice();
        new_level.push(name[0]);
        return new_level;
    }

   function add_name_args_content( parsed_xml, level) {
        var location = get_json_location(level);
        var name = set_name_attributes_content(location, parsed_xml);
       //consMaole.log("here is nam: " + name);
        return [name]
    }

    function get_json_location(level) {
        if (level.length == 0) return self.created_json;
        return get_json_current_level(level)
    }

    function get_json_current_level( levels) {
        var current_level = self.created_json;
        for (level of levels) {
            current_level = current_level[level]
        }
        return current_level;
    }

    function set_name(parsed_xml, location) {
        var name = parsed_xml['name'];
        if (self.elements_that_are_arrays.includes(name) ) {
            location[name] = []
            return [name,false]
        } else {
            location[name] = {};
            return [name, true]
        }
    }

    function set_name_attributes_content(location, parsed_xml) {
        var name_status  = set_name(parsed_xml, location);
        var name = name_status[0];
        var status = name_status[1];        
        return make_next_move_based_on_status(
            name, status, location, parsed_xml)
    }    
    
    function make_next_move_based_on_status(name, status, location, parsed_xml){ 
        if (status == true) { 
            set_args(parsed_xml, name, location);
            set_content(parsed_xml, name, location);
        } else fill_in_array_element(parsed_xml, name, location); 
        return name;
    }

    function set_args(parsed_xml, name, location) {
        var args = parsed_xml['attributes'];
        add_args_to_json(location,name, args);
    }

    function add_args_to_json(json,  name, args) {
        if (Object.keys(args).length > 0) {
            json[name]['attributes'] = args;
        }
    }

    function set_content(next_line, name, location) {
        if (check_content_empty_or_undefined(next_line))  {
            location[name] = next_line['content'];
        }
    }

    function check_content_empty_or_undefined(next_line) {
        return (next_line['content'] !== undefined && next_line['content'] !== "") 
    }

      function fill_in_array_element(parsed_xml, key_name, location) {
        if ( check_if_children_in_xml(parsed_xml)) { 
            enter_array_of_elements(
                parsed_xml['children'], key_name, location); 
        }
    }

    function enter_array_of_elements(parsed_xml, key_name, location) {
        for (var x=0; x < parsed_xml.length; x++) {
            name = add_key_to_json_in_array_of_elements(
                parsed_xml, x, location, key_name);
            add_attributes_to_json_in_array_of_element(
                parsed_xml, x, location, key_name, name);
            add_content_to_json_in_array_of_elements(
                parsed_xml, x, location, key_name, name, location);
            fill_in_within_array_element(parsed_xml[x], location[key_name][x][name]);      
        }
    }

    function add_key_to_json_in_array_of_elements( parsed_xml, x, location, key_name) { 
        var name =  parsed_xml[x]['name'];
        location[key_name][x] = {};
        location[key_name][x][name] = {}
        return name;
    }

    function add_attributes_to_json_in_array_of_element(
            parsed_xml, x, location, key_name, name) {
        var args = parsed_xml[x]['attributes'];
        if (Object.keys(args).length > 0) {
            location[key_name][x][name]["attributes"] = args; 
        }
    }

    function add_content_to_json_in_array_of_elements(
            parsed_xml, x, location, key_name, name, location) {
        if ( check_content_empty_or_undefined(parsed_xml[x])) { 
            var it = parsed_xml[x].content;
            if (typeof(it) == "object") {
                location[key_name][x][name]['self'] = parsed_xml[x]['contnet'];
            } else {     
                location[key_name][x][name] = it;
            }
        }
    }

   function fill_in_within_array_element(parsed_xml, location) { 
        if(check_if_children_in_xml( parsed_xml)) {       
            parsed_xml = parsed_xml['children']
            go_through_each_array_element(parsed_xml, location);    
        }
    } 
          
    function go_through_each_array_element(parsed_xml, location) {
        for (var i= 0; i < parsed_xml.length; i++) { 
            var name = parsed_xml[i]['name'];
            // would need to add something if this could be an array
            var args = parsed_xml[i]['attributes'];
            set_key_and_attributes_in_json_if_possible(name, args, location);
            decision_on_filling_in_json_for_array_element(parsed_xml, i, name, location);
        }
    }
 
    function set_key_and_attributes_in_json_if_possible(name, args, location) {
        if (Object.keys(args).length > 0) {
            location[name] = {}
            location[name]["attributes"] = args; 
        } 
    }
   
    function decision_on_filling_in_json_for_array_element(parsed_xml, i, name, location) {
        if (!( "content" in parsed_xml[i])) { 
            location[name] = {};
        } else if ( parsed_xml[i]['content'] != "" && name in location) {
            location[name]['self'] = parsed_xml[i]['content']
        } else if (parsed_xml[i]["contnet"] != "" && parsed_xml[i]['children'].length < 1){ 
            location[name] = parsed_xml[i]['content']
        } else if ( check_if_children_in_xml(parsed_xml[i])){
            if (!(name in location)) location[name] = {};
            fill_in_within_array_element(parsed_xml[i], location[name]);
        }
    }
}

module.exports = Convertor_for_xml_to_json
