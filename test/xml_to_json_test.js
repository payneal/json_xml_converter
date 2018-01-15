const chai = require('chai');
const expect = chai.expect;
const deepKeys = require('deep-keys');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const Converter = require('../json_to_xml_converter.js');
let converter = new Converter();

var valid_json;
var xml;

var version = "2.0";
var xmlns = "http://www.conexxus.org/schema/naxml/mobile/v02";
var umit =  uuidv1();
var merchantId = uuidv1();
var timeDateStamp = moment().format();
var siteId = uuidv1();
var posTransNumber = uuidv1();
var workstationId = uuidv1();
var workstationId = uuidv1();
var fuelingPositionId = uuidv1();
var settlementPeriodId = uuidv1();
var siteIdentifier =  "11";



describe("xml => json valid calls", function() {

	it('should throw error if xml is not a string', function() {
		expect (() => converter.xml_to_json([])).to.throw(
			Error, "must be string");
	});

    it('should be able to create json from xml with attributes', function() {
        xml =`
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <Name first="ali" last="payne"/>`;
        valid_json =  {
            Name : {
                attributes: {
                    first: "ali",
                    last: "payne"
                }
            }
        };
        var json = converter.xml_to_json(xml);
        expect(json).to.deep.equal(valid_json);
    });

     it('should be able to create complex xml w/ attributes', function() {
         
         xml= `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <Name first="ali" last="payne">
                <Location>
                    <State>ohio</State>
                    <City>unknown</City>
                </Location>
                <Language sounds="like a buckeye">
                    <what>english</what>
                </Language>
            </Name>`;
         
         valid_json = {
            Name : {
                attributes: {
                    first: "ali",
                    last: "payne"
                },
                Location : {
                    State: "ohio",
                    City: "unknown",
                },
                Language: {
                    attributes: {
                        sounds: "like a buckeye"
                    },
                    what: "english"
                }
            }
         };
        
        var json = converter.xml_to_json(xml);
        expect(json).to.deep.equal(valid_json);        
    });    

     it('should be able to create complex xml with empty json obj', function() {
    
         xml = `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <Name first="ali" last="payne">
                <Location/>
                <Language/>
            </Name>`;
         
         valid_json  = {
            Name : {
                attributes: {
                    first: "ali",
                    last: "payne"
                },
                Location : {},
                Language: {}
            }
        };

        var json = converter.xml_to_json(xml);
        expect(json).to.deep.equal(valid_json);  
    });

    it('should be able to create xml w/ attrrinutes and elements' , function() {
        xml = `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <AdditionalProductCode additionalProductCodeFormat="upcA" posCodeModifier=".6">123453627365</AdditionalProductCode><`;
	
        valid_json = {
        	AdditionalProductCode: {
            	attributes: { 
                	additionalProductCodeFormat: 'upcA',
                    posCodeModifier: ".6"                                
                },
                self: "123453627365"
            }
        };

        var json = converter.xml_to_json(xml);
        expect(json).to.deep.equal(valid_json);     
     });

	
    it('should be able to create xml array' , function() {

        xml = `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    		<umm x="10">
    		    <hold>
      			    <count>0</count>
        		    <count>1</count>
     			</hold>
    		</umm>`;

      valid_json = {
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

        converter.add_elements_that_are_arrays(['hold']);
        var json = converter.xml_to_json(xml);
        expect(json).to.deep.equal(valid_json);     
    }); 
});
