var undefined;
///convert any object with a length-property to an array (string,arguments)
var $A = function(x) 
{
  var res=[]; 
  for(var i=0; i<x.length; i++) {
    res.push(typeof x=='string'?x.charAt(i):x[i]); 
  }
  return res; 
}
//
var item = function(list, i) 
{
  if(typeof list=="string") return i>list.length?undefined:list.charAt(i);
  else return list[i];  
}
///range(3)==[0,1,2]
///range(1,5)==[1,2,3,4]
///range(0,11,3)==[0,3,6,9]
///range(10,-11,-5)==[10,5,0,-5,-10]
///range(10,5)==[]
var range = function(/*[start,] end[, step]*/)
{
  var start, end, step, a=[];
  switch(arguments.length) {
    case 1: start=0;end=+arguments[0];step=1;break;
    case 2: start=+arguments[0];end=+arguments[1];step=1;break;
    case 3: start=+arguments[0];end=+arguments[1];step=+arguments[2];break;
    default: throw Error("Number of arguments incorrect");    
  }
  if(step==0) throw new Error("Step should be non-zero")
  if((start<end&&step>0)||(start>end&&step<0)) {
    for(var i=start; start<end?i<end:i>end; i+=step) {
      a.push(i);
    }
  }
  return a;
}
//Python reduce: 
var reduce = function(func, list/*[, initializer]*/)
{
  if(typeof list.length=="undefined") throw new TypeError(); //not array-like
  var len = list.length; //preserve
  if(typeof func != "function") throw new TypeError();

  var res = arguments[2];
  for (var i = 0; i < len; i++) {
    if(typeof res=='undefined') res=list[i]; //no initializer
    else res=func(res,item(list,i),i);
  }
  return res;
}
//Python map
var map = function(func, list/*[, list2...]*/)
{
  if(func==null) func=function() { return $A(arguments); }
  if(typeof func != "function") throw new TypeError();
  var a=[], len, i;
  if(arguments.length<2) throw Error("Not enough arguments");
  //determine biggest list length
  len=reduce(function(a,b){return b.length?Math.max(a,b.length):a;},arguments,0);
  for(i=0; i<len; i++) {
    var args=[];
    for(var j=1; j<arguments.length; j++) {
      args.push(item(arguments[j],i));
    }
    a.push(func.apply(this,args));
  }
  return a;
}
//Python filter
var filter = function(func,list)
{
  if(func==null) func=function(a){return a?true:false;}
  if(typeof func != "function") throw new TypeError();
  var a=[], len=list.length;
  for(var i=0; i<len; i++) {
    var itm=item(list,i)
    if(func(itm)) a.push(itm);
  }
  return a;
}