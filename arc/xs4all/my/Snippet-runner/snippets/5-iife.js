///header/Immediate-Invoked Function Expression (IIFE)-demo
function zeg() { console.info.apply(console, arguments); }
try {
///footer/
}
catch(ex) {
    console.error(ex)
}
///group/IIFE
///item/basic example
(function() {
    "use strict";
    
    var now = new Date;
    console.info("It's the year %s", now.getFullYear() );
    
})();

///item/global aliases
(function(global, j) {
    "use strict";

    var subHeading = j('h1:first').html();
    
    global.setTimeout(function() {
        console.info("the subHeading was: %s", subHeading);
    }, 500);
    
    
})(window, jQuery);

///group/Revealing Module-pattern
///item/Define a module
var Module;

(function(exports) {
    "use strict";
    
    function welcome(name) {
        var hour = new Date().getHours();
        var greeting = hour < 6 ? "Goodnight" 
            : hour < 12 ? "Goodmorning" 
            : hour < 18 ? "Goodafternoon" 
            : "Goodevening";
        return greeting + ", " + name + "!";
    }
        
    exports.welcome = welcome;
    
})( Module || (Module = {}) );

console.info( Module.welcome("Dracula") );

///item/Multiple files
//--- file: a.js --------------------------------
var MyStuff;

(function(exports) {
    "use strict";
    
    exports.getGreeting = function(hour) {
        return hour <  6 ? "Goodnight" 
             : hour < 12 ? "Goodmorning" 
             : hour < 18 ? "Goodafternoon" 
             :             "Goodevening";
    };
    
})( MyStuff || (MyStuff = {}) );

//--- file: b.js --------------------------------
var MyStuff;

(function(exports) {
    "use strict";
    
    exports.getCurrentHour = function() {
        return new Date().getHours();
    };
    
})( MyStuff || (MyStuff = {}) );

//--- file: c.js --------------------------------
var hour = MyStuff.getCurrentHour();
var greet = MyStuff.getCurrentHour(hour);
console.info( "%s, Dracula", greet );