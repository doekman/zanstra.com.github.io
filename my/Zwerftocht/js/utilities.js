function ar_randomItem(array, determineWeightFn) {
    return ar_randomItem.implementation(array, getRandomInt, determineWeightFn);
}
ar_randomItem.implementation = function(array, getRandomIntFn, determineWeightFn) {
    var weights = []
    ,   totalWeight = 0
    ,   index
    ,   itemWeight
    ,   pickWeight
    ;
    for (index = 0; index < array.length; index++) {
        var item = array[index]
        ;
        itemWeight = determineWeightFn(item)
        totalWeight += itemWeight; 
        weights.push(totalWeight);
    }
    pickWeight = getRandomIntFn(0, totalWeight);
    for (index = 0; index < weights.length; index++) {
        itemWeight = weights[index];
        if (pickWeight <= itemWeight) {
            break;
        }
    }
    return index < array.length ? array[index] : null;
}
// Poor man's unit test
ar_randomItem.unitTest = function() {
    //--| Setup
    var id=0,
        Item = function(n,name) { 
            return {'id':id++, 'name':name, 'weight':n};
        },
        arr = [Item(9,'First'),Item(7,'second'),Item(6,'third'),Item(1,'Fourth')],
        getWeight = function(x) { return x.weight; },
        assertIs = function(expected,actual,message) {
            var result = expected === actual;
            if (!result) throw new Error(format('%1: expected=%2, actual=%3', message, expected, actual));
        }
    ;
    //--| Testing
    console.info("Starting tests.....");
    var item;
    item = ar_randomItem.implementation(arr, function(a,b){ return 0; }, getWeight); assertIs(0, item.id, 'First item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 9; }, getWeight); assertIs(0, item.id, 'First item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 10; }, getWeight); assertIs(1, item.id, 'Second item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 16; }, getWeight); assertIs(1, item.id, 'Second item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 17; }, getWeight); assertIs(2, item.id, 'Third item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 22; }, getWeight); assertIs(2, item.id, 'Third item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 23; }, getWeight); assertIs(3, item.id, 'Fourth item');
    item = ar_randomItem.implementation(arr, function(a,b){ return 24; }, getWeight); assertIs(null, item, 'No item');
    console.info("Tests have finished!");
}
function ar_map(array, selector) {
  var result = [];
  for(var i=0; i<array.length; i++) {
    result.push(selector(array[i]));
  }
  return result;
}
function ar_max(array) {
  var result = Number.MIN_VALUE;
  for(var index = 0; index < array.length; index++) {
    var value = array[index];
    result = Math.max(result, value);
  }
  return result;
}
function ar_min(array) {
  var result = Number.MAX_VALUE;
  for(var index = 0; index < array.length; index++) {
    var value = array[index];
    result = Math.min(result, value);
  }
  return result;
}
function indexOf2(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == value) return i;
  }
  return -1;
}

//--| Splits a string in a left and a right part.
function split2(string, search) {
  var index = string.indexOf(search);
  return { left: string.substring(0, index), middle: search, right: string.substring(index + search.length) };
}

//--| Transforms {test:"1,2,3"} into [{test:"1"},{test:"2"},{test:"3"}]
//--|            {test:[1,2],getal:4} into [{test:1,getal:4},{test:2,getal:4}]
function csv2(object) {
  var res = [], prototype = {}, isList = function (v) {
    return v instanceof Array || (typeof v == 'string' && v.indexOf(',') != -1)
  };
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      var val = object[prop];
      if (!isList(val)) prototype[prop] = val;
    }
  }
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      var val = object[prop];
      if (isList(val)) {
        var list = val instanceof Array ? val : csv(val);
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          if (!res[i]) res[i] = copy(prototype);
          res[i][prop] = item;
        }
      }
    }
  }
  return res;
}

//--| Returns the HTML5 value of an input
(function ($) {
  $.fn.val2 = function () {
    var element = this.get(0);
    if (element.validity.valid) {
        switch (element.type) {
            case "checkbox": return element.checked;
            case "hidden":
            case "text": return element.value.trim();
            case "number": return element.valueAsNumber;
                //case "date": return element.valueAsDate;
            default: throw new Error("Unknown input type: " + element.type);
        }
    }
    return null;
  }
})(jQuery);

//--| Returns the next id in a list of objects
var nextId = function (list) {
  var max = 0;
  for (var i = 0; i < list.length; i++) {
    max = Math.max(max, list[i].id);
  }
  return max + 1;
};

//--| Returns the index of an item in an array with property id == requested value
var indexOfId = function (list, id) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].id == id) {
      return i;
    }
  }
  return -1;
};

var findById = function (list, id) {
  var index = indexOfId(list, id);
  return index == -1 ? null : list[index];
}

//--| Returns random int within a range
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//--| Sorts alphanumerically, with configurable selector
var ascSorter = function (a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
var alphaSorter = function (selector) {
  return function (a, b) {
    var normalizeName = function (x) {
      return x.toLowerCase().replace(/^(de|het)\s*/, '');
    },  A = normalizeName(selector(a)),
        B = normalizeName(selector(b));
    return ascSorter(A,B);
  }
}
var alphaNumSorter = function (selector) {
  // Braksort: zorg voor human sort ["1. Bla", "2. Die", "10. Bla"]
  //           (met alphaSort komt "10. Bla" tussen 1 en 2 in)
  return function (a, b) {
    let reAlphaNum = /^([0-9]*)?(.*)$/
    ,   aa = selector(a).match(reAlphaNum).splice(1)
    ,   bb = selector(b).match(reAlphaNum).splice(1)
    ,   normalizeName = function (x) {
      return x.toLowerCase().replace(/^(de|het)\s*/, '').replace(/^[-=_+;:,.]+/, '');
    };
    res1 = ascSorter(+aa[0],+bb[0]);
    if (res1 == 0) {
      aa[1] = normalizeName(aa[1]);
      bb[1] = normalizeName(bb[1]);
      return ascSorter(aa[1],bb[1]);
    }
    return res1
  }
}

var coords_distance = function(coords_a, coords_b) {
  let square_side_x = Math.pow(Math.abs(coords_a[0] - coords_b[0]), 2);
  let square_side_y = Math.pow(Math.abs(coords_a[1] - coords_b[1]), 2);
  return Math.sqrt(square_side_x + square_side_y);
}

// From base2js
// Url: https://code.google.com/p/base2/source/browse/trunk/lib/src/base2.js

function format(string) {
  // Replace %n with arguments[n].
  // e.g. format("%1 %2%3 %2a %1%3", "she", "se", "lls");
  // ==> "she sells sea shells"
  // Only %1 - %9 supported.
  var args = arguments;
  var pattern = new RegExp("%([1-" + (arguments.length - 1) + "])", "g");
  return (string + "").replace(pattern, function (match, index) {
    return args[index];
  });
};

var _RESCAPE = /([\/()[\]{}|*+-.,^$?\\])/g;             // safe regular expressions
function rescape(string) {
  // Make a string safe for creating a RegExp.
  return (string + "").replace(_RESCAPE, "\\$1");
};

function copy(object) { // A quick copy.
  var copy = {};
  for (var i in object) {
    copy[i] = object[i];
  }
  return copy;
};

function csv(string) {
  return string ? (string + "").split(/\s*,\s*/) : [];
};