<%@language=javascript%>
<!--#include file="../js/toLiteral.js.asp"-->
<html>
  <head>
    <style type="text/css">
li.info    { color: gray }
li.fail    { color: #FF9900; }
li.fatal   { color: red; }
li.subtotal{ color: green; }
li.total   { color: green; font-weight: bold; }
    </style>
<%
/*-- dz-unit-test library ---------------------------------------------------*/
var dzTst={ok:0,fail:0,cases:{}};
function dzTestRun() {
  var prev={ok:0,fail:0};
  dzTst.ok=dzTst.fail=0;
  for(var i in dzTst.cases) {
    try {
      if(Object_hasOwnProperty(dzTst.cases,i)&&typeof dzTst.cases[i]=='function') {
        dzTst.cases[i]();
        addMsg('Sub-total for ['+i+']: '+(dzTst.ok-prev.ok)+' OK and '+(dzTst.fail-prev.fail)+' failed','subtotal');
        prev.ok=dzTst.ok; prev.fail=dzTst.fail;
      }
    }
    catch(ex) {
      addMsg('Exception when running test-case ['+i+']: '+ex.message,'fatal');
    }
  }
  addMsg('Total: '+dzTst.ok+' OK and '+dzTst.fail+' failed','total');
}
function addMsg(s,cls) {
  Response.Write('<li class="'+cls+'">'+s+"</li>\n");
}
function assert(msg,test) {
  if(typeof test=='undefined') {
    try {
      test=eval(msg)
    } catch(ex) {
      addMsg('Exception: '+msg+' ('+ex.message+')','fatal');
    }
  }
  if(test) dzTst.ok++;
  else dzTst.fail++, addMsg(msg,'fail');
}
function assertArrayEquals(msg,a,b) {
  assert('assertArrayEquals.length: '+msg,a.length==b.length);
  for(var i=0; i<a.length; i++)
    assert('assertEquals:'+msg,a[i]==b[i]);
}
function assertToLiteral(a) {
  a=''+a;
  try { var b=eval(a); } catch(ex) { addMsg('Exception eval(a): '+ex.message); return; }
  try { var c=ToLiteral(b); } catch(ex) { addMsg('Exception ToLiteral(b): '+ex.message); return; }
  try { eval("var d="+c); } catch(ex) { addMsg('Exception eval(c): '+ex.message); return; }
  try { assert('String: '+a, a==c); } catch(ex) { addMsg('Exception assert a: '+ex.message,'fatal'); return; }
  try { assert('Value: '+a,b==d); } catch(ex) { addMsg('Exception assert b: '+ex.message,'fatal'); }
}
function assertToLiteralString(b) {
  try { var c=ToLiteral(b); } catch(ex) { addMsg('Exception ToLiteral(b): '+ex.message); return; }
  try { eval("var d="+c); } catch(ex) { addMsg('Exception eval(c): '+ex.message); return; }
  try { assert('Value: '+b,b==d); } catch(ex) { addMsg('Exception assert b: '+ex.message,'fatal'); }
}
/*-- dz-unit-test library ---------------------------------------------------*/
dzTst.cases.testStrings=function() {
  assertToLiteralString("Doeke's auto");
  assertToLiteralString("Doeke's broer zei: \"Ik ga\"");
  assertToLiteralString("Line 1\nLine 2");
  assertToLiteralString("Line 1\rLine 2");
  assertToLiteralString("Line 1\r\nLine 2");
  assertToLiteralString("Column 1\tColumn 2\tColumn3");
}
dzTst.cases.testNumbers=function() {
  assertToLiteral(0);
  assertToLiteral(12345);
  assertToLiteral(0xABCDEF);
  assertToLiteral(12.34e56);
  assertToLiteral(-2.345e-67);
  assertToLiteral("Number.MIN_VALUE");
  assertToLiteral("Number.MIN_VALUE");
  assertToLiteral("Number.NEGATIVE_INFINITY");
  assertToLiteral("Number.POSITIVE_INFINITY");
  var n=parseInt('a');
  assert('Testing NaN',ToLiteral(n)=='Number.NaN');
  assert('Testing NaN',isNaN(eval(ToLiteral(n))));
}
dzTst.cases.testBoolean=function() {
  assertToLiteral('true');
  assertToLiteral('false');
}
dzTst.cases.testNull=function() {
  assertToLiteral('null');
}
dzTst.cases.testUndefined=function() {
  assertToLiteral('void 0');
  var UNDEF;
  assert('Undefined test',eval(ToLiteral(UNDEF))==UNDEF);
}
dzTst.cases.testArray=function() {
  var a=[1,12345,12e12,'Doeke\'s',true,false,null,void 0];
  var b=ToLiteral(a);
  addMsg('var a='+b,'info');
  eval("var c="+b);
  assertArrayEquals('Test array',a,c);
}
dzTst.cases.testObject=function() {
  var x=
  { numberDing:12
  , stringDing:'Zooi'
  , boolDing:true
  , decimalDing:12.34
  , dateDing:new Date(1972,11-1,14)
  , dateTimeDing1:new Date(1972,11-1,14,1,2,30,400)
  , dateTimeDing2:new Date(1972,11-1,14,1,2,30)
  , dateTimeDing3:new Date(1972,11-1,14,1,2)
  , dateTimeDing4:new Date(1972,11-1,14,1)
  , arrayDing:[1,2,3]
  , objectDing:{naam:'Doeke Zanstra',email:'doeke@zanstra.net'}
  , $dollarProperty:'should work'
  , _underscoreProperty:'should work as well'
  , '1234property':'must be quoted'
  };
  var y=ToLiteral(x);
  addMsg('var x='+y,'info');
  eval('var z='+y);
  var i='numberDing'; assert(''+i,x[i]==z[i]);
  i='stringDing'; assert(''+i,x[i]==z[i]);
  i='boolDing'; assert(''+i,x[i]==z[i]);
  i='decimalDing'; assert(''+i,x[i]==z[i]);
  i='dateDing'; assert(''+i,x[i].valueOf()==z[i].valueOf());
  i='dateTimeDing1'; assert(''+i,x[i].valueOf()==z[i].valueOf());
  i='dateTimeDing2'; assert(''+i,x[i].valueOf()==z[i].valueOf());
  i='dateTimeDing3'; assert(''+i,x[i].valueOf()==z[i].valueOf());
  i='dateTimeDing4'; assert(''+i,x[i].valueOf()==z[i].valueOf());
  i='arrayDing.length'; assert(''+i,x[i]==z[i]);
  i='arrayDing.0'; assert(''+i,x[i]==z[i]);
  i='arrayDing.1'; assert(''+i,x[i]==z[i]);
  i='arrayDing.2'; assert(''+i,x[i]==z[i]);
  i='objectDing.name'; assert(''+i,x[i]==z[i]);
  i='objectDing.email'; assert(''+i,x[i]==z[i]);
  i='$dollarProperty'; assert(''+i,x[i]==z[i]);
  i='_underscoreProperty'; assert(''+i,x[i]==z[i]);
  i='1234property'; assert(''+i,x[i]==z[i]);
}
/*
dzTst.cases.testOuterFrame=function() {
  var s=/(\?|&)n=([^&]*)(&|$)/i.exec(location.search);
  var x=parent[s[2]];
  if(x==null) {
    addMsg('Skipping inter-frame test, because no parent frame is available','info');
    return;
  }
  var y=ToLiteral(x);
  addMsg('var '+s[2]+'='+y,'info');
  eval('var z='+y);
  var i='numberDing'; assert(''+i,x[i]==z[i]);
  i='stringDing'; assert(''+i,x[i]==z[i]);
  i='boolDing'; assert(''+i,x[i]==z[i]);
  i='decimalDing'; assert(''+i,x[i]==z[i]);
  i='dateDing'; assert(''+i,x[i].valueOf()==z[i].valueOf());
  i='arrayDing.length'; assert(''+i,x[i]==z[i]);
  i='arrayDing.0'; assert(''+i,x[i]==z[i]);
  i='arrayDing.1'; assert(''+i,x[i]==z[i]);
  i='arrayDing.2'; assert(''+i,x[i]==z[i]);
  i='objectDing.name'; assert(''+i,x[i]==z[i]);
  i='objectDing.email'; assert(''+i,x[i]==z[i]);
}
*/
%>
  </head>
  <body>
    <ul id="log">
<%dzTestRun()%>
    </ul>
  </body>
</html>