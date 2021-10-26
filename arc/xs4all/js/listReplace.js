/*
 * List replace. When multiple strings need to be replaced in a string,
 * consecutive replace function-calls is not really efficient. This function
 * solves this.
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/get.htm for more info.
 */

/*
Usage:
s=listReplace(s,initTokenCache(aHTMLTokens));
//or if more than one string needs to be taken care of
var aTokenCache=initTokenCache(aUBBTokens);
s1=listReplace(s1,aTokenCache);
s2=listReplace(s2,aTokenCache);
*/

var aHTMLTokens=[['<','&lt;'],['>','&gt;'],[' ','&nbsp;']];
var aUBBTokens = 
[ ['[u]','<u>']
,	['[/u]','</u>']
,	['[b]','<b>']
,	['[/b]','</b>']
,	['[i]','<i>']
,	['[/i]','</i>']
,	['[code]','<code>']
,	['[/code]','</code>']
,	['[br]','<br>']
,	[':-)','<img src="../img/smileyHappy.gif">']
,	[':-(','<img src="../img/smileyAngry.gif">']
];

function initTokenCache(aHashArray) {
/*
Description: Builds up an 'token' cache, and returns it. 
Parameters:
-aHashArray: array of array of string. 2nd array needs to have 2 elements. 
 Example: [['<','&lt;'],['>','&gt;'],[' ','&nbsp;'],['\r\n','<br>']];
-Tokencache is an array of objects (used as associative array)
-array-index is length of sub-token
-property of object is the string of the subtoken
-false means subtoken, true means token is complete
Example when there's only the '[u]' token:
-aTokenCache=[{'[':false},{'[u':false}{'[u]':true}];
*/
  var nLen=1;
  aTokenCache=[];
  while(1) {
    var bTokenAdded=false;
    aTokenCache[nLen-1]=new Object();
    for(var i=0; i<aHashArray.length; i++) {
      if(nLen<=aHashArray[i][0].length) {
        var sSubToken=aHashArray[i][0].substr(0,nLen);
        if(aTokenCache[nLen-1][sSubToken]==null) {
          bTokenAdded=true;
          aTokenCache[nLen-1][sSubToken]=nLen==aHashArray[i][0].length?aHashArray[i][1]:false;
        }
      }
    }
    if(!bTokenAdded) break;
    nLen++;
  }
  return aTokenCache;
}
function listReplace(s,aTokenCache,dbg) {
  var i=0, j=1; /*s.substr(i,j) is pre-token*/
  var sRes=''; /*result*/
  if(dbg==null) dbg=false;
  while(1) {
    if(dbg&&!confirm('i='+i+'\nj='+j+'\nsubtoken='+s.substr(i,j)+'\ns='+s+'\nsRes='+sRes)) return;
    if(aTokenCache[j-1][s.substr(i,j)]==null) {
      /*normal text*/
      sRes+=s.substr(i++,j=1);
    }
    else {
      if(aTokenCache[j-1][s.substr(i,j)]==false) {
        /*possibly a token*/
        j++;
      }
      else {
        /*token found*/
        sRes+=aTokenCache[j-1][s.substr(i,j)];
        i+=j;
        j=1;
      }
    }
    if(i+j>s.length) break;
  }
  return sRes;
}
