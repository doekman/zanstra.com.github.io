eval(base2.namespace);
eval(base2.JSON.namespace);

function spanClass(inner, cls) { return '<span class="'+cls+'">'+inner+'</span>'; }
function logString(s) { return spanClass(JSON.toString(s), 'string'); }
function logRegex() { return spanClass(getRegex(), 'regex'); }
function logNumber(n) { return spanClass(n, 'number'); }
function logBoolean(b) { return spanClass(b, 'boolean'); }
function logNull() { return spanClass("null", 'null'); }
function logSep(s) { return spanClass(s, "sep"); }
function logArrayItem(i, item) { return logNumber(i) + logSep(": ") + logString(item); }
function logMethod(method, inner) {
  var a=[]; for(var i=1; i<arguments.length; i++) a.push(arguments[i]);
  var args = a.join(spanClass(",  ", "sep"));
  return spanClass(".", "sep") + spanClass(method, 'method') + spanClass("("+args+")", "bracket");
}

function getRegex() {
  return regex_regex.value;
}

function regexAvailable() {
  if(regex.rx === null) {
    con.warn("Regex is not available");
    return false;
  }
  return true;
}

var setState = function(happy) {
  regex_state.innerHTML = happy === null ? "&hellip;" : happy ? "a" : "x";
  regex_state.className = happy === null ? "edit" : happy ? "ok" : "warn";
};
var refreshRx = function() {
	try {
		regex.rx = eval("("+getRegex()+")");
		setState(true);
		con.info("RegExp "+logRegex()+" is ready...");
	}
	catch (ex) {
		regex.rx = null;
		setState(false);
		con.warn(ex.name+": "+ex.message);
	}
	return regex.rx;
};

var initForm = function(params) {
  var a, re = /(^|&)([^=]+)=([^&]*)/g, result = false;
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
      result = true;
    }
  }
  refreshRx();
  return result;
};

new base2.JSB.RuleList({
  "#form": {
    ondocumentready: function() {
      initForm(location.search);
    }
  },
  "a[type='command']": {
    style: {
      borderBottom: "1px dotted red",
      textDecoration: "none"
    },
    onclick: function(e) {
      var t = e.target;
      while (t && t.nodeName != 'A') t = t.parentNode;
      if (t && initForm(t.getAttribute("href"))) {
        e.preventDefault();
        test.focus();
      }
    },
    onmouseover: function() { this.style.backgroundColor = "yellow"; },
    onmouseout:  function() { this.style.backgroundColor = ""; }
  },
	"#regex_regex": {
		disabled: false,
		onchange: function() {
      refreshRx();
      whileOnGlobal.setState();
    },
		onfocus: function()  { setState(null); },
		onblur: function()   { setState( regex.rx !== null ); }
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
      con.beforeRun();
			if (regexAvailable()) {
  		  var val = string1.value;
			  con.cmd(logRegex() + logMethod('test', logString(val)));
			  con.log(logBoolean(regex.rx.test(val)));
		  }
		}
	},
	"#exec": {
		disabled: false,
		onclick: function() {
      con.beforeRun();
			if (regexAvailable()) {
			  var val1 = string1.value;
        var maxIterations = 72;
        do {
          var a = regex.rx.exec(val1);
          con.cmd(logRegex() + logMethod('exec', logString(val1)));
          if (a) forEach(a, function(item, i) {
            con.log(logArrayItem(i, a[i]));
          });
          else con.log(logNull());
        }
        while (whileOnGlobal.checked && regex.rx.global && a!=null && maxIterations-->0);
			}
		}
	},
  "#while-on-global": {
    oncontentready: function() {
      this.setState();
    },
    setState: function() {
      var wasDisabled = this.disabled;
      this.disabled = !regex.rx.global;
      if (wasDisabled && !this.disabled) this.checked = true;
    }
  },
	"#search": {
		disabled: false,
		onclick: function() {
      con.beforeRun();
			if (regexAvailable()) {
			  var val = string1.value;
        con.cmd(logString(val) + logMethod('search', logRegex()));
        con.log(logNumber(val.search(regex.rx)));
		  }
		}
	},
	"#replace": {
		disabled: false,
		onclick: function() {
      con.beforeRun();
			if (regexAvailable()) {
  		  var val1 = string1.value, val2 = string2.value;
			  con.cmd(logString(val1)+logMethod('replace', logRegex(), logString(val2)));
			  con.log(logString(val1.replace(regex.rx, val2)));
		  }
		}
	},
	"#split": {
		disabled: false,
		onclick: function() {
      con.beforeRun();
			if (regexAvailable()) {
  		  var val1 = string1.value, val2 = parseInt(string2.value, 10), a;
  		  if (isNaN(val2)) {
  		    con.cmd(logString(val1)+logMethod("split", logRegex()));
  		    a = val1.split(regex.rx);
  		  } else {
  		    con.cmd(logString(val1)+logMethod("split", logRegex(), logNumber(val2)));
  		    a = val1.split(regex.rx, val2);
		    }
		    if (a.length>0) forEach(a, function(item, i) {
				  con.log(logArrayItem(i, a[i]));
				});
				else con.log(spanClass("[]", "bracket"));
		  }
		}
	},
	"#match": {
		disabled: false,
		onclick: function() {
      con.beforeRun();
			if (regexAvailable()) {
  		  var val1 = string1.value, a;
        con.cmd(logString(val1)+logMethod("match", logRegex()));
        a = val1.match(regex.rx);
        if (a !== null) forEach(a, function(item, i) {
          con.log(logArrayItem(i, a[i]));
        });
        else con.log(logNull());
		  }
		}
	},
	"#clear-log": {
		disabled: false,
		onclick: function() { con.clear(); }
	},
  "#clear-log-on-run": {
		disabled: false
  },
	"#con": {
		disabled: false,
		spellcheck: false,
    clear: function() {
      this.innerHTML = '';
    },
    beforeRun: function() {
      if (clearLogOnRun.checked) {
        this.clear();
        refreshRx();
      }
    },
		log: function(message, cls) {
		  var li = document.createElement("LI");
		  li.innerHTML = message;
		  if (cls) li.className = cls;
		  this.appendChild(li).scrollIntoView();
		},
		info: function(message) {
		  this.log('<span class="icon">i</span> '+message, "info");
		},
		warn: function(message) {
		  this.log('<span class="icon">x</span> '+message, "warn");
		},
		cmd: function(message) {
		  this.log('<span class="cmd">&gt;&gt;&gt;</span> '+message);
		}
	}
});