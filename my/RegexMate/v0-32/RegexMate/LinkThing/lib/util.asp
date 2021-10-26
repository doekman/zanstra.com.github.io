<%
var ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
String.prototype.format=function(o) {
  if(arguments.length==0) return this;
  var ret=this;
  if(typeof o=='object') {
    for(var i in o) {
      ret=ret.replace(new RegExp("\\{"+i+"\\}","g"),o[i]);
    }
  }
  else {
    for(var i=0; i<arguments.length; i++) {
      ret=ret.replace(new RegExp("\\{"+i+"\\}","g"),arguments[i]);
    }
  }
  return ret;
}
String.prototype.formatx=function(o) {
  if(arguments.length==0) return this;
  var ret=this;
  if(typeof o=='object') {
    for(var i in o) {
      ret=ret.replace(new RegExp("\\{"+i+"\\}","g"),HtmlEncode(o[i]));
    }
  }
  else {
    for(var i=0; i<arguments.length; i++) {
      ret=ret.replace(new RegExp("\\{"+i+"\\}","g"),HtmlEncode(arguments[i]));
    }
  }
  return ret;
}
function HtmlEncode(s) {
  return (''+s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
String.prototype.rPad=function(ch,len) {
  return this+(new Array(len-this.length+1).join(ch));
}
String.prototype.mPad=function(str2,ch,len) {
  return this+(new Array(len-str2.length-this.length+1).join(ch))+str2;
}
Number.prototype.rPad=function(len) {
  var n=""+this;
  return new Array(len-n.length+1).join('0')+n;
}
function DT(dt) {
  return new Date(Date.parse(dt));
}
Date.prototype.valueInDays=function() {
  return parseInt(new Date(this.getFullYear(),this.getMonth(),this.getDate()).valueOf()/(24*60*60*1000));
}
Date.prototype.format=function(fmt) {
  var self=this;
  var diff=new Date().valueInDays()-this.valueInDays();
  function d(t){ 
    var s='vandaag,gister,eergister'.split(',');
    if(s[diff]) {
      res=s[diff];
      if(t) res+=' om '+t
    }
    else {
      res=[self.getDate().rPad(2),(self.getMonth()+1).rPad(2),self.getFullYear()].join('-');
      if(t) res+=' '+t
    }
    return res;
  }
  function t(sec){ 
    var x=[self.getHours().rPad(2),self.getMinutes().rPad(2)];
    if(sec) s.push(self.getSeconds().rPad(2));
    return x.join(':');
  }
  switch(fmt) {
    case 'small': return diff==0 ? t() : d(); 
    case 't': return t();
    case 'ts': return t(true);
    case 'd': return d();
    case 'dt': return d(t());
    case 'dts': return d(t(true));
    default: return this.toString();
  }
}
/** html functions*/
function write(s) { Response.Write(s);}
function writeln(s) { write(s+'\r\n');}
function tag(name,text,attrs) {
  var attr='';
  if(arguments.length==3) {
    for(var a in attrs) {
      var val = attrs[a];
      attr+=' '+a;
      if(val!==null) attr+='="'+HtmlEncode(val)+'"';
    }
  }
  return "<{0}{2}>{1}</{0}>".format(name,text,attr);
}
function tago(name) { return "<{0}>".format(name);}
function tagc(name) { return "</{0}>".format(name);}
/** querystring functions*/     
function httpMethod() {
  return Request.ServerVariables("HTTP_METHOD").Item();
}
function frm(name, defaultValue) {
  if(arguments.length == 1) defaultValue=null;
  return Request.Form(name).Count>0
    ? Request.Form(name).Item()
    : defaultValue ;
}
function qs(name, defaultValue) {
  if(arguments.length == 1) defaultValue=null;
  return Request.QueryString(name).Count>0
    ? Request.QueryString(name).Item()
    : defaultValue ;
}
function qs_avail(name) {
  return Request.QueryString(name).Count>0;
}
function qs_one_avail() {
  for(var i=0; i<arguments.length; i++) {
    if(qs_avail(arguments[i])) return true;
  }
  return false;
}
function frm_req() {
  for(var i=0; i<arguments.length; i++) {
    if(Request.Form(arguments[i]).Count==0) {
      throw new Error("Form item [{0}] is mandatory".format(arguments[i]));
    }
  }
}
function qs_req() {
  for(var i=0; i<arguments.length; i++) {
    if(Request.QueryString(arguments[i]).Count==0) {
      throw new Error("QueryString [{0}] is mandatory".format(arguments[i]));
    }
  }
}
function qs_req_xor() {
  var name=null, a=[];
  for(var i=0; i<arguments.length; i++) {
    a.push(arguments[i]);
    if(Request.QueryString(arguments[i]).Count!=0) {
      if(name) {
        throw new Error("Only one of the QueryString\'s [{0}] and [{2}] are allowed, but both are given".format(name,arguments[i]));
      }
      else {
        name=arguments[i];
      }
    }
  }
  if(name==null) {
    throw new Error("Exactly one of the QueryString\'s [{0}] is mandatory, but none is given.".format(a.join(", ")));
  }
  return name;
}
function qs_num(s) {
  for(var i=0; i<arguments.length; i++) {
    var name=arguments[i];
    if(qs_avail(name)&&!/^\d*$/.test(qs(name))) {
      throw new Error("QueryString [{0}] should be a number, but is [{1}]".format(name,qs(name)));
    }
  }
  if(arguments.length==1&&qs_avail(s)) return +qs(s);
}
function qs_enum(s,values) {
  var value=(""+Request.QueryString(s).Item()).toLowerCase();
  if(value=='') return true;
  for(var i=0; i<values.length; i++)  {
    if(value==values[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}
function qs2obj(url) {
  var res = {};
  url = String(url);
  var pos = url.indexOf('?');
  if (pos!=-1) {
    var qs = url.substr(pos+1).split('&');
    for(var i=0; i<qs.length; i++) {
      var a=qs[i].split('=');
      var p = a[0];
      var val = decodeURIComponent(a[1]||'');
      if(p in res) {
        if(typeof res[p] != 'object') res[p]=[res[p], val];
        else res[p].push(val);
      }
      else res[p] = val;
    }
  }
  return res;
}
function forEach(o, f) {
  if(typeof o=='object') {
    if(o===null) return;
    if('length' in o) Array_forEach(o, f);
    else Object_forEach(o,f);
    return;
  }
  throw new Error("Unknown type passed to forEach");
}
function Array_forEach(array, f) {
  for(var i=0; i<array.length; i++) {
    if(i in array) f(array[i], i, array);
  }
}
function Object_forEach(object, f) {
  for(var i in object) {
    if(object.hasOwnProperty(i)) f(object[i], i, object);
  }
}

function GetBodyText(charset)
{
	if(Request.TotalBytes<=0) return '';
	else return BinaryToString(Request.BinaryRead( Request.TotalBytes ),charset);
}

function BinaryToString(Binary, CharSet)
{
  var adTypeText = 2
  var adTypeBinary = 1
  
  //Create Stream object
  var BinaryStream = Server.CreateObject('ADODB.Stream');
  
  //Specify stream type - we want To save text/string data.
  BinaryStream.Type = adTypeBinary
  
  //Open the stream And write text/string data To the object
  BinaryStream.Open();
  BinaryStream.Write(Binary);
  
  
  //Change stream type To binary
  BinaryStream.Position = 0;
  BinaryStream.Type = adTypeText;
  
  //Specify charset For the source text (unicode) data.
  BinaryStream.CharSet = CharSet?CharSet:'us-ascii';
  
  //Open the stream And get binary data from the object
  var res=BinaryStream.ReadText();
  BinaryStream.Close();
  return res;
}
%>
<script runat="server" language="vbscript">
Function Niets()
  Set Niets=Nothing
End Function
</script>