//--| Enum
var LogLevel=
{ ALL:6
, DEBUG:5
, INFO:4
, WARN:3
, ERROR:2
, FATAL:1
, OFF:0
, toString:function(level) {
    for(var i in this) 
      if(this[i]==level) 
        return ""+i; 
    return ""+level;
  }
};
//--| Log manager
var LogManager=
{ GetLogger:function(name) {
    return new Logger(name);
  }
};
//--| Logging object
function Logger(name) {
  this.name=name;
  this.appenders=[];
  this._ReadConfig();
}
Logger.prototype=
{ Debug:function() { this._DoLog(LogLevel.DEBUG,arguments); }
, Info:function() { this._DoLog(LogLevel.INFO,arguments); }
, Warn:function() { this._DoLog(LogLevel.WARN,arguments); }
, Error:function() { this._DoLog(LogLevel.ERROR,arguments); }
, Fatal:function() { this._DoLog(LogLevel.FATAL,arguments); }
, _DoLog:function(level,argv) {
    if(level>this.logLevel) return;
    //perform optional format
    var firstArg=0;
    var s=argv[firstArg++];
    for(var i=firstArg; i<argv.length; i++) {
      s=s.replace(new RegExp("\\{"+(i-firstArg)+"\\}","g"),argv[i]);
    }
    for(i=0; i<this.appenders.length; i++) {
      this.appenders[i].DoLog(level,s);
    }
  }
, _ReadConfig:function() {
    if(LogConfig&&LogConfig[this.name]) {
      var entry=LogConfig[this.name];
      this.logLevel=entry.logLevel || LogLevel.ALL;
      if(!entry.appender) {
        var autos=[SafariConsoleAppender];
        for(var i=0; i<autos.length; i++) {
          var o=autos[i];
          if(o.IsSupported) this.appenders.push(new o);
        }
      }
    }
    else {
      this.logLevel=LogLevel.ALL;
    }
  }
}
//--| SafariAppender
function SafariConsoleAppender() {
}
SafariConsoleAppender.IsSupported=window.console&&window.console.log;
SafariConsoleAppender.prototype.DoLog=function(level,msg) {
  if(SafariConsoleAppender.IsSupported) {
    window.console.log(LogLevel.toString(level)+": "+msg);
  }
}
