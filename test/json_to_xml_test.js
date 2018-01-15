const chai = require('chai');
const expect = chai.expect;
const chaiXML = require('chai-xml');
chai.use(chaiXML);
const uuidv1 = require('uuid/v1');

const moment = require('moment');

const Converter = require('../json_to_xml_converter');
let converter = new Converter();

describe("json => xml valid calls", function() {

	it('should throw error if not json obj', function() {
		expect (() => converter.json_to_xml("hi")).to.throw(
			Error, "must be json object");
	});

    it('should be able to create xml with attributes',
            function() {
        var args = {
            Name : {
                attributes: {
                    first: "ali",
                    last: "payne"
                }
            }
        };
        var valid_xml = `<Name first="ali" last="payne"/>`;
        var xml = converter.json_to_xml(args);
        expect(valid_xml).xml.to.equal(xml);
    });    

    it('should be able to create complex xml w/ attributes', function() {
        var args = {
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

        var valid_xml= `
            <Name first="ali" last="payne">
                <Location>
                    <State>ohio</State>
                    <City>unknown</City>
                </Location>
                <Language sounds="like a buckeye">
                    <what>english</what>
                </Language>
            </Name>`;
        var xml = converter.json_to_xml(args);
        expect(valid_xml).xml.to.equal(xml);
    });    

    it('should be able to create complex xml with empty json obj', function() {
    
        var args = {
            Name : {
                attributes: {
                    first: "ali",
                    last: "payne"
                },
                Location : {},
                Language: {}
            }
         };
        
        var valid_xml = `
            <Name first="ali" last="payne">
                <Location/>
                <Language/>
            </Name>`
        var xml = converter.json_to_xml(args);
        expect(valid_xml).xml.to.equal(xml);
    });
});
