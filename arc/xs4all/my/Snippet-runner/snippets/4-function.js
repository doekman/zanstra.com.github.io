///header/Function-demo
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
///group/function basics
///item/function statement
hoi();

function hoi() {
    zeg('hoi');
}

///item/function expression
dag();

var dag = function() {
    zeg('dag');
}

///item/function statement/expression?
var moi = function doei() {
    zeg('moi doei');
}

moi();
doei();

///item/anonymous function expression
var moi = function doei() {
    zeg('moi (local known as) doei');
    if (arguments.length == 0) {
        doei(true);
    }
}

moi();

///group/function as type
///item/typeof function
zeg(typeof hi);

var hi = function() {
    zeg('hi');
}

zeg(typeof hi);
///group/function as argument
///item/array sort
var a = ['02', '4', '007', '13', '03', '01'];

function numberCompare(a, b) { return +a - +b; }

a.sort(numberCompare);

console.dir(a);

///item/array sort, inline
var a = ['02', '4', '007', '13', '03', '01'];

a.sort(function(a, b) { 
    return -(+a - +b); 
});

console.dir(a);

///item/jQuery, inline
$(document).ready(function(event) {
    $("h1:nth-child(2)").css("color", "red");
});

// or short hand

$(function() {
    $("h1:nth-child(2)").css("font-style", "italic");
});
