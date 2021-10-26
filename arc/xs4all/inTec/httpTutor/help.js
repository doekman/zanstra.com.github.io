function lookupURL(aObjectList,sName,blnCaseSensitive) {
  for(var i=0; i<aObjectList.length; i++) {
    if(blnCaseSensitive&&aObjectList[i].name==sName
     ||!blnCaseSensitive&&aObjectList[i].name.toLowerCase()==sName.toLowerCase()) {
      return aObjectList[i].url;
    }
  }
  return '';
}
/*sort function*/
function fnSortHelpItems(o1,o2) {
  if(o1.name==o2.name) return 0;
  else if(o1.name<o2.name) return -1;
  else return 1;
}
/* if a item has more than one url, coding is as follow:
URLTitle_1 ! URL_1 ? URLTitle_2 ! URL_2 */
var sURLseperator=' ? '; //pretty safe URL seperator, I hope...
var sTitleURLseperator=' ! '; //
var aMethods=
[ {name:'OPTIONS',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.2'}
, {name:'GET',    url:'HTTP ! http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3 ? WebDAV ! http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.4'}
, {name:'HEAD',   url:'HTTP ! http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.4 ? WebDAV ! http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.4'}
, {name:'POST',   url:'HTTP ! http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5 ? WebDAV ! http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.5'}
, {name:'PUT',    url:'HTTP ! http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6 ? WebDAV ! http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.7'}
, {name:'DELETE', url:'HTTP ! http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.7 ? WebDAV ! http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.6'}
, {name:'TRACE',  url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.8'}
, {name:'CONNECT',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.9'}
/*WebDAV methods*/
, {name:'PROPFIND', url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.1'}
, {name:'PROPPATCH',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.2'}
, {name:'MKCOL',    url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.3'}
, {name:'COPY',     url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.8'}
, {name:'MOVE',     url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.9'}
, {name:'LOCK',     url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.10'}
, {name:'UNLOCK',   url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-8.11'}
];
var aStatusHelp=
[ {name:'100',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.1.1'}
, {name:'101',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.1.2'}
, {name:'200',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.1'}
, {name:'201',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.2'}
, {name:'202',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.3'}
, {name:'203',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.4'}
, {name:'204',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5'}
, {name:'205',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.6'}
, {name:'206',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.7'}
, {name:'300',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.1'}
, {name:'301',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.2'}
, {name:'302',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.3'}
, {name:'303',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.4'}
, {name:'304',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.5'}
, {name:'305',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.6'}
, {name:'306',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.7'}
, {name:'307',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.8'}
, {name:'400',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1'}
, {name:'401',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2'}
, {name:'402',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.3'}
, {name:'403',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.4'}
, {name:'404',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5'}
, {name:'405',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.6'}
, {name:'406',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.7'}
, {name:'407',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.8'}
, {name:'408',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.9'}
, {name:'409',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.10'}
, {name:'410',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.11'}
, {name:'411',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.12'}
, {name:'412',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.13'}
, {name:'413',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.14'}
, {name:'414',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.15'}
, {name:'415',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.16'}
, {name:'416',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.17'}
, {name:'417',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.18'}
, {name:'500',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.1'}
, {name:'501',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.2'}
, {name:'502',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.3'}
, {name:'503',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.4'}
, {name:'504',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.5'}
, {name:'505',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.6'}
/*WebDAV status codes*/
, {name:'102',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-10.1'}
, {name:'207',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-10.2'}
, {name:'422',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-10.3'}
, {name:'423',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-10.4'}
, {name:'424',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-10.5'}
, {name:'507',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-10.6'}
];
var aHeaders=
[	{name:'Accept',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1'}
,	{name:'Accept-Charset',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.2'}
,	{name:'Accept-Encoding',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3'}
,	{name:'Accept-Language',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4'}
,	{name:'Accept-Ranges',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.5'}
,	{name:'Age',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.6'}
,	{name:'Allow',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.7'}
,	{name:'Authorization',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.8'}
,	{name:'Cache-Control',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9'}
,	{name:'Connection',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.10'}
,	{name:'Content-Encoding',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11'}
,	{name:'Content-Language',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.12'}
,	{name:'Content-Length',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.13'}
,	{name:'Content-Location',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.14'}
,	{name:'Content-MD5',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.15'}
,	{name:'Content-Range',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.16'}
,	{name:'Content-Type',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17'}
,	{name:'Date',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.18'}
,	{name:'ETag',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.19'}
,	{name:'Expect',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.20'}
,	{name:'Expires',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21'}
,	{name:'From',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.22'}
,	{name:'Host',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.23'}
,	{name:'If-Match',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.24'}
,	{name:'If-Modified-Since',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.25'}
,	{name:'If-None-Match',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.26'}
,	{name:'If-Range',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.27'}
,	{name:'If-Unmodified-Since',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.28'}
,	{name:'Last-Modified',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.29'}
,	{name:'Location',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.30'}
,	{name:'Max-Forwards',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.31'}
,	{name:'Pragma',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.32'}
,	{name:'Proxy-Authenticate',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.33'}
,	{name:'Proxy-Authorization',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.34'}
,	{name:'Range',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35'}
,	{name:'Referer',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.36'}
,	{name:'Retry-After',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.37'}
,	{name:'Server',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.38'}
,	{name:'TE',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.39'}
,	{name:'Trailer',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.40'}
,	{name:'Transfer-Encoding',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.41'}
,	{name:'Upgrade',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.42'}
,	{name:'User-Agent',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.43'}
,	{name:'Vary',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.44'}
,	{name:'Via',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.45'}
,	{name:'Warning',url:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.46'}
,	{name:'WWW-Authenticate',url:'HTTP ! http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.47 ? Microsoft (NTLM) ! http://msdn.microsoft.com/library/en-us/vcsample98/samp/VC98/sdk/winbase/security/winnt/httpauth/httpauth.asp?frame=true'}
/*WebDAV headers*/
,	{name:'DAV',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.1'}
,	{name:'Depth',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.2'}
,	{name:'Destination',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.3'}
,	{name:'If',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.4'}
,	{name:'Lock-Token',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.5'}
,	{name:'Overwrite',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.6'}
,	{name:'Status-URI',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.7'}
,	{name:'Timeout',url:'http://asg.web.cmu.edu/rfc/rfc2518.html#sec-9.8'}
, {name:'Translate',url:'4 Guys From Rolla ! http://www.4guysfromrolla.com/webtech/081500-1.shtml ? SecuriTeam ! http://www.securiteam.com/windowsntfocus/Translate_f_vulnerability_exposes_IIS_files_source.html'}
/*"wrong" headers*/
, {name:'Keep-Alive',url:'http://www.w3.org/Protocols/HTTP/Issues/http-persist.html'}
, {name:'Public',url:'http://www.w3.org/Protocols/HTTP/Object_Headers.html#public'}
/*P3P headers*/
, {name:'P3P',url:'http://www.w3.org/TR/P3P/#syntax_ext'}
];