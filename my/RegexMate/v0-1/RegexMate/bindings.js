var getRegex = function() {
  return base2.$("#regex_regex").value;
};

var setState = function(happy) {
  var icon = happy === null ? "&hellip;" : happy ? "ok" : "x";
  var cls = happy === null ? "edit" : happy ? "happy" : "bad";
  var regex_state = base2.DOM.bind(base2.$("#regex_state"));
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

new base2.JSB.RuleList({
  "#form": {
    ondocumentready: function() {
      refreshRx();
    }
  },
	"#regex_regex": {
		disabled: false,
		onchange: function() {
			refreshRx();
		},
		onfocus: function() {
		  setState(null);
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
			if(regex.rx) con.log(getRegex()+".test('"+string1.value+"')\n=> "+regex.rx.test(string1.value));
			else con.log("Regex is not correct");
		}
	},
	"#replace": {
		disabled: false,
		onclick: function() {
			if (regex.rx) con.log("'"+string1.value+"'.replace("+getRegex()+", '"+string2.value+"')\n=> "+string1.value.replace(regex.rx, string2.value));
			else con.log("Regex is not correct");
		}
	},
	"#exec": {
		disabled: false,
		onclick: function() {
			if (regex.rx) {
				var a = regex.rx.exec(string1.value);
				con.log(getRegex()+".match('"+string1.value+"')");
				if(a) {
					base2.forEach(a, function(item, i) {
						con.log((i==0 ? "=>" : "  ")+i+": "+a[i]);
					});
				} else {
				  con.log("=> null");
				}
			}
			else con.log("Regex is not correct");
		}
	},
	"#clear": {
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