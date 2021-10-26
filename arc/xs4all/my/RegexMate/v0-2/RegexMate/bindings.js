eval(base2.namespace);
eval(base2.JSON.namespace);

var getRegex = function() {
  return base2.$("#regex_regex").value;
};

var setState = function(happy) {
  var icon = happy === null ? "&hellip;" : happy ? "ok" : "x";
  var cls = happy === null ? "edit" : happy ? "happy" : "bad";
  var regex_state = DOM.bind(base2.$("#regex_state"));
  regex_state.removeClass('edit');
  regex_state.removeClass('happy');
  regex_state.removeClass('bad');
  regex_state.addClass(cls);
  regex_state.innerHTML = icon;
};
var refreshRx = function() {
	try {
    var regex_regex = base2.$("#regex_regex");
    var regex = base2.$("#regex");
		regex.rx = eval("("+getRegex()+")");
		setState(true);
		con.log("RegExp "+getRegex()+" is ready...");
	}
	catch (ex) {
		regex.rx = null;
		setState(false);
		con.log("Error in regular expression:"+ex.message);
	}
	return regex.rx;
};

var initForm = function(params) {
  var a, re = /(^|&)([^=]+)=([^&]*)/g;
  if (params=(params || "_").slice(1)) {
    var regex, s1 = "", s2 = "";
    while (a=re.exec(params)) {
      var name = a[2], value = decodeURIComponent(a[3]);
      switch (a[2]) {
        case 'regex':   regex = value; break;
        case 'string1': s1 = value; break;
        case 'string2': s2 = value; break;
      }
    }
    if (regex) {
      regex_regex.value = regex;
      string1.value = s1;
      string2.value = s2;
      refreshRx();
      return true;
    }
  }
  return false;
};

new base2.JSB.RuleList({
  "#form": {
    ondocumentready: function() {
      initForm(location.search);
      refreshRx();
    }
  },
  "a[type=command]": {
    style: {
      borderBottom: "1px dashed slateblue",
      textDecoration: "none"
    },
    onclick: function(e) {
      if (initForm(e.target.getAttribute("href"))) {
        e.preventDefault();
      } 
    }
  },
	"#regex_regex": {
		disabled: false,
		onchange: function() {
			refreshRx();
		},
		onfocus: function() {
		  setState(null);
		},
		onblur: function() {
		  setState( regex.rx !== null );
		}
	},
	"#regex": {
	  rx: null
	},
	"#string1,#string2": {
		disabled: false
	},
	"#test": {
		disabled: false,
		onclick: function() {
			if(regex.rx) {
  		  var val = string1.value;
			  con.log(getRegex()+".test("+JSON.toString(val)+")");
			  con.log("=> "+regex.rx.test(val));
		  }
			else con.log("Regex is not available");
		}
	},
	"#exec": {
		disabled: false,
		onclick: function() {
			if (regex.rx) {
			  var val1 = string1.value;
				var a = regex.rx.exec(val1);
				con.log(getRegex()+".match("+JSON.toString(val1)+")");
				if(a) {
					forEach(a, function(item, i) {
						con.log((i==0 ? "=> " : "   ")+i+": "+a[i]);
					});
				} else {
				  con.log("=> null");
				}
			}
			else con.log("Regex is not available");
		}
	},
	"#search": {
		disabled: false,
		onclick: function() {
			if(regex.rx) {
			  var val = string1.value;
			  con.log(JSON.toString(val)+".search("+getRegex()+")");
			  con.log("=> "+val.search(regex.rx));
			} else {
			  con.log("Regex is not available");
		  }
		}
	},
	"#replace": {
		disabled: false,
		onclick: function() {
			if (regex.rx) {
  		  var val1 = string1.value, val2 = string2.value;
			  con.log(JSON.toString(val1)+".replace("+getRegex()+", "+JSON.toString(val2)+")");
			  con.log("=> "+val1.replace(regex.rx, val2));
		  }
			else con.log("Regex is not available");
		}
	},
	"#split": {
		disabled: false,
		onclick: function() {
			if (regex.rx) {
  		  var val1 = string1.value, val2 = parseInt(string2.value), a;
  		  if (isNaN(val2)) {
  		    con.log(JSON.toString(val1)+".split("+getRegex()+")");
  		    a = val1.split(regex.rx);
  		  } else {
  		    con.log(JSON.toString(val1)+".split("+getRegex()+", "+val2+")");
  		    a = val1.split(regex.rx, val2);
		    }
		    if (a.length>0) {
  				forEach(a, function(item, i) {
  					con.log((i==0 ? "=> " : "   ")+i+": "+JSON.toString(a[i]));
  				});
				} else {
			    con.log("=> []");
		    }
		  }
			else con.log("Regex is not available");
		}
	},
	"#match": {
		disabled: false,
		onclick: function() {
			if (regex.rx) {
  		  var val1 = string1.value, a;
		    con.log(JSON.toString(val1)+".match("+regex.rx.source+")");
		    a = val1.match(regex.rx);
		    if(a !== null) {
  				forEach(a, function(item, i) {
  					con.log((i==0 ? "=> " : "   ")+i+": "+JSON.toString(a[i]));
  				});
				} else {
				  con.log("=> null");
				}
		  }
			else con.log("Regex is not available");
		}
	},
	"#clear-log": {
		disabled: false,
		onclick: function() {
			con.value="";
		}
	},
	"#con": {
		disabled: false,
		spellcheck: false,
		log: function(message) {
			this.value += (this.value ? "\n" : "") + message;
		}
	},
	".exec2": {
		onmouseover: function() {
			regex_regex.addClass("hilite");
			string1.addClass("hilite");
		},
		onmouseout: function() {
			string2.disabled=false;
			regex_regex.removeClass("hilite");
			string1.removeClass("hilite");
		}
	},
	".exec3": {
		onmouseover: function() {
			regex_regex.addClass("hilite");
			string1.addClass("hilite");
			string2.addClass("hilite");
		},
		onmouseout: function() {
			regex_regex.removeClass("hilite");
			string1.removeClass("hilite");
			string2.removeClass("hilite");
		}
	},
	".con": {
		onmouseover: function() {
			con.addClass("hilite");
		},
		onmouseout: function() {
			con.removeClass("hilite");
		}
	}
});