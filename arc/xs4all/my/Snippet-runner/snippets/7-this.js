///header/This-demo
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
///group/basic this
///item/this and global
function local() {
    console.info("local: this === window: %s", this === window);
}

function strictLocal() {
    "use strict";
    console.info("strictLocal: this === window: %s", this === window);
}

console.info("global: this === window: %s", this === window);
local();
strictLocal();

///item/this object
var object = {
    name: "Doeke",
    welcome: function() {
        console.info("Welcome, %s", this.name);
        console.dir(this);
    }
}

object.welcome();

///item/this & passing handlers (1)
var object = {
    name: "Doeke",
    welcome: function() {
        console.info("Welcome, %s", this.name);
    }
}

function doIt(handler) {
    handler();
}

doIt( object.welcome );

///item/this & passing handlers (2)
//betere foutmelding
(function() {
    "use strict";
    
    var object = {
        name: "Doeke",
        welcome: function() {
            console.info("Welcome, %s", this.name);
        }
    }

    function doIt(handler) {
        handler();
    }

    doIt( object.welcome );

})();

///item/this & passing handlers (3)
//de oplossing
var object = {
    name: "Doeke",
    welcome: function() {
        console.info("Welcome, %s", this.name);
    }
}

function doIt(handler) {
    handler();
}

// "Uitgestelde" method aanroep
doIt( object.welcome.bind(object) );

///group/this & jQuery
///item/this & event
$("h1").click(function(event) {
    $(this).toggleClass("bg-danger");
    
    event.preventDefault();
})

///item/this & closure (1)
$("h1").click(function(event) {
    $.get('heading.txt', function(content) {
        $(this).toggleClass("bg-info").html(content);
    }, 'text');
    
    event.preventDefault();
})

///item/this & closure (2)
$("h1").click(function(event) {
    var self = this;
    $.get('heading.txt', function(content) {
        $(self).toggleClass("bg-info").html(content);
    }, 'text');
    
    event.preventDefault();
})
