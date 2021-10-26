///header/Scope-demo
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
///group/Variable scope
///item/Global/local scope
var title = "MCC demo";

function test() {
    var title = "Testing the demo";
    
    zeg("The title is: %s", title);
}

test();

///item/Block scope?
var title = "MCC demo";

function test(switchOn) {
    zeg("The title is: %s", title);
    
    if (switchOn) {
        var title = "Inside if-statement";

        zeg("The title is: %s", title);
    }
    
    zeg("The title is: %s", title);
}

test(true);

///item/Arguments too
var title = "MCC demo";

function test(title) {
    zeg("The title is: %s", title);
}

test("overrated");

///item/Local scope == function scope
var title = "MCC demo";

function test(title) {
    
    function innerTest() {
        var title = "456";
        
        zeg("then comes: %s", title);
    }

    zeg("Testing %s", title);
    innerTest();
}

test("123");
