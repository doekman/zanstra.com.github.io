///header/JSON-demo
function zeg() { console.info.apply(console, arguments); }
try {
    console.group("Snippet run");
///footer/
}
catch(ex) {
    console.error(ex)
}
finally {
    console.groupEnd();
}
///group/to JSON
///item/serialize (with a better name)
var object = {
    title: "MCC Demo",
    isStarted: true,
    somePrimeNumbers: [1,3,5,7],
    now: new Date,
};

console.log( JSON.stringify(object) );

///item/serialize (2)
var object = {
    title: "MCC Demo",
    isStarted: true,
    somePrimeNumbers: [1,3,5,7],
    now: new Date,
};

var indent = " ";
console.log( JSON.stringify(object, null, indent) );

indent = "\t";
var whiteList = ["title","isStarted","now"];
console.log( JSON.stringify(object, whiteList, indent) );

///item/not all objects are json
var object = { name:"MCC demo" };
var array = [ object ];

console.info("array 1: %s", JSON.stringify(array) );

object.list = array;

console.info("array 2: %s", JSON.stringify(array) );

///group/from JSON
///item/parse (1)
var json = '{"title":"MCC Demo","isStarted":true,\
"somePrimeNumbers":[1,3,5,7],"now":"2015-11-08T18:17:21.488Z"}';

var object = JSON.parse(json);

console.dir(object);

///item/parse (2)
var json = '{"title":"MCC Demo","isStarted":true,\
"somePrimeNumbers":[1,3,5,7],"now":"2015-11-08T18:17:21.488Z"}';

var object = JSON.parse(json, function(key, value) {
    if (key == "now") return new Date(value);
    return value;
});

console.dir(object);