///header/Console-demo
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
///group/logging to console
///item/basic logging statements
console.log("This is a basic log message");
console.info("This is an info message");
console.warn("This is a warning message");
console.error("This is an error message (includes a stack-trace)");

///item/message formatting
var index = 12, oneThird = 1/3, message = "testing...";

console.log("Index is %s, and one third is approx. %s", 
    index, oneThird);
console.info("The message is %s", message);

///item/logging variables
var array = [1,2,3], 
    object = {title:"MCC Demo", location:"Eemsgolaan 5"};

console.dir(array);
console.dir(object);
console.dir(document.body);

console.info("My data", array, object);

///item/timing
var nrOfLoops = 123456, sum = 0;
console.time("my timer");

    for(var index = 0; index < nrOfLoops; index++) {
        sum += Math.sqrt(index);
    }
    console.info("Sum of all square roots until %s is %s", 
        nrOfLoops, sum);
    
console.timeEnd("my timer");

///group/Optional snippets
///item/message styling
var big   = "font-size:400%; font-weight:bold; color:slateblue", 
    weird = "color:red; font-variant:small-caps; font-size:125%;", 
    ugly  = "font-style:italic; font-weight:bold; \
text-decoration:underline; color:orange";

console.log("%cMCC Demo", big);
console.log("%cStyling is not always %cstylish", weird, ugly);

///item/grouping
console.group("Group one");
    console.info("Message in group one");
    console.info("Another message");
console.groupEnd();
console.group("Group two");
    console.info("Message in group two");
        console.groupCollapsed("Subgroup (click to open)");
        console.warn("A warning in a subgroup");
        console.log("A log message in a subgroup");
        console.groupEnd();
    console.info("Another message");
console.groupEnd();

///item/miscellaneous
var isInitialized, 
    array = "zero,one,two".split(',');

console.assert(isInitialized !== undefined, 
    "Variable has not been initialized yet");
console.table(array);
console.count("Number of messages logged: ");