/*
 * Set and read cookies
 * Copyright (C) Doeke Zanstra 2001-2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/dzLib/cookie.htm for more info.
 */

function getExpireDate(interval,number) {
  var dtNow=new Date();
  number=parseInt(number,10);
  switch(interval) {
    case 'h': number*=60*60*1000; break; //hours
    case 'd': number*=24*60*60*1000; break; //days
    case 'w': number*=7*24*60*60*1000; break; //weeks
    case 'm': dtNow.setMonth(dtNow.getMonth()+number); number=0; break; //months
    case 'y': number*=52*7*24*60*60*1000; break; //weeks
  }
  return new Date(dtNow.valueOf()+number);
}

function testCookie() {
	var result, name='cookie.js', value='f5078f22c55111d389b90000f81fe221';
	setCookie(name,value,getExpireDate('y',1)); //try to save the cookie
	result=getCookie(name)==value;
	setCookie(name,''); //"remove"
	return result;
}

// Sets cookie values. expire is optional
function setCookie(name, value, expire) {	 
  document.cookie = name + "=" + escape(value) + ((expire == null) ? "" : ("; expires=" + expire.toGMTString()))
	var cookieValue=getCookie(name);
	if(cookieValue==value) return true; //save OK
	return false; //can't save cookie (cookies not allowed, cookie to long?)
}

function getCookie(Name) { 
  var search = Name + "=";
	if (document.cookie.length > 0) 
	{ // if there are any cookies      
		offset = document.cookie.indexOf(search);
		if (offset != -1)
		{ // if cookie exists          
			offset += search.length;
			// set index of beginning of value         
			end = document.cookie.indexOf(";", offset);
			// set index of end of cookie value 
			if (end == -1)             
			{	end = document.cookie.length;
			}
			return unescape(document.cookie.substring(offset, end));
		}    
	}
}
