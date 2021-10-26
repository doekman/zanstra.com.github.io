<%
/*
 * Translates in-memory javascript variables to text which presents javascript code.
 * Work's both client-side (in most browsers) and server-side with MS ASP
 * Version 1.2
 * Copyright (C) Doeke Zanstra 2001-2006
 * Distributed under the BSD License
 *
 * See http://www.xs4all.nl/~zanstra/dzLib/toLiteral.htm for more info.
 *
 * Version History:
 * v1.5: bug-fixes (2006-07-22):
 *   Fixed a bug with date-object
 *   Changed version number in code (forgot this for version 1.4)
 * v1.4: bug-fixes (2006-06-28):
 *   Fixed a bug in hasOwnProperty-handler (replaced x==null by typeof x=='undefined')
 * v1.3: bug-fixes (2006-04-13):
 *   Fixed bug in IE5 with propertie-names of an object starting with a number (/^[a-z$_][a-z0-9$_]*$/i)
 * v1.2: bug-fixes:
 *   Fixed other inter-frame bugs (Function_getName) 
 *   Added hasOwnProperty compatibility for Safari 2.0.1 and lower
 *   Added some jsdoc comments
 * v1.1: bug-fixes:
 *   Fixed bug with boundary values of Number.
 *   Fixed bug with properties of an object with not-normal ([^a-zA-Z0-9_$]) characters in property names.
 *   Reworked library to work with functions as well as methods (so you don't get problems with inter-window calls).
 * v1.0: initial (rewritten from toSource.js for performance), 2005-06-07
 */

var ToLiteralConfig={version:1.5,QuoteChar:"'"};

/**
 * Returns any javascript type as a javascript string (literal)
 * @returns Javascript code as a string
 * @tag lib-toLiteral
 */	
function ToLiteral(v) {
  switch(ToLiteralType(v)) {
    case 'undefined':return 'void 0';
    case 'null':     return 'null';
    case 'string':   return String_toLiteral(v);
    case 'number':   return Number_toLiteral(v);
    case 'boolean':  return Boolean_toLiteral(v);
    case 'Array':    return Array_toLiteral(v);
    case 'Date':     return Date_toLiteral(v);
    case 'RegExp':   return RegExp_toLiteral(v);
    case 'Function': return Function_toLiteral(v);
    default:         return Object_toLiteral(v);
  }
}
/**
 * Interal function to determine if a type within an object or array needs to be skipped
 * @param value of variable
 * @returns {boolean}
 * @private
 * @tag lib-toLiteral
 */	
function ToLiteralSkip(v) {
  switch(ToLiteralType(v)) {
    case 'RegExp':     
    case 'Function':
      return true;
    default:           
      return false;
  }
}
/**
 * Determines the type of the variable for library purposes
 * @param value of variable
 * @returns {boolean}
 * @private
 * @tag lib-toLiteral
 */	
function ToLiteralType(v) {
  var type=typeof v;
  if(v===null) type='null';
  else if(type=='object') type=Function_getName(v.constructor);
  if(type===null) type='Object';
  return type;
}
/*
String.prototype.toLiteral  =function() { return String_toLiteral(this) };
Number.prototype.toLiteral  =function() { return Number_toLiteral(this) };
Boolean.prototype.toLiteral =function() { return Boolean_toLiteral(this) };
Object.prototype.toLiteral  =function() { return Object_toLiteral(this) };
Array.prototype.toLiteral   =function() { return Array_toLiteral(this) };
Date.prototype.toLiteral    =function() { return Date_toLiteral(this) };
RegExp.prototype.toLiteral  =function() { return RegExp_toLiteral(this) };
Function.prototype.toLiteral=function() { return Function_toLiteral(this) };
Function.prototype.getName  =function() { return Function_getName(this) };
if(!Object.hasOwnProperty)
  Object.prototype.hasOwnProperty=function(p) { return Object_hasOwnProperty(this,p) }
*/
/**
 * This method is not supported on all browsers (Safari 2.0.1 and lower)
 * @param o {object} the object
 * @param p {string} name of property
 * @returns {boolean} true, if property is not in prototype
 * @tag compatibility
 */	
function Object_hasOwnProperty(o,p) {
  return typeof o[p]!='undefined'&&typeof o.constructor.prototype[p]=='undefined';
}

function String_toLiteral(s) {
  return ToLiteralConfig.QuoteChar+s.replace(/\\/g,'\\\\').replace(/\'/g,"\\'").replace(/\"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t')+ToLiteralConfig.QuoteChar;
}
function Number_toLiteral(n) {
  if(isNaN(n)) return 'Number.NaN';
  if(n==Number.MIN_VALUE) return 'Number.MIN_VALUE';
  if(n==Number.MAX_VALUE) return 'Number.MAX_VALUE';
  if(n==Number.NEGATIVE_INFINITY) return 'Number.NEGATIVE_INFINITY';
  if(n==Number.POSITIVE_INFINITY) return 'Number.POSITIVE_INFINITY';
  return ''+n;
}
function Boolean_toLiteral(b) {
  return b==true?'true':'false';
}
function Object_toLiteral(o) {
  var a=[], prop=function(s) {
    if(Object_toLiteral.reservedWord [s]||!/^[a-z$_][a-z0-9$_]*$/i.test(s)) {
      return String_toLiteral(s);
    }
    return s;
  }
  for(var i in o) {
    var v=o[i];
    if(Object_hasOwnProperty(o,i)&&!ToLiteralSkip(v)) {
      a[a.length]=prop(''+i)+':'+ToLiteral(v);
    }
  }
  return '{'+a.join(',')+'}';
}
Object_toLiteral.reservedWord={'abstract':1,'boolean':1,'break':1,'byte':1,'case':1,'catch':1,'char':1,'class':1,'const':1,'continue':1,'debugger':1,'default':1,'delete':1,'do':1,'double':1,'else':1,'enum':1,'export':1,'extends':1,'final':1,'finally':1,'float':1,'for':1,'function':1,'goto':1,'if':1,'implements':1,'import':1,'in':1,'instanceof':1,'int':1,'interface':1,'long':1,'native':1,'new':1,'package':1,'private':1,'protected':1,'public':1,'return':1,'short':1,'static':1,'super':1,'switch':1,'synchronized':1,'this':1,'throw':1,'throws':1,'transient':1,'try':1,'typeof':1,'var':1,'void':1,'volatile':1,'while':1,'with':1};
function Array_toLiteral(o) {
  var a=[];
  for(var i=0; i<o.length; i++) {
    a[i]=ToLiteral(o[i]);
  }
  return '['+a.join(',')+']';
}
function Date_toLiteral(d) {
  var a=[d.getFullYear(),(d.getMonth()+1)+'-1',d.getDate()];
  if(d.getHours()!=0||d.getMinutes()!=0||d.getSeconds()!=0||d.getMilliseconds()!=0) {
    a[a.length]="/*T*/"+d.getHours();
    a[a.length]=d.getMinutes();
    if(d.getSeconds()!=0||d.getMilliseconds()!=0) {
      a[a.length]=d.getSeconds();
      if(d.getMilliseconds()!=0) a[a.length]=d.getMilliseconds();
    }
  }
  return 'new Date('+a.join(',')+')';
}
function RegExp_toLiteral(o) {
  return ''+o;
}
function Function_toLiteral(o) {
  return '/*Function not supported by toLiteral*/ null';
}
/**
 * Returns the name of the function. Used to determine the constructor of a object (Function_getName(new Date().constructor)=='Date')
 * @param {Function} The function 
 * @returns {string} The name of the function (or null when anonymous or otherwise not determinable)
 * @tag lib-toLiteral
 */	
function Function_getName(o) {
  var a=o.toString().match(/function\s*([a-zA-Z$_][a-zA-Z0-9$_]*)?\(/);
  if(a&&typeof a[1]=='string'&&a[1]!='') return a[1];
  //Method inspection for Safari (with inter-frame javascript the following problems occur:
  //  (Date.constructor!=parent.Date.constructor)
  //  (new Date() instanceOf parent.Date==false)
  //and Safari returns the string "(Internal Function)" for all internal functions :-(
  if(o.prototype.toGMTString) return 'Date'; 
  if(o.prototype.splice) return 'Array';
  if(o.prototype.compile) return 'RegExp';
  if(o.prototype.arguments) return 'Function';
  return null; //anonymous function
}
//__| toLiteral |_______________________________________________________________
%>