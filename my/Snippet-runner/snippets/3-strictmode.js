///header/Strict mode-demo
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
///group/Strict mode
///item/@file level
"use strict";

//doesn't work, because this script runs in a sandbox

console.info("using strict mode?");
undeclaredVariableFile = 12;

console.info("value is: %s", undeclaredVariableFile);

///item/@function level
function runStrictMode() {
    "use strict";
    
    console.info("using strict mode...");
    undeclaredVariableFunction = 12;

    console.info("value is: %s", undeclaredVariableFunction);
}

runStrictMode();

///item/protecting global variables
function runStrictMode() {
    "use strict";
    
    console.info("NaN = '%s'", NaN);
    NaN = "not a number";
}

runStrictMode();

///item/(no) duplicate naming arguments
function runStrictMode() {
    "use strict";
    
    var fn = function(a,b,a) { return a-b; };
}

runStrictMode();

///item/octal numbers
var a = 0123;
var b = 123;

console.info("%s == %s: %s", a, b, a == b);

///item/octal numbers (strict)
function runStrictMode() {
    "use strict";

    var a = 0123;
    var b = 123;

    console.info("%s == %s: %s", a, b, a == b);
}

runStrictMode();

