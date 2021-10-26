///header/Lus-demo
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
///group/for-statement
///item/basic for;; loop
var array = [1,2,3,4];

for(var index = 0; index <  array.length; index++) {
    var item = array[index];
    zeg("item %s @ index %s", item, index);
}

///item/for;; loop met "group by"
var array = [7, 11, 13, 21];

for(var index = 0; index <  array.length; index++) {
    var item = array[index];
    var laatsteKopje;
    var kopje = Math.floor(item/10);
    // Test of het kopje is gewijzigd
    if (laatsteKopje != kopje) {
        zeg("=== in tafel van %s ===", kopje * 10);
    }
    zeg("%sgetal: %s", (kopje == 0 ? "" : "* "), item)
    laatsteKopje = kopje;
};

///item/Array.prototype.forEach loop
var array = [3,2,1];

array.forEach(function(item, index) {
    zeg("item %s @ index %s", item, index);
});

///item/forEach loop 2 (probleem)
var array = [7, 11, 13, 21];

array.forEach(function(item, index) {
    var laatsteKopje;
    var kopje = Math.floor(item/10);
    // Test of het kopje is gewijzigd
    if (laatsteKopje != kopje) {
        zeg("=== in tafel van %s ===", kopje * 10);
    }
    zeg("%sgetal: %s", (kopje == 0 ? "" : "* "), item)
    laatsteKopje = kopje;
});

///item/forEach loop 3 (opgelost)
var array = [7, 11, 13, 21];

var laatsteKopje;
array.forEach(function(item, index) {
    var kopje = Math.floor(item/10);
    // Test of het kopje is gewijzigd
    if (laatsteKopje != kopje) {
        zeg("=== in tafel van %s ===", kopje * 10);
    }
    zeg("%sgetal: %s", (kopje == 0 ? "" : "* "), item)
    laatsteKopje = kopje;
});

///group/for..in-statement
///item/basic for..in loop
var object = { name: "Doeke", email: "doeke.zanstra@atos.net" };

for(var property in object) {
    var item = object[property];
    zeg("object.%s == %s", property, item);
}

///item/for..in loop array probleem?
var array = [7, 11, 13, 21, 3, 18, 9];

for(var property in array) {
    var item = array[property];
    zeg("array.%s == %s", property, item);
}
// Volgorde wordt niet gegarandeerd...
