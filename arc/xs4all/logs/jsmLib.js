/*
 * A collection of methods for javascipts standard objects.
 * Copyright (C) Doeke Zanstra 2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/logs/jsmLib.htm for more info.
 *
 * NOTICE: do not change this code here, as it is generated.
 */
		

//--| Object: Array |-------------------------------------------
		
if(!Array.pop) Array.prototype.pop=function()
{
  var o=this[this.length-1];
  this.length--;
  return o;
}
if(!Array.push) Array.prototype.push=function()
{
  for(var i=0;i!=arguments.length;i++)
  {
    this[this.length]=arguments[i];
  }
  return this.length;
}
Array.prototype.rndItem=function Array_rndItem() 
{ 
	return this[parseInt(Math.random()*this.length,10)];
}

//--| Object: Number |-------------------------------------------
		
if(!Number.prototype.toFixed) {
  Number.prototype.toFixed=function(n) {
    if(!n) n=0;
    var i=parseInt(this);
    var d=(''+Math.round((this-i)*Math.pow(10,n))).LPad(2,'0');
    return i+'.'+d;
  }
}

//--| Object: String |-------------------------------------------
		
String.prototype.ltrim=function String_ltrim() 
{  
	return this.replace(/^[ \t\r\n]+/g,'');
}
String.prototype.multi=function(number,seperator)
//--#An extended version of VB's String function
//--@number;type=number@String multiply factor. Should be positive
//--@seperator;type=string;optional@optional seperator, handy for lists
{
  var a=[];
  number=Math.abs(parseInt(number,10));
  if(isNaN(number)) throw new Error('String.multi: number parameter should be an number');
  while(number-->0)
  {
    a.push(this);
  }
  return a.join(seperator||'');
}
String.prototype.rtrim=function String_rtrim() 
{  
	return this.replace(/[ \t\r\n]+$/g,'');
}
String.prototype.LPad=function(n,s) {
  if(n&lt;0) return;
  if(typeof s=='undefined') s=' ';
  var res=this;
  while(res.length&lt;n) res=s+res;
  return res;
}
String.prototype.trim=function String_trim() 
{  
	return this.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g,'');
}