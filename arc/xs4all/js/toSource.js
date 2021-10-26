/*
 * Translates in-memory javascript variables to text which presents javascript code.
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/toSource.htm for more info.
 */

/*
Version History:
1.07 19 okt  2002 -Property-names are only supplied as strings if they contain difficult characters.
1.06 16 okt  2002 -Unknown constructor are treated like an normal Object
1.05 11 juni 2002 -Undefined properties worden niet meer weggeschreven
1.04 11 juni 2002 -Now works correct with an empty array's (zanst001)
                   Can't use global variables, in combination with <script runat=server.
                  -So all "NewLine" var's replaced with "\n" and "TAB" var's replaced with "2" 
1.03  9 juni 2002 -Now works correct with an empty object (zanst001)
1.02  8 juni 2002 -Case 'object': if(v==null) added (zanst001)
*/

function toSource(v)
{
  return toJsText(v,0-2,2);
}

function js2txt(varName,varRef)
{
  return 'var '+varName+'='+toJsText(varRef,0-2,2)+';';
}

//Description: This function returns a string representing the variable <v>
//inType, specifies in which container the var exists: 0: normal, 1:array, 2:object

//Todo: type "unknown"
//      object instances of intrinsic types (object, number, boolean etc.)
function toJsText(v,indent,inType)
{
	if(typeof indent=='undefined') indent=0;
	if(typeof inType=='undefined') inType=0;

	switch(typeof v)
	{
		case 'string':		return toStringConstructor(v);
		case 'number':		if(isNaN(v)) return 'Number.NaN'; //Can't switch on case Number.NaN
											switch(v)
											{
												case Number.MIN_VALUE:					return 'Number.MIN_VALUE';
												case Number.MAX_VALUE:					return 'Number.MIN_VALUE';
												case Number.NEGATIVE_INFINITY:	return 'Number.NEGATIVE_INFINITY';
												case Number.POSITIVE_INFINITY:	return 'Number.POSITIVE_INFINITY';
												default:												return String(v);
											}
		case 'boolean':		return (v?'true':'false');
		case 'null':			return 'null';
		case 'undefined':	return 'undefined';
    case 'function':  return v.toString();
		case 'object':    if(v==null) return 'null'; //moet
                      try
                      {
                          var c=getFunctionName(v.constructor);
											}
                      catch(exception)
                      {
                         c='Object' ;
                      }
                      if(c==null) //unknown constructor
											{
												return toStringConstructor(v);
											}
											//Switch constructor
											switch(c)
											{
												case 'Array':
													indent+=2;
                          var t=doIndent('[',indent,inType==1);
													for(var i=0; i<v.length; i++)
                          {
                            if(typeof v[i]!='undefined')
  														t+=toJsText(v[i],indent,1)+doIndent(',',indent,false);
                          }
                          if(t.lastIndexOf(',')==-1)
                          {
                            //empty array
                            t+=']';
                          }
                          else
                          {
                            //get rid of the last comma
                            t=t.replace(/, *$/,']'); 
                          }
													return t;

												case 'Date':
													return toDateConstructor(v);

												case 'RegExp':
													return String(v);

                        case 'Unknown':
                        case 'unknown':
                          throw 'Can\'t toSource COM elements';
                          break;

												case 'Object': 
                        default:
													indent+=2;
													var t=doIndent('{',indent,inType==1);
													for(var i in v)
                          {
                            if(typeof v[i]!='undefined')
  														t+=toProperty(i)+toJsText(v[i],indent,2)+doIndent(',',indent,false);
                          }
                          if(t.lastIndexOf(',')==-1)
                          {
                            //empty object
                            t+='}';
                          }
                          else
                          {
                            //get rid of the last comma
                            t=t.replace(/, *$/,'}'); 
                          }
													return t; 

											}
											break;
		default:
			throw 'Unknown type: "'+typeof v+'"';
	}
	return t;
}

//Description: returns <n> spaces (ascii 32)
function spaces(n)
{
	var s='';
	while(s.length<n) s+=' ';
	return s;
}

//Description: Indents string <s> to indent size <indent> and with tabsize <TAB>
function doIndent(s,indent,bln)
{
  switch(bln) //true==first line within array
  {
    //case 0: return spaces(indent)+s+spaces(TAB-s.length);
    case true: return s+spaces(2-s.length);
    case false: return '\n'+spaces(indent)+s+spaces(2-s.length);
  }
}

//Description: writes property (length:). If there are difficult characters, 
function toProperty(s)
{
  var re=/^[a-z0-9$_]+$/i;
  s=''+s;
  if(re.test(s)) return s+':';
  else return toStringConstructor(s)+':';
}


//Description: Formats a date-value to a human- and computer-readable format
function toDateConstructor(dt)
{
	var h=dt.getHours();
	var M=dt.getMinutes();
	var s=dt.getSeconds();
	var m=dt.getMilliseconds();
	var res='new Date('+dt.getFullYear()+','+(dt.getMonth()+1)+'-1,'+dt.getDate();
	if(h>0||M>0||s>0||m>0) 
	{	
		res+=','+h;
		if(M>0||s>0||m>0) 
		{
			res+=','+M;
			if(s>0||m>0) 
			{
				res+=','+s;
				if(m>0) 
				{
					res+=','+m;
				}
			}
		}
	}
	return res+')';
}

function toStringConstructor(s)
{
	var sRet='', i=0;
	s=String(s);
	while(i<s.length)
	{
		var ch=s.substr(i,1);
		switch(ch)
		{
			case '\'': //single quote
				sRet+='\\\'';
				break;
			case '\"': //double quote
				sRet+='\\\"';
				break;
			case '\n': //new line
				sRet+='\\n';
				break;
			case '\r': //carriage return
				sRet+='\\r';
				break;
			case '\t': //TAB
				sRet+='\\t';
				break;
			case '\\': //backslash
				sRet+='\\\\';
				break;
			default:	
				sRet+=ch;
				break;
		}
		i++;
	}
	return '\''+sRet+'\'';
}

function getFunctionName(s)
{
  var a;
  s=new String(s);
  if(s=='unknown') return s;

	a=s.match(/function ([a-z0-9_]+)/i);

	if(a==null||a.length==null||a.length<1) return null;
	else return a[1];
}