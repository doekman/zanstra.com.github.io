/*
 * A javascript implementation for color syntax highlighting javascript.
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/colrSyntaxJS.htm for more info.
 */

//no style-sheet depencencies are needed, though this is a little less flexible.
document.writeln('<link rel="stylesheet" href="http://www.xs4all.nl/~zanstra/js/colorSyntaxJS.css">');

var eKeyword=1, eReserved=2, eBuildInJS=3, eBuildInJ=4, eBuildInHTML=5, eBuildInASP=6, eOtherLiteral=7;

var oKeywords={
/*keywords*/
  'break':eKeyword,'else':eKeyword,'new':eKeyword,'var':eKeyword,'case':eKeyword,'finally':eKeyword,
  'return':eKeyword,'void':eKeyword,'catch':eKeyword,'for':eKeyword,'switch':eKeyword,
  'while':eKeyword,'continue':eKeyword,'function':eKeyword,'this':eKeyword,'with':eKeyword,
  'default':eKeyword,'if':eKeyword,'throw':eKeyword,'delete':eKeyword,'in':eKeyword,'try':eKeyword,
  'do':eKeyword,'instanceof':eKeyword,'typeof':eKeyword,
/*Future reserved keywords*/
  'abstract':eReserved,'enum':eReserved,'int':eReserved,'short':eReserved,
  'boolean':eReserved,'export':eReserved,'interface':eReserved,'static':eReserved,
  'byte':eReserved,'extends':eReserved,'long':eReserved,'super':eReserved,
  'char':eReserved,'final':eReserved,'native':eReserved,'synchronized':eReserved,
  'class':eReserved,'float':eReserved,'package':eReserved,'throws':eReserved,
  'const':eReserved,'goto':eReserved,'private':eReserved,'transient':eReserved,
  'debugger':eReserved,'implements':eReserved,'protected':eReserved,'volatile':eReserved,
  'double':eReserved,'import':eReserved,'public':eReserved,
/*Javascript objects*/
  'Array':eBuildInJS,'Boolean':eBuildInJS,'Date':eBuildInJS,'Function':eBuildInJS,
  'Math':eBuildInJS,'Number':eBuildInJS,'Object':eBuildInJS,'RegExp':eBuildInJS,'String':eBuildInJS,
/*Jscript objects*/
  'ActiveXObject':eBuildInJ,'Dictionary':eBuildInJ,'Enumerator':eBuildInJ,
  'FileSystemObject':eBuildInJ,'VBArray':eBuildInJ,
/*HTML default objects*/
  'Anchor':eBuildInHTML,'anchors':eBuildInHTML,'Applet':eBuildInHTML,'applets':eBuildInHTML,'Area':eBuildInHTML,
  'Button':eBuildInHTML,'Checkbox':eBuildInHTML,'document':eBuildInHTML,'FileUpload':eBuildInHTML,
  'Form':eBuildInHTML,'forms':eBuildInHTML,'Frame':eBuildInHTML,'frames':eBuildInHTML,'Hidden':eBuildInHTML,'history':eBuildInHTML,
  'Image':eBuildInHTML,'images':eBuildInHTML,'Link':eBuildInHTML,'links':eBuildInHTML,'Area':eBuildInHTML,'location':eBuildInHTML,
  'MimeType':eBuildInHTML,'mimeTypes':eBuildInHTML,'navigator':eBuildInHTML,'options':eBuildInHTML,
  'Password':eBuildInHTML,'Plugin':eBuildInHTML,'plugins':eBuildInHTML,'Radio':eBuildInHTML,'Reset':eBuildInHTML,'Select':eBuildInHTML,
  'Submit':eBuildInHTML,'Text':eBuildInHTML,'Textarea':eBuildInHTML,'window':eBuildInHTML,
/*ASP objects*/
  'Application':eBuildInASP,'ObjectContext':eBuildInASP,'Request':eBuildInASP,'Response':eBuildInASP,'Server':eBuildInASP,
  'Server':eBuildInASP,'Session':eBuildInASP,
/*Other literals*/
  'true':eOtherLiteral,'false':eOtherLiteral,'null':eOtherLiteral
}
var oHTMLEncode={
  '<':'&lt;',
  '>':'&gt;',
  '\n':'\n', 
  '&':'&amp;',
  '\t':'  ' /*tab-size==2*/
}
/*global var's for linenumber*/
var bLN,nLengthOfNumber,nLineNumber;

function hiLiteJS(sClass,bLineNumber)
{
  var aPre=document.getElementsByTagName('PRE');
  var nProcessed=0;
  if(typeof bLineNumber=='undefined') bLineNumber=false;
  for(var i=aPre.length-1; i>=0; i--)
  {
    var oPre=aPre[i];
    if(oPre.className==sClass)
    {
      var oDiv=document.createElement('div');
      var t=parseJSCode(htmlCharDecode(oPre.innerHTML),bLineNumber);
      oDiv.innerHTML=t;
      oPre.parentNode.insertBefore(oDiv,oPre);
      oPre.style.display='none';
      nProcessed++;
    }
  }
}


function pre2div(sPreId,sDivId) {
/*put a PRE tag and a DIV tag in your HTML,
  put the javascript-source within the PRE tag
  set the DIV style on display: none
  call this function from body.onload
  -if script is enabled, user sees color-syntaxed code (within the DIV)
  -if script is disabled, or other problems, uses sees the PRE (black and white, though)
  Template;
    <div id="divSampleCode" style="display: none"> </div>
    <pre id="preSampleCode"> [...] </pre>
    body.onload="pre2div('preSampleCode','divSampleCode');
*/
  var oPre=ID(sPreId);
  var oDiv=ID(sDivId);
  oDiv.innerHTML=parseJSCode(oPre.innerHTML,false);
  oPre.style.display='none';
  oDiv.style.display='block';
}

function lineNumber() {
  return '<span class="lineNumber">'+fix(nLineNumber++,nLengthOfNumber)+' </span>'
}

function htmlCharEncode(ch) {
  //ch is of type string, and is expected to be one character
  if(oHTMLEncode[ch]==null) return ch;
  else if(bLN&&ch=='\n') return '<br />'+lineNumber();
  else return oHTMLEncode[ch];
}

function htmlCharDecode(s) {
  //ch is of type string, and is expected to be one character
  return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/i,'"').replace(/&amp;/g,'&');
}

function strNrOccurences(s1,s2) {
  //returns the number of occurences of s2 in s1
  var count=0, i=0;
  while(1) {
    i=s1.indexOf(s2,i);
    if(i>=0) {
      count++;
      i+=s2.length; 
    }
    else {
      break;
    }
  }
  return count;
}
function fix(s,len) {
  //right align string s, with length len (assuming s.length<=len)
  var s2='';
  for(var i=String(s).length; i<len; i++) s2+=' ';
  return s2+s;
}

function gotoBracket(sId,blnOpen) {
  if(ID(sId).scrollIntoView!=null) {
    ID(sId).scrollIntoView(blnOpen);
  }
  ID(sId).className+=' bracketOnClick';
  window.setTimeout('ID(\''+sId+'\').className=ID(\''+sId+'\').className.replace(\' bracketOnClick\',\'\');',2000);
}
function emphasize(sId,blnOn) {
  var x=ID('bracketOpen'+sId), y=ID('bracketClose'+sId);
  if(x!=null&&y!=null) {
    if(blnOn) {
      x.className+=' bracketOnOver';
      y.className+=' bracketOnOver';
    }
    else {
      x.className=x.className.replace(' bracketOnOver','');
      y.className=y.className.replace(' bracketOnOver','');
    }
  }
}

function ID(s) {
  if(document.getElementById==null) 
    return document.all[s];
  else
    return document.getElementById(s);
}

var nCallIdentifier=0;
function parseJSCode(s,blnLineNumbers) 
{
  nCallIdentifier++; //we need this, as a unique identifier
  var eText=0, eInRemark=1,eInLineRemark=2, eInString=3, eInEscape=4, eInWord=5, eInNumber=6, eInRegExp=7, eRegExpMod=8, eRegExpEsc=9;
  var nState=eText;
  var aHaakjeStack=[];
  var i=0, ch, sQuote, sRes='<pre class="js">', sWord='';

  function isRegExp()
  {
    //an regular expression can't contain line-ends,
    //so if it is an regexp, it has to end before j.
    var j=Math.min(s.indexOf('\n',i+1),s.indexOf('\r',i+1)); 
    var exp=s.substring(i,j); //the suspected string
    //lookup position of first non-escaped forward-slash
    var k=0;
    do
    {
      k=exp.indexOf('/',k+1);
    } 
    while(k>=0&&exp.substr(k-1,1)=='\\')
    exp=exp.substring(0,k); //this might be the RegularExpressionBody (see ecma)
    var reExp=/^([^\r\n\\\/*]|\\\/)([^\r\n\\\/]|\\\/)*/;
    return reExp.test(exp)
    //this is not a 100% test, because you have to known the context
    //to known if it's an regular expression. Take this:
    //  var s="var i=a / 100, j=1 /i;";
    //this line will let this function incorrectly evaluate in true :-(
  }

  s=String(s);
  if(blnLineNumbers) {
    bLN=true;
    nLengthOfNumber=String(strNrOccurences(s,'\n')+1).length;
    nLineNumber=1;
    sRes+=lineNumber();
  }
  else {
    bLN=false;
  }

  while(1) {
    ch=s.substr(i++,1);
    switch(nState) {
/****/case eText:/*****************************************************************************/
/*-------------------------------------------------*/
      switch(ch) {
          case '/':
            if(s.substr(i,1)=='*') {
              nState=eInRemark;
              sRes+='<span class="remark">'+s.substr(i-1,2);
              i++;
            }
            else if(s.substr(i,1)=='/') {
              nState=eInLineRemark;
              sRes+='<span class="remark">'+s.substr(i-1,2);
              i++;
            }
            else if(isRegExp()) {
              nState=eInRegExp;
              sRes+='<span class="regexp">'+ch;
            }
            else //it's an ordinary divide-sign
            {
              sRes+=htmlCharEncode(ch);
            }
            break;
          case '\'': case '"':
            nState=eInString;
            sQuote=ch;
            sRes+='<span class="quote">'+ch;
            break;
          case '{': case '(': case '[':
            var sIdent=aHaakjeStack[aHaakjeStack.length]=String(nCallIdentifier)+'_'+i; //push
            sRes+='<span class="bracket" id="bracketOpen'+sIdent+'" '
              +'onmouseover="emphasize(\''+sIdent+'\',true);" '
              +'onmouseout="emphasize(\''+sIdent+'\',false);" '
              +'onclick="gotoBracket(\'bracketClose'+sIdent+'\',false);"'
              +'>'+ch+'</span>';
            break;
          case '}': case ')': case ']': 
            if(aHaakjeStack.length>0) {
              var ii=aHaakjeStack[aHaakjeStack.length-1]; //pop
              aHaakjeStack.length--;
              sRes+='<span class="bracket" id="bracketClose'+ii+'" '
                +'onmouseover="emphasize(\''+ii+'\',true);" '
                +'onmouseout="emphasize(\''+ii+'\',false);" '
                +'onclick="gotoBracket(\'bracketOpen'+ii+'\',true);"'
                +'>'+ch+'</span>';
              break;
            }
            else {
              //can't find matching parentesis
              sRes+='<span class="bracket">'+ch+'</span>';
            }
            break;
          default:
            if(isWordPart(ch)) {
              nState=eInWord;
              sWord=ch;
            }
            else if(isNumberPart(ch)) {
              nState=eInNumber;
              sWord=ch;
            }
            else {
              sRes+=htmlCharEncode(ch);
            }
            break;
        }
        break;
/****/case eInRemark:/*****************************************************************************/
        if(ch=='*'&&s.substr(i,1)=='/') {
          nState=eText;
          sRes+='*/</span>';
          i++;
        }
        else {
          sRes+=htmlCharEncode(ch);
        }
        break;
/****/case eInLineRemark:/*****************************************************************************/
        if(ch=='\n'||ch=='\r') {
          nState=eText;
          sRes+='</span>'+htmlCharEncode(ch);
        }
        else {
          sRes+=htmlCharEncode(ch);
        }
        break;
/****/case eInString:/*****************************************************************************/
        if(ch=='\\') {
          nState=eInEscape;
          sRes+='<span class="escape">\\</span>';
        }
        else if(ch==sQuote) {
          nState=eText;
          sRes+=ch+'</span>';
        }
        else {
          sRes+=htmlCharEncode(ch);
        }
        break;
/****/case eInEscape:/*****************************************************************************/
        sRes+=htmlCharEncode(ch);
        nState=eInString;
        break;
/****/case eInNumber:/*****************************************************************************/
        if(isNumberPart(sWord+ch))
        {
          sWord+=ch;
        }
        else 
        {
          nState=eText;
          i--; //unget
          sRes+='<span class="number">'+sWord+'</span>';
        }
        break;
/****/case eInRegExp:/***************************************************************************/
        if(ch=='\\') {
          nState=eRegExpEsc;
          sRes+='<span class="escape">\\</span>';
        }
        else if(ch=='/') {
          nState=eRegExpMod;
          sRes+=htmlCharEncode(ch);
        }
        else {
          sRes+=htmlCharEncode(ch);
        }
        break;
/****/case eRegExpMod:/**************************************************************************/
        if(isRegExpMod(ch)) {
          sRes+=htmlCharEncode(ch);
        }
        else {
          nState=eText;
          i--; //unget
          sRes+='</span>';
        }
        break;
/****/case eRegExpEsc:/**************************************************************************/
        sRes+=htmlCharEncode(ch);
        nState=eInRegExp;
        break;
/****/case eInWord:/*****************************************************************************/
        if(isWordPartSucessor(ch)) {
          sWord+=ch;
        }
        else {
          nState=eText;
          i--; //unget
          if(oKeywords[sWord]!=null) {
            //keyword
            switch(oKeywords[sWord]) {
              case eKeyword:
                sRes+='<span class="keyword">'+sWord+'</span>';
                break;
              case eReserved:
                sRes+='<span class="reserved" title="This string is a future reserved word">'+sWord+'</span>';
                break;
              case eBuildInJS: case eBuildInJ: case eBuildInHTML: case eBuildInASP:
                sRes+='<span class="buildin">'+sWord+'</span>';
                break;
              case eOtherLiteral:
                sRes+='<span class="otherLiteral">'+sWord+'</span>';
                break;
              default:
                //foutje
                sRes+=sWord;
                break;
            }
          }
          else {
            sRes+=sWord;
          }
        }
        break;
/****/default:/*****************************************************************************/
        break;
    }
    if(i>s.length) break;
  }
  return sRes+'</pre>';
}

function isWordPart(ch)
{
  return ch>='a'&&ch<='z'||ch>='A'&&ch<='Z';
}
function isWordPartSucessor(ch)
{
  return isWordPart(ch)||ch>='0'&&ch<='9'||ch=='_'||ch=='$';
}
function isNumberPart(s)
{
  var i=0;
  var eStart=i++,eNul=i++,eNonNul=i++,eHex=i++,ePoint=i++,eWholeDigit=i++,
      eHexDigit=i++,eFracDigit=i++,eExp=i++,eSign=i++,eExpDigit=i++;
  var nState=eStart;
  for(i=0; i<s.length; i++)
  {
    var ch=s.substr(i,1);
    switch(nState)
    {
      case eStart:
        if(ch=='0') nState=eNul;
        else if(ch>='1'&&ch<='9') nState=eNonNul;
        else if(ch=='.') nState=ePoint;
        else return false;
        break;
      case eNul:
        if(ch=='x'||ch=='X') nState=eHex;
        else if(ch=='.') nState=ePoint;
        else return false;
        break;
      case eNonNul:
        if(ch>='0'&&ch<='9') nState=eWholeDigit;
        else if(ch=='e'||ch=='E') nState=eExp;
        else return false;
        break;
      case eHex:
        if(/[0-9a-f]/i.test(ch)) nState=eHexDigit;
        else return false;
        break;
      case ePoint:
        if(ch>='0'&&ch<='9') nState=eFracDigit;
        else return false;
        break;
      case eWholeDigit:
        if(ch=='.') nState=ePoint;
        else if(ch>='0'&&ch<='9') ; //no state change
        else if(ch=='e'||ch=='E') nState=eExp;
        else return false;
        break;
      case eHexDigit:
        if(/[0-9a-f]/i.test(ch)) ; //no state change
        else return false;
        break;
      case eFracDigit:
        if(ch>='0'&&ch<='9') ; //no state change
        else if(ch=='e'||ch=='E') nState=eExp;
        else return false;
        break;
      case eExp:
        if(ch=='+'||ch=='-') nState=eExpDigit;
        else if(ch>='0'&&ch<='9') nState=eExpDigit;
        else return false;
        break;
      case eSign:
        if(ch>='0'&&ch<='9') nState=eExpDigit;
        else return false;
        break;
      case eExpDigit:
        if(ch>='0'&&ch<='9') ; //no state change
        else return false;
        break;
      default:
        return false;
    }
  }
  return true; //right number-part
}
function isNumber(s)
{
  //TODO: support Float and Octal numbers
  var reInt=/^(\+|\-){0,1}[0-9]+$/;
  var reHex=/^0x[a-f0-9]+$/i;
  return reInt.test(s) || reHex.test(s);
}
function isRegExpMod(s)
{
  s=s.toLowerCase();
  return s=='i'||s=='g'||s=='m';
}