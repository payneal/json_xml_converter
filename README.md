# JSON XML Converter

# to run test
* git clone repo
* cd xml_and_json
* npm install
* npm run test


# how libary works
* to create converter ex.
```javascript
    const Converter = require('../json_to_xml_converter');
    let  converter = new Converter();
```

* to convert a json object to xml 
```javascript
    var args = JSON_OBJECT 
    var json_object  = converter.json_to_xml(args);
```

* to convert  xml to json object
```javascript
    var args = XML_STRING
    var xml_string = converter.xml_to_json(args);
```

* to tell converter that the xml string you are passing in has array elements
```javascript
        var args = {
        	umm: {
            	attributes: { 
                	x: '10',                               
                },
				hold: [
					{count:"0"},
					{count:"1"}
				]
         	}
		};

		var valid_xml = `
			<umm x="10">
   				<hold>
        			<count>0</count>
        			<count>1</count>
    			</hold>
			</umm>`

       	converter.add_elements_that_are_arrays(["hold"]);
        var xml = converter.json_to_xml(args);
        expect(valid_xml).xml.to.equal(xml);
	});

```

* to clear the array possibilities for xml to json
```javascript
    converter.clear_xml_array_name();
```

* needs another featuer implemented to handdle xml array within an array element
```javascript
    //not implemented
```
