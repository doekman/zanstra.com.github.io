/*
 * Experiment on querystring and the interface-concept.
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/qs.htm for more info.
 */

/*
**Ultimate Search Connector*************************************************************************
Definition:
-Parameter: an element from the search string, in an untyped/not-processed context
-CallDefinition: comparable to a function-call in an strong-typed language (ie C#)
-Argument: an quasi-strong typed argument (quasi, because javascript works with variants)
-Interface: all (named) CallDefinition together for one page
*/

/*
Preferences parameters:
-sCallDefIdentifier:  If more than one call-definition is supplied, use this argument to determine
                      which call-definition to use (?call=callDefName&...). if no identification of
                      call-definition is supplied, the first call-definition is assumed.
-bArrayDefault:       With an untyped querystring (create object without a call-definition)
                      all parameters are treated as strings. With the two following parameters you 
                      can specify if it should be an array of Strings, or an seperated String list. 
-sListSeperator:      Specifies the list-seperator is bArrayDefault is specified at false.
*/
var oPreferences = 
{ sCallDefIdentifier:'call'
, bArrayDefault:false
, sListSeperator:','
}

//-------------------------------------------------------------------------------------------------
//--| Interface-class |----------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

/*
Arguments:
-0 (zero) or more objects, of type CallDefinition
Remarks:
-If multiple call-definition objects are supplied, but no call-definition identifier is passed,
 the first call-definition is used.
*/
/*constructor*/ function Interface()
{
/*methods*/
  this.processParam=Interface_processParam;
  this.processUnTyped=Interface_processUnTyped;
  this.processTyped=Interface_processTyped;
  this.err=Interface_err;
/*properties*/
  this.oArg=new Object();
  this.aErr=new Array();
  this.bValid=true; 
  this.oCallDefs=new Object();
  this.aCallDefs=new Array(); 
  this.bTyped=arguments.length>=1;
//--| process CallDefinitions
  for(var i=0; i<arguments.length; i++)
  {
    this.oCallDefs[arguments[i].sName]=this.aCallDefs[this.aCallDefs.length]=arguments[i];
  }
//--| import the search-string
  this.processParam(location.search);
//--| process the data
  if(this.aCallDefs.length==0)
  {
    this.processUnTyped();
  }
  else
  {
    this.processTyped();
  }
/*clean up the mess*/
  delete this.aParam; //created by processParam()
/*return the just created object*/
  return this;
}

//--| Description: processes the 
/*private*/ function Interface_processParam(s)
{
  if(s.indexOf('=')!=-1)
  {
    //substr(1) skips the question-mark
    this.aParam=s.substr(1).split('&');
    for(var i=0; i<this.aParam.length; i++)
    {
      var t=this.aParam[i]; //the name/value string (example: "name=Doeke%20Zanstra")
      var j=t.indexOf('=');
      var a=new Array();
      a[0]=unescape(t.substring(0,j));
      a[1]=unescape(t.substr(j+1));
      this.aParam[i]=a;
    }
  }
  else
  {
    //no parameters
    this.aParam=new Array();
  }
}

/*private*/ function Interface_processUnTyped()
{
  for(var i=0; i<this.aParam.length; i++)
  {
    var name=this.aParam[i][0];
    var value=this.aParam[i][1];

    if(typeof this.oArg[name]=='undefined')
    {
      if(oPreferences.bArrayDefault)
      {
        this.oArg[name]=[value]; //create new array, with one element
      }
      else
      {
        this.oArg[name]=value;
      }
    }
    else
    {
      if(oPreferences.bArrayDefault)
      {
        this.oArg[name][this.oArg[name].length]=value; //push the n-th element on the array
      }
      else
      {
        this.oArg[name]+=oPreferences.sListSeperator+value;
      }
    }
  }
}

/*private*/ function Interface_processTyped()
{
  var oCallDef;
//--| Determine which call interface to use (and get a reference to that definition)
  if(this.aCallDefs.length==1)
  {
    oCallDef=this.aCallDefs[0];
  }
  else
  {
    //--| more than one 
    for(var i=0; i<this.aParam.length; i++)
    {
      if(this.aParam[i][0]==oPreferences.sCallDefIdentifier)
      {
        var sCallDefID=this.aParam[i][1];
        if(this.oCallDefs[sCallDefID]==null)
        {
          this.err('4,fatal,Unknown call-definition identifier found: "'+this.aParam[i].join('=')+'"');
          return;
        }
        oCallDef=this.oCallDefs[sCallDefID];
        break;
      }
    }
    if(oCallDef==null)
    {
      //--| No call-defintion hint found, use first call-definition
      oCallDef=this.aCallDefs[0];
    }
  }

//--| Process the untyped search (aParam) to a typed one (oArg)
  for(var i=0; i<this.aParam.length; i++)
  {
    var name=this.aParam[i][0];
    var value=this.aParam[i][1];
    
    if(name==oPreferences.sCallDefIdentifier) continue; //don't proces call identifier

    //check if argument is a defined argument
    if(oCallDef.oArgDefs[name]==null)
    {
      this.err('1,Error,Argument "'+name+'" is not defined within CallDefinition "'+oCallDef.sName+'"');
      continue; //skip processing this parameter
    }
    else
    {
      var oArgDef=oCallDef.oArgDefs[name];
      //convert value to typed value
      switch(oArgDef.sType)
      {
        case 'string':
          break; //no conversion necessary
        case 'int':
          value=parseInt(value,10);
          if(isNaN(value))  value=null;
          break;

        case 'float':
          value=parseFloat(value);
          if(isNaN(value))  value=null;
          break;

        case 'boolean':
          if(value=='true') value=true;
          else if(value=='false') value=false;
          else value=null;
          break;

        case 'date': //nl-date
          value=str2nlDate(value);
          break;
        case 'enum':
          var nEnumPos;
          for(nEnumPos=0; nEnumPos<oArgDef.aEnumValues.length; nEnumPos++)
          {
            if(value==oArgDef.aEnumValues[nEnumPos]) 
            {
              break;
            }
          }
          if(nEnumPos>=oArgDef.aEnumValues.length)
          {
            //--| Value is not defined in enum-array
            value=null;
          }
          break;
        default:
          value=null;
          break;
      }
      //add value to collection
      if(value==null)
      {
        this.err('2,Type conversion error: Field "'+name+'" of type "'+oArgDef.sType+'" could not be converted (may be not implemented yet)');
      }
      else
      {
        if(oArgDef.bIsArray)
        { 
          if(this.oArg[name]==null) this.oArg[name]=[value];  //create new array, with one element
          else this.oArg[name][this.oArg[name].length]=value; //push
        }
        else
        {
          if(this.oArg[name]==null) this.oArg[name]=value;
          else this.err('3,Multiple entries of field "'+name+'" (but it\'s not defined as an array).');
        }
      }
    }
  }
//--| Test requirement and default rules.

  for(var i; i<oCallDef.aArgDefs.length; i++)
  {
    var arg=oCallDef.aArgDefs[i];
    if(arg.bRequired)
    {
      if(this.oArg[arg.sName]==null) this.err('5,error,Field "'+arg.sName+'" is required, but is not supplied.');
    }
    else
    { 
      //--| field is optional
      if(arg.vDefault!=null&&this.oArg[arg.sName]==null)
      {
        if(arg.bIsArray) this.oArg[arg.sName]=[arg.vDefault];
        else this.oArg[arg.sName]=arg.vDefault;
      }
    }
  }
}
function obj2str(o,r) {  var s='';   for(var i in o) {     if(!r||r.test(i)) {      s+=i+': '+o[i]+'\n';   } }  return s;}
/*private*/ function Interface_err(s)
{
  this.aErr[this.aErr.length]=s;
  this.bValid=false;
}
//-------------------------------------------------------------------------------------------------
//--| CallDefinition-class |-----------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

/*constructor*/ function CallDefinition(sName)
{
  this.sName=sName;
/*oArgDef and aArgDef are pointing to the same objects*/
  this.oArgDefs=new Object();
  this.aArgDefs=new Array();
  this.addArgument=CallDefinition_addArgument;
  return this;
}

/*
Arguments:
-sName:       String. The name of the argument. 
-sType:       String, pick from (string,int,float,boolean,date,enum). 
              *int is decimal based (radix of 10)
              *date is nl-short-format: dd-mm-yyyy
              *enum means it should be one of the strings, supplied with the argument aEnumValues
-bIsArray:    Boolean, optional, default is false.
-bRequired:   Boolean, optional, default is true.
-vDefault:    Variant, optional. If supplied, it should be of the type, as specified with 
              the argument sType.
-aEnumValues: Array of String. When sType is enum, argument is required, otherwise it is ignored.
-returnValue: -
Remarks:
-When an argument is optional, and shouldn't be supplied, ommit it, or supply the value null.
-#think about case-sentitivity#-
-#make robust: error check#-
*/
/*public*/ function CallDefinition_addArgument(sName,sType,bIsArray,bRequired,vDefault,aEnumValues)
{
/*because the for-in statement is available as of IE5, the objects are exposed by 
  object and by array (pointing to same object)*/
  if(typeof sName=='string')
  {
    var arg=this.aArgDefs[this.aArgDefs.length]=this.oArgDefs[sName]=new Object();
    arg.sName=sName; /*this field is not necessary for object-access, but is for array-access*/
    arg.sType=sType;
    arg.bIsArray=bIsArray==null?false:bIsArray;
    arg.bRequired=bRequired==null?true:bRequired;
    if(vDefault!=null) arg.vDefault=vDefault;
    if(sType=='enum') arg.aEnumValues=aEnumValues;
  }
  else if(typeof sName=='object')
  {
    var o=sName;
    var arg=this.aArgDefs[this.aArgDefs.length]=this.oArgDefs[o.sName]=new Object();
    arg.sName=o.sName; /*this field is not necessary for object-access, but is for array-access*/
    arg.sType=o.sType;
    arg.bIsArray=o.bIsArray==null?false:o.bIsArray;
    arg.bRequired=o.bRequired==null?true:o.bRequired;
    if(o.vDefault!=null) arg.vDefault=o.vDefault;
    if(o.sType=='enum') arg.aEnumValues=o.aEnumValues;
  }
}

//-------------------------------------------------------------------------------------------------
//--| Conversion functions |-----------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

function str2nlDate(st) 
//input(st): should be a string, format expected (dutch short date): "dd-mm-yyyy"
{	var s=String(st);
	var arrS = String(st).split("-");  //[0]=day; [1]=month (1..12); [2]=year
	if(arrS.length!=3) return null;
  var y=parseInt(arrS[2],10);
  var m=parseInt(arrS[1],10);
  var d=parseInt(arrS[0],10);
  if(isNaN(y)||isNaN(m)||isNaN(d)) return null;
	return new Date(y,m-1,d);
}
