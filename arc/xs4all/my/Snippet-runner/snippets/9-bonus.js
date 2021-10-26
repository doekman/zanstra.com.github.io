///header/Bonus-demo
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
///group/New methods
///item/ISO date (aka XML-date)
var iso = "2015-11-14T20:15:00.125Z";
var dt = new Date(iso);

console.assert(dt.getMonth() == 11 - 1);
console.assert(dt.getDate() == 14);
console.assert(dt.getDay() == 6);  //saturday

console.assert( dt.toISOString() == iso );

///item/At last, trim
var userInput = '   \tDevelopers Developers   \t  \r\n';

console.info("userInput (%s) trimmed -> (%s)", 
    userInput, userInput.trim() );

///item/Array extra's (1)
var array = [1,3,5,7,9,7,5,3,1];

console.info("indexOf(3) -> %s",      array.indexOf(3) );
console.info("lastIndexof(5) -> %s",  array.lastIndexOf(5) );

///item/Array extra's (2)
var array = [1,3,5,7,11,13,17,19,23];

// Array every == linq All
console.info("every(isOddd) -> %s",   array.every(isOddd) );

// Array filter == linq Where
console.info("filter(hasOne) -> %s",  array.filter(hasOne).join(',') ); 

// Array map == linq Select
console.info("map(toHex) -> %s",      array.map(toHex).join(',') );

// Array some == linq Any
console.info("some(hasTwenty) -> %s", array.some(hasTwenty) );          



function isOddd(n) { return n % 2 != 0; }
function hasOne(n) { return (""+n).indexOf('1') != -1; }
function toHex(n) { return '0x' + n.toString(16).toUpperCase(); }
function hasTwenty(n) { return n >= 20; }
