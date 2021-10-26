// BeeHive2 - V2.07 July 07, 2002
// ----------------------------------------------
// Peterned - http://www.xs4all.nl/~peterned
// (c) 2002 - Peter Nederlof

document.dyn = [];
document.events = [];
var activeObj, dragObj, doc;
var mouseX=0, mouseY=0, dynTopZ=100;

function dynCreateObject(id, x, y, w, h, vis, bg, z) {
	var temp = new dynObject(id, this.id);
	temp.setProperties(x, y, w, h, vis, bg, z);
	return temp;
}
	function attachObject(id, nest) {
		return document.dyn[id] || new dynObject(id, nest, true);
	}

function dynObject(id, nest, attach) {
	this.id = id;
	this.parent = (nest)? attachObject(nest):false;
	this.children = [];
	this.attached = attach;
	this.events = [];
	this.build();
}

dynProto = dynObject.prototype;
dynProto.createObject = document.createObject = dynCreateObject;
dynProto.build = function() {
	document.dyn[this.id] = this;
	if(this.parent) this.parent.children[this.id] = this;
	if(this.attached) {
		this.layer = document.getElementById(this.id);
	} else {
		var lyr, target = (this.parent)? this.parent.layer:document.body;
		with(lyr = document.createElement("DIV")) {
			setAttribute("style", "position:absolute; visibility:hidden;");
			style.position = 'absolute';
			style.visibility = 'hidden';
		}

		this.layer = target.appendChild(lyr);
		this.layer.id = this.id;
	}	this.css = this.layer.style;
}

dynProto.remove = function() {
	var target = (this.parent)? this.parent.layer : document.body;
	target.removeChild(this.layer);
	for(var j in this.children) { this.children[j].remove(); }
	for(var i in this) { delete this[i]; }
	delete document.dyn[this.id];
}

// Basics
// ----------------------------------------------
dynProto.moveTo = function(x, y) {
	this.x = x; this.y = y;
	if(this.limits) {
		with(this.limits) {
			this.x = (x < mx)? mx:((x + this.w > mw)? mw-this.w:x);
			this.y = (y < my)? my:((y + this.h > mh)? mh-this.h:y);
		}
	}	with(this.css) { left = this.x; top = this.y; }
}
	dynProto.limitMovement = function(x, y, w, h) {
		this.limits = { 'mx':x, 'my':y, 'mw':w, 'mh':h }
	}

dynProto.moveBy = function(dx, dy) {
	this.moveTo(this.x + dx, this.y + dy);
}

dynProto.setVisible = function(vis){
	this.visible = vis;
	this.css.visibility = (vis)?
		((this.parent)? 'inherit':'visible'):'hidden';
}

dynProto.setZIndex = function(z) {
	this.css.zIndex = this.z = z;
	if(z > dynTopZ) dynTopZ = z;
}

dynProto.resizeTo = function(w, h) {
	with(this.css) {
		if(w) { width = this.w = w; this.r = this.x + w; }
		if(h) { height = this.h = h; this.b = this.y + h; }
	}
}

dynProto.clipTo = function(t, w, h, l) {
	this.css.clip = 'rect('+t+','+w+','+h+','+l+')';
}

dynProto.write = function(html) {	
	this.layer.innerHTML = this.html = html;
}

dynProto.add = function(html) {
	this.write(this.html? (this.html + html):html);
}

dynProto.setBackground = function(to) {
	if(to.indexOf('.') > 0) this.css.backgroundImage = 'url('+to+')';
	else this.css.backgroundColor = to;
}

dynProto.createImage = function(src, name, w, h) {
	var img = '<img src="'+src+'" name="'+name+'" border=0 align="top" '
	  +(w? 'width="'+w+'" height="'+h+'">':'>');
	this.write(img);
	this.image = document.images[name];
	this.image.parent = this;
}

dynProto.setProperties = function(x, y, w, h, vis, bg, z) {
	this.moveTo(x,y);
	this.resizeTo(w,h);
	if(vis) this.setVisible((vis=="visible")?true:false);
	if(bg) this.setBackground(bg);
	if(z) this.setZIndex(z);
}

dynProto.getDimensions = function() {
	this.w = this.layer.clientWidth || this.layer.offsetWidth;
	this.h = this.layer.clientHeight || this.layer.offsetHeight;
	this.r = this.x + this.w;
	this.b = this.y + this.h;
}

// Extras
// ----------------------------------------------
dynProto.slideTo = function(x, y, time) {
	var steps = Math.round(time/40);
	this.dx = ((this.tx = x) - this.x)/steps;
	this.dy = ((this.ty = y) - this.y)/steps;
	this.sTimer = setInterval('document.dyn["'+this.id+'"].slideStep()', 40);
}

dynProto.slideBy = function(dx, dy, time) {
	this.slideTo(this.x + dx, this.y + dy, time);
}
	dynProto.slideStep = function() {
		if((this.tx - this.x)/this.dx < 1 
		|| (this.ty - this.y)/this.dy < 1) {
			clearInterval(this.sTimer);
			this.moveTo(this.tx, this.ty);
			if(this.onSlideEnd) this.onSlideEnd();
		} else this.moveBy(this.dx, this.dy);
	}

dynProto.setBorder = function(width, style, color) {
	this.css.borderWidth = width;
	this.css.borderStyle = style;
	this.css.borderColor = color;
}

dynProto.setOpacity = function(to) {
	this.css.filter = 'alpha(opacity='+to+')';
	this.css.MozOpacity = to/100;
}

dynProto.fadeTo = function(opacity, time) {
	this.fSteps = Math.round(time/40);
	this.fTick = (opacity - (this.tAlpha = this.opacity || 0))/this.fSteps;
	this.fTimer = setInterval('document.dyn["'+this.id+'"].fadeStep()', 40);
}
	dynProto.fadeStep = function() {
		this.tAlpha += this.fTick;
		if(this.fSteps-- <= 0) clearInterval(this.fTimer);
		this.setOpacity(Math.round(this.tAlpha));
	}

// Events
// ----------------------------------------------
dynProto.attachEvent = document.attachEvent = function(type, reference) {
	if(!this.events[type]) this.events[type] = [];
	this.events[type][this.events[type].length] = reference;
	if(this.id) { this.layer[type] = function(e) {
		activeObj = document.dyn[this.id];
		document.dyn[this.id].executeEvents(type, e); }
	} else { document[type] = function(e) {
		document.executeEvents(type, e); 
		if(dragObj) return false; }
	}
}

dynProto.removeEvent = function(type, pos) { delete this.events[type][pos];	}
dynProto.executeEvents = document.executeEvents = function(type, e) {
	if(!this.events[type]) return;
	this.eventType = type;
	for(var i in this.events[type]) {
		this.events[type][i](e);
	}
}

window.onresize = function() { doc.refresh(); }
window.onload = function() { 
	doc = new documentProperties();
	document.executeEvents('onload'); 
}

document.attachEvent('onmousemove', dynMouseCoords);
function dynMouseCoords(e) {
	mouseX = (e)? e.pageX:event.x;
	mouseY = (e)? e.pageY:event.y;
}

// Document properties
// ----------------------------------------------
function documentProperties() {	this.refresh(); }
docProto = documentProperties.prototype;
docProto.xScroll = function() { return document.body.scrollLeft || window.pageXOffset; }
docProto.yScroll = function() { return document.body.scrollTop || window.pageYOffset; }
docProto.refresh = function() {
	this.availWidth = document.body.clientWidth || window.innerWidth;
	this.availHeight  = document.body.clientHeight || window.innerHeight;
	document.executeEvents('onresize');
}

// Drag & drop
// ----------------------------------------------
dynProto.enableDragDrop = function(settings) {
	this.attachEvent('onmousedown', dynStartDrag);
	this.attachEvent('onmouseup',   dynStopDrag);
	document.attachEvent('onmousemove', dynHandleDrag);
	document.attachEvent('onmouseup',   dynStopDrag);

	function contains(arg) { return settings? (settings.indexOf(arg) > -1):0 }	
	var obj = this.dragTarget = contains('dragParent')? this.parent:this;
	obj.toFront = contains('bringToFront');
	obj.dragH = contains('horizontal');
	obj.dragV = contains('vertical');
}

dynProto.setDragAction = function(reference) {
	this.dragTarget.dragAction = reference;
}

function dynStartDrag() {
	dragObj = activeObj.dragTarget
	if(dragObj.toFront) dragObj.setZIndex(++dynTopZ);
	dragObj.xAnch = mouseX - dragObj.x;
	dragObj.yAnch = mouseY - dragObj.y;
	dragObj.isDragged = true;
}

function dynStopDrag() { dragObj = false; }
function dynHandleDrag() {
	if(dragObj && dragObj.isDragged) {
		dragObj.dragX = (dragObj.dragV)? dragObj.x : mouseX - dragObj.xAnch;
		dragObj.dragY = (dragObj.dragH)? dragObj.y : mouseY - dragObj.yAnch;
		if(dragObj.dragAction) dragObj.dragAction();
		with(dragObj) {
			moveTo(dragX, dragY);
		}
	}
}