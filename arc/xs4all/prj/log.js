//--| Logging |-----------------------------------------------------------------
var LogLevel={INFO:3,WARN:2,ERROR:1};
LogLevel.current=LogLevel.INFO;
function info(s) { if(LogLevel.current>=LogLevel.INFO) log("INFO: "+s); }
function warn(s) { if(LogLevel.current>=LogLevel.WARN) log("WARN: "+s); }
function error(s) { if(LogLevel.current>=LogLevel.ERROR) log("ERROR: "+s); }
function log(s) { if(window.console&&window.console.log) console.log(s);  }
//--| Get the name of the function (returns zero-length string, if not found, or anonymous.
function getFunctionName(s)
{
  var re=/function\s*([a-zA-Z$_]{0,1}[a-zA-Z0-9$_]*)\(/;
  if(typeof s!='string') s=s.toString();
  var a=s.match(re);
  if(a&&a[1]) return a[1];
  return '';
}