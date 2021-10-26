/*
 * Create a stack-trace for debugging purposes
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/callerStack.htm for more info.
 */
function callerStack()
{
  var oCaller = callerStack.caller;
  var sMsg='Caller stack:';
  while(oCaller)
  {
    var sCaller=getFunctionName( oCaller ); 
    sMsg+='\n- '+sCaller+'('+args2string( oCaller.arguments )+')';
    oCaller = oCaller.caller;
  }
  return sMsg;
}
//--| Get function arguments as a nice text-string
function args2string(args) 
{
  var s='';
  for(var i=0; i<args.length; i++)
  {
    var arg=args[i];
    if(arg==null)  s+='null'
    else if(typeof arg=='string') s+="'"+arg.replace(/\'/g,'\\\'').replace(/\n/g,'\\n')+"'";
    else s+=arg.toString();
    //--| Add comma in between  
    if(i<args.length-1) s+=',';
  }
  return s;
}
//--| Get the name of the function (returns zero-length string, if not found, or anonymous.
function getFunctionName(s)
{
  var re=/function\s*([a-zA-Z$_]{0,1}[a-zA-Z0-9$_]*)\(/;
  if(typeof s!='string') s=s.toString();
  var a=s.match(re);
  if(a&&a[1]) return a[1];
  return '';
}