function IsFormValue(element) {
  return element&&/text|hidden|select-single|textarea/i.test(element.type);
}
function IsFormCheck(element) {
  return element&&/checkbox|radio/i.test(element.type);
}

function SetFormValue(id,val) {
	var x=$(id); 
	if(IsFormValue(x)) x.value=val;
	else if(IsFormCheck(x)) x.checked=val;
	else x.innerHTML=val;
}

function GetFormValue(x) {
  var val, y=$(x);
  if(typeof y==null) throw {toString:function(){return "Variable "+x+" is unknown"}};
  val=""+(IsFormValue(y)?y.value:IsFormCheck(y)?y.checked:y.innerHTML);
  //
  if(val=='') return 0;
  //integer
  if(/^(\+|-)?[0-9]+$/.test(val)) return parseInt(val,10);
  //float
  if(/^(\+|-)?[0-9]*\.[0-9]+(e(\+|-)?[0-9])?$/i.test(val)) return parseFloat(val);
  //boolean
  if(/^true|false$/i.test(val)) return val.toUpperCase()=='TRUE';
  //string
  return "'"+val+"'";
}
function dotdotrange(match,prefix,start,end) {
  var res=[];
  for(var i=Math.min(start,end); i<=Math.max(start,end); i++) res.push(prefix+i);
  return res.join(',');
}

function ConsoleAssertNumber(n,val,name) {
  if(isNaN(n)) console.error('Value %s is not a number',val);
}
//formula functions
var fns={
  //number functions
  sum: function() {
    return reduce(function(a,b){return a+b},arguments);
  },
  avg: function() {
    return reduce(function(a,b){return a+b},arguments)/arguments.length;
  },
  //boolean functions
  showhide: function(show/*, section1, ..., sectionN*/) {
    base2.forEach(arguments,function(item,i) {
      if(i>0) $(item).style.display=show?'block':'none';
    });
  }
};
var rx={
  ranges: /\b([tphs])([0-9]+)\.\.\1([0-9]+)/g,
  vars  : /\b([tcphs])([0-9]+)/g,
  funcs : /\b([a-z][a-z0-9_$]*)\(/gi
  
};
function resolveRanges(s) { return s.replace(rx.ranges, dotdotrange); }
function getVariables(s) {
  s=resolveRanges(s);
  var b,a=[];
  while(b=rx.vars.exec(s)) {
    a.push(b[0]);
  }
  return a;
}
function resolve(x) {
  try {
    if(resolve.parseDebug)console.group('Parsing formula: '+x);
    //replace ranges (t1..t3 -> t1,t2,t3)
    x=resolveRanges(x);
    if(resolve.parseDebug)console.info('step 1: '+x);
    //replace variables
    x=x.replace(rx.vars, function(item,prefix,nr) {
      if(prefix=='t'||prefix=='c') return $F(item);
      else return "'"+item+"'";
    });
    if(resolve.parseDebug)console.info('step 2: '+x);
    //replace functions
    var Funcs=fns;
    x=x.replace(rx.funcs, function(match,funcName) { return 'Funcs.'+funcName.toLowerCase()+'(' });
    if(resolve.parseDebug)console.info('step 3: '+x);
    //evaluate formula
    var result=eval(x);
    if(resolve.calcDebug)console.info("%s = %s",x,result);
    return result===undefined?"":result;
  }
  catch(ex) {
    return "#"+ex;
  }
  finally {
    console.groupEnd();
  }
}

//resolve.parseDebug=true;
//resolve.calcDebug =true;