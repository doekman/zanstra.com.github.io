///header/JavaScript types-demo
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
///group/Primitive types
///item/typeof
var notInitialized;
var primitiveTypes = [
    undefined, notInitialized, 
    true, false, 
    42, -18, Math.PI, 10e100, Infinity, -1/0, NaN, 
    '', "string", "𝖀𝔫𝔦𝔠𝔬𝔡𝔢: 🤓", "₀❶②➌➃❺⑥➐➇⁹" 
];
for(var index = 0; index < primitiveTypes.length; index++) {
    var item = primitiveTypes[index];
    console.info("%s: typeof %s -> '%s'", index, item, typeof item);
}

///item/Truthiness javascript
var tests = [
    undefined, true, false, 
    0, 1, Math.PI, Infinity, NaN, 
    '', 'string'
];
for(var index = 0; index < tests.length; index++) {
    var item = tests[index];
    if (item) {
        console.info("%s: %s -> true", index, item);
    }
    else {
        console.info("%s: %s -> false", index, item);
    }
}

///item/Conversie
var bool   = !!'12';
var number =  +'12';
var string =  ""+12;

console.dir(bool);
console.dir(number);
console.dir(string);

///group/Object types
///item/typeof
var objectTypes = [
    null, 
    new Object, {x:1}, 
    new Array, [1,2], 
    new Date(), 
    /\b\d{4} ?[a-z]{2}/i, 
    function(x) { return x*x; }
];
for(var index = 0; index < objectTypes.length; index++) {
    var item = objectTypes[index];
    console.info("%s: typeof %s -> '%s'", index, item, typeof item);
}

///item/Object type bepalen
console.assert( null === null );
console.assert( {} instanceof Object );
console.assert( [] instanceof Array );  
//of
console.assert( Array.isArray( [] ) );
console.assert( new Date instanceof Date );
console.assert( /x/ instanceof RegExp );
console.assert( function(){} instanceof Function );

console.info("No assertions failed?");

