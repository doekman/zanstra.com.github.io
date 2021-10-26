/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	x.js - X-DOM, modification of cross-browser DHTML Library from Cross-Browser.com
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Copyright (c) 2002, 2003 Michael Foster (mike@cross-browser.com)
	This library is distributed under the terms of the LGPL (gnu.org)
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	This DOM-only version by Aleksandar Vacic, www.aplus.co.yu
	- works only with DOM compatible browsers
	- Event part of the library removed
	- functions don't check for argument lengths, but whether arguments are defined (passed)
	- xPageX and xPageY don't call xParent, they directly use e.offset* (since calculation is solely based on .offset* properties)
	- added function xGetAnyCS which returns any computed style property
	- added xOn, xOff, which toggles display property. also xIsOn and xIsShown which checks if element is displayed, visible
	- added xStick and xStickScroll (based on code by Peter Paul Koch) - layer will follow user while he scrolls down
	- added xGetAnySP which return style property, either from DOM or CSS
	- added xContX and xContY which calculate offset up to first parent (container) which has position relative or absolute
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Variables
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
var xVersion = "3.12DOM", xOp7 = false, xIE = false, xUA = navigator.userAgent.toLowerCase();
if (window.opera) {
	xOp7 = ( xUA.indexOf("opera 7") != -1 || xUA.indexOf("opera/7") != -1 );
} else {
	xIE = ( xUA.indexOf("msie") != -1 );
}

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Appearance
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
function xOn(e, sV) {
	if ( !(e = xGetElementById(e)) ) return;
	if ( xDef(sV) )
		e.style.display = sV;
	else
		e.style.display = "block";
}
function xOff(e) {
	if ( !(e = xGetElementById(e)) ) return;
	e.style.display = "none";
}
function xIsOn(e) {
	if ( !(e = xGetElementById(e)) ) return;
	var bRet = true;
	if (e.style.display == "") {
		bRet = !(xGetAnyCS(e, "display") == "none");
	} else {
		bRet = !(e.style.display == "none");
	}
	return bRet;
}
function xShow(e) {
	if ( !(e = xGetElementById(e)) ) return;
	e.style.visibility = "visible"; // v3.12, e.style.visibility='inherit';
}
function xHide(e) {
	if ( !(e = xGetElementById(e)) ) return;
	e.style.visibility = "hidden";
}
function xIsShown(e) {
	if ( !(e = xGetElementById(e)) ) return;
	var bRet = true;
	if (e.style.visibility == "")
		bRet = !(xGetAnyCS(e, "visibility") == "hidden");
	else
		bRet = !(e.style.visibility == "hidden");
	return bRet;
}
function xZIndex(e, uZ) {
	if ( !(e = xGetElementById(e)) ) return 0;
	if ( xDef(uZ) )
		e.style.zIndex = uZ;
    else
		uZ = e.style.zIndex;
	return uZ;
}
function xColor(e, sColor) {
	if ( !(e = xGetElementById(e)) ) return "";
	var c = "";
    if ( arguments.length > 1 )
		e.style.color = sColor;
	c = e.style.color;
	return c;
}
function xBackground(e, sColor, sImage) {
	if ( !(e = xGetElementById(e)) ) return "";
	var bg = "";
    if ( arguments.length > 1 )
		e.style.backgroundColor = sColor;
    if ( arguments.length == 3 )
		e.style.backgroundImage = (sImage && sImage != "") ? "url("+sImage+")" : null;
	bg = e.style.backgroundColor;
	return bg;
}
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Position
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
function xMoveTo(e, iX, iY) {
	xLeft(e,iX);
	xTop(e,iY);
}
function xLeft(e, iX) {
	if ( !(e = xGetElementById(e)) ) return 0;
    if ( xDef(iX) )
		e.style.left = iX + "px";
	else {
    	if ( xDef(e.offsetLeft) )
			iX = e.offsetLeft; // v3.12
		else
			iX = parseInt(e.style.left);
    	if (isNaN(iX))
			iX = 0;
	}
	return iX;
}
function xTop(e, iY) {
	if ( !(e = xGetElementById(e)) ) return 0;
    if ( xDef(iY) )
		e.style.top = iY + "px";
	else {
		if ( xDef(e.offsetTop) )
			iY = e.offsetTop; // v3.12
		else
			iY = parseInt(e.style.top);
		if (isNaN(iY))
			iY = 0;
	}
	return iY;
}
function xPageX(e) {
	if ( !(e = xGetElementById(e)) ) return 0;
	var x = 0;
	while (e) {
		if ( xDef(e.offsetLeft) ) x += e.offsetLeft;
		else break;
		e = e.offsetParent;
	}
	return x;
}
function xPageY(e) {
	if ( !(e = xGetElementById(e)) ) return 0;
	var y = 0;
	while (e) {
		if ( xDef(e.offsetTop) ) y += e.offsetTop;
		else break;
		e = e.offsetParent;
	}
	return y;
}
function xContX(e) {
	if ( !(e = xGetElementById(e)) ) return 0;
	var x = 0;
	var sPosCont = "";
	while (e) {
		if ( xDef(e.offsetLeft) ) x += e.offsetLeft;
		else break;
		e = e.offsetParent;
		sPosCont = xGetAnySP(e, "position");
		if ( sPosCont == "absolute" || sPosCont == "relative" )
			break;
	}
	return x;
}
function xContY(e) {
	if ( !(e = xGetElementById(e)) ) return 0;
	var y = 0;
	if (xGetAnySP(e, "position") == null) {

	} else {
		var sPosCont = "";
		while (e) {
			if ( xDef(e.offsetTop) ) y += e.offsetTop;
			else break;
			e = e.offsetParent;
			sPosCont = xGetAnySP(e, "position");
			if ( sPosCont == "absolute" || sPosCont == "relative" )
				break;
		}
	}
	return y;
}
function xSlideTo(e, x, y, uTime) {
	if ( !(e = xGetElementById(e)) ) return;
	if ( !e.timeout )
		e.timeout = 25;
	e.xTarget = x;
	e.yTarget = y;
	e.slideTime = uTime;
	e.stop = false;
	e.yA = e.yTarget - xTop(e);
	e.xA = e.xTarget - xLeft(e); // A = distance
	e.B = Math.PI / (2 * e.slideTime); // B = period
	e.yD = xTop(e);
	e.xD = xLeft(e); // D = initial position
	var d = new Date();
	e.C = d.getTime();
	if (!e.moving)
		xSlide(e);
}
function xSlide(e) {
	if ( !(e = xGetElementById(e)) ) return;
	var now, s, t, newY, newX;
	now = new Date();
	t = now.getTime() - e.C;
	if (e.stop) {
		e.moving = false;
	} else if (t < e.slideTime) {
		setTimeout("xSlide('" + e.id + "')", e.timeout);
		s = Math.sin(e.B * t);
		newX = Math.round(e.xA * s + e.xD);
		newY = Math.round(e.yA * s + e.yD);
		xMoveTo(e, newX, newY);
		e.moving = true;
	} else {
		xMoveTo(e, e.xTarget, e.yTarget);
		e.moving = false;
	}  
}
function xStick(e) {
	if ( !(e = xGetElementById(e)) ) return;

	if ( !xDef(e.stick) ) {
		e.stick = false;
		e.stickOldPos = 0;
		e.stickStart = xTop(e);
		e.stickSub = xPageY(e) - e.stickStart;
		e.style.position = "absolute";
	}
	e.stick = (e.stick) ? false : true;
	if ( !e.stick ) {
		clearTimeout(e.stickTimer);
	}
}
function xStickScroll(e) {
	if ( !(e = xGetElementById(e)) ) return;

	var nPos;
	if (e.stick) {
		nPos = xScrollTop();
		if ( nPos < e.stickSub )
			nPos = e.stickStart;
		else
			nPos -= e.stickSub;
		if ( nPos != e.stickOldPos )
			xTop( e, nPos );
		e.stickOldPos = nPos;
		e.stickTimer = setTimeout("xStickScroll('" + e.id + "')", 500);
	}
}
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Size
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
function xResizeTo(e, uW, uH) {
	xWidth(e,uW);
	xHeight(e,uH);
}
function xWidth(e, uW) {
	if ( !e || (uW && uW<0) ) return 0;
	if ( xDef(uW) ) {
		uW = Math.round(uW);
		xSetCW(e, uW);
	}
	uW = e.offsetWidth;
	return uW;
}
function xHeight(e, uH) {
	if ( !e || (uH && uH<0) ) return 0;
	if ( xDef(uH) ) {
		uH = Math.round(uH);
		xSetCH(e, uH);
	}
	uH=e.offsetHeight;
	return uH;
}
function xGetCS(ele,sP){
	return parseInt(document.defaultView.getComputedStyle(ele,"").getPropertyValue(sP));
}
function xSetCW(ele,uW){
	if (uW < 0) return;

	var pl=0, pr=0, bl=0, br=0;
	if ( xDef(document.defaultView) && xDef(document.defaultView.getComputedStyle) ) {
		pl = xGetCS(ele, "padding-left");
		pr = xGetCS(ele, "padding-right");
		bl = xGetCS(ele, "border-left-width");
		br = xGetCS(ele, "border-right-width");
	} else if ( xDef(ele.currentStyle, document.compatMode) ) {
		if(document.compatMode == "CSS1Compat"){
			pl = parseInt(ele.currentStyle.paddingLeft);
			pr = parseInt(ele.currentStyle.paddingRight);
			bl = parseInt(ele.currentStyle.borderLeftWidth);
			br = parseInt(ele.currentStyle.borderRightWidth);
		}
	} else if ( xDef(ele.offsetWidth, ele.style.width) ) {
		ele.style.width = uW + "px";
		pl = ele.offsetWidth - uW;
	}
	if ( isNaN(pl) ) pl=0;
	if ( isNaN(pr) ) pr=0;
	if ( isNaN(bl) ) bl=0;
	if ( isNaN(br) ) br=0;
	var cssW = uW - (pl+pr+bl+br);
	if ( isNaN(cssW) || cssW<0 )
		return;
	else
		ele.style.width = cssW + "px";
}
function xSetCH(ele, uH){
	if (uH < 0) return;

	var pt=0, pb=0, bt=0, bb=0;
	if ( xDef(document.defaultView) && xDef(document.defaultView.getComputedStyle) ) {
		pt = xGetCS(ele,"padding-top");
		pb = xGetCS(ele,"padding-bottom");
		bt = xGetCS(ele,"border-top-width");
		bb = xGetCS(ele,"border-bottom-width");
	}
	else if (xDef(ele.currentStyle,document.compatMode)) {
		if (document.compatMode == "CSS1Compat"){
			pt=parseInt(ele.currentStyle.paddingTop);
			pb=parseInt(ele.currentStyle.paddingBottom);
			bt=parseInt(ele.currentStyle.borderTopWidth);
			bb=parseInt(ele.currentStyle.borderBottomWidth);
		}
	}
	else if ( xDef(ele.offsetHeight, ele.style.height) ) {
		ele.style.height = uH + "px";
		pt = ele.offsetHeight - uH;
	}
	if ( isNaN(pt) ) pt=0;
	if ( isNaN(pb) ) pb=0;
	if ( isNaN(bt) ) bt=0;
	if ( isNaN(bb) ) bb=0;
	var cssH = uH - (pt+pb+bt+bb);
	if ( isNaN(cssH) || cssH<0 )
		return;
	else
		ele.style.height = cssH + "px";
}
function xClip(e,iTop,iRight,iBottom,iLeft) {
	if ( !(e = xGetElementById(e)) ) return;
	if (arguments.length == 5)
		e.style.clip = "rect(" + iTop + "px " + iRight + "px " + iBottom + "px " + iLeft + "px)";
	else
		e.style.clip = "rect(0 " + parseInt(e.style.width) + "px " + parseInt(e.style.height) + "px 0)";
}
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Object
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
function xGetElementById(e) {
	if (typeof(e) != "string") return e;
	if (document.getElementById)
		e = document.getElementById(e);
	else
		e = null;
	return e;
}
function xParent(e){
	if ( !(e = xGetElementById(e)) ) return null;

	var p = null;
	if ( xDef(e.parentNode) )
		p = e.parentNode;
	else if ( xDef(e.parentElement) )
		p = e.parentElement;
	else if ( xDef(e.offsetParent) )
		p = e.offsetParent;

	return p;
}
function xDef() {
	for (var i=0; i<arguments.length; ++i) {
		if ( typeof(arguments[i]) == "undefined" )
			return false;
	}
	return true;
}
function xGetDOMPropName(sP) {
	var sProperty = sP;
	if ( sP.indexOf("-") ) {
		sProperty = "";
		var aP = sP.split("-");
		for (var i=0;i<aP.length;i++) {
			sFirstLetter = aP[i].charAt(0);
			if (i != 0)
				sFirstLetter = sFirstLetter.toUpperCase();
			sProperty += sFirstLetter + aP[i].substring(1);
		}
	}
	return sProperty;
}
function xGetAnyCS(ele, sP) {
	var sRet = "";
	if ( xDef(document.defaultView) && xDef(document.defaultView.getComputedStyle) ) {
		sRet = document.defaultView.getComputedStyle(ele,"").getPropertyValue(sP);
	} else if ( xDef(ele.currentStyle, document.compatMode) ) {
		if (document.compatMode == "CSS1Compat") {
			eval("sRet = ele.currentStyle." + xGetDOMPropName(sP));
		}
	} else {
		return null;
	}
	return sRet;
}
function xGetAnySP(ele, sP) {
	var sRet = "";
	if (ele) {
		eval("sRet = ele.style." + xGetDOMPropName(sP));
		if (sRet == "")
			sRet = xGetAnyCS(ele, sP);
	}
	return sRet;
}
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Window
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
function xScrollLeft() {
	var offset = 0;
	if ( xDef(window.pageXOffset) )
		offset = window.pageXOffset;
	else if ( document.documentElement && document.documentElement.scrollLeft )
		offset = document.documentElement.scrollLeft;
	else if ( document.body && xDef(document.body.scrollLeft ) )
		offset = document.body.scrollLeft;
	return offset;
}
function xScrollTop() {
	var offset = 0;
	if ( xDef(window.pageYOffset) )
		offset = window.pageYOffset;
	else if ( document.documentElement && document.documentElement.scrollTop )
		offset = document.documentElement.scrollTop;
	else if ( document.body && xDef(document.body.scrollTop ) )
		offset = document.body.scrollTop;
	return offset;
}
function xClientWidth() {
	var w=0;
	if ( !window.opera && document.documentElement && document.documentElement.clientWidth ) // v3.12
		w=document.documentElement.clientWidth;
	else if ( document.body && document.body.clientWidth )
		w = document.body.clientWidth;
	return w;
}
function xClientHeight() {
	var h=0;
	if ( !window.opera && document.documentElement && document.documentElement.clientHeight ) // v3.12
		h = document.documentElement.clientHeight;
	else if ( document.body && document.body.clientHeight )
		h = document.body.clientHeight;
	return h;
}
