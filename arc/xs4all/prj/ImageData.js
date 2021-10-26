function ImageData() {
  this._setupObservedModel();
}
//--| Init stuff |--------------------------------------------------------------
ImageData.prototype.setImage=function(url,alt,title) {
  this._set("url",url);
  this.setImageAlt(alt||"");  
  this.setImageTitle(title||"");  
}
ImageData.prototype.setImageAlt=function(alt) {
  this._set("imgAlt",alt);
}
ImageData.prototype.setImageTitle=function(title) {
  this._set("imgTitle",title);
}
//--| Size |--------------------------------------------------------------------
ImageData.prototype.setPctWidth=function(w) {
  this.setWidth(Math.round(w*this._get("orgWidth")));
}
ImageData.prototype.setWidth=function(w,skipAsra) {
  if(this._get("lockAsra")&&!skipAsra) {
    this.setHeight(Math.round(w/this._get("orgWidth")*this._get("orgHeight")),true);
  }
  var oldW=this._get("width");
  this._setn("width",w);
  if(this._get("doCrop")) {
    this.setCropScaleX(w/oldW);
  }
}
ImageData.prototype.setOrgWidth=function(w) {
  this._setn("orgWidth",w);
  if(this._get('width')==null) this._setn("width",w);
}
ImageData.prototype.setPctHeight=function(h) {
  this.setHeight(Math.round(h*this._get("orgHeight")));
}
ImageData.prototype.setHeight=function(h,skipAsra) {
  var yScale=h/this._get("height");
  if(this._get("lockAsra")&&!skipAsra) {
    this.setWidth(Math.round(h/this._get("orgHeight")*this._get("orgWidth")),true);
  }
  var oldH=this._get("height");
  this._setn("height",h);
  if(this._get("doCrop")) {
    this.setCropScaleY(h/oldH);
  }
}
ImageData.prototype.setOrgHeight=function(h) {
  this._setn("orgHeight",h);
  if(this._get('height')==null) this._setn("height",h);
}
ImageData.prototype.setLockAsra=function(locked) {
  this._set("lockAsra",locked);
}
ImageData.prototype.setOrgSize=function(w,h) {
  this.setOrgWidth(w);
  this.setOrgHeight(h);
}
ImageData.prototype.resetOrgSize=function() {
  this._setn("width",this._get("orgWidth"));
  this._setn("height",this._get("orgHeight"));
}
//--| Crop |--------------------------------------------------------------------
ImageData.prototype.setDoCrop=function(doCrop) {  
  this._setDefault("cropX1",0);
  this._setDefault("cropY1",0);
  this._setDefault("cropX2",this._get("width"));
  this._setDefault("cropY2",this._get("height"));
  this._setDefault("cropWidth",this._get("width"));
  this._setDefault("cropHeight",this._get("height"));
  this._setDefault("cropRight",0);
  this._setDefault("cropBottom",0);
  this._setb("doCrop",doCrop);
}
ImageData.prototype.setCropScaleX=function(f) {
  this.setCropX1(Math.round(this._get("cropX1")*f));
  this.setCropX2(Math.round(this._get("cropX2")*f));
}
ImageData.prototype.setCropScaleY=function(f) {
  this.setCropY1(Math.round(this._get("cropY1")*f));
  this.setCropY2(Math.round(this._get("cropY2")*f));
}
ImageData.prototype.setCropX1=function(x1) {  
  this._setn("cropX1",x1);
  this._setn("cropWidth",this._get("cropX2")-x1);
}
ImageData.prototype.setCropY1=function(y1) {  
  this._setn("cropY1",y1);
  this._setn("cropHeight",this._get("cropY2")-y1);
}
ImageData.prototype.setCropX2=function(x2) {  
  this._setn("cropX2",x2);
  this._setn("cropWidth",x2-this._get("cropX1"));
  this._setn("cropRight",this._get("width")-x2);
}
ImageData.prototype.setCropY2=function(y2) {  
  this._setn("cropY2",y2);
  this._setn("cropHeight",y2-this._get("cropY1"));
  this._setn("cropBottom",this._get("height")-y2);
}
ImageData.prototype.setCropWidth=function(cw) {  
  this._setn("cropWidth",cw);
  this._setn("cropX2",cw+this._get("cropX1"));
  this._setn("cropRight",this._get("width")-cw-this._get("cropX1"));
}
ImageData.prototype.setCropHeight=function(ch) {  
  this._setn("cropHeight",ch);
  this._setn("cropY2",ch+this._get("cropY1"));
  this._setn("cropBottom",this._get("height")-ch-this._get("cropY1"));
}
ImageData.prototype.setCropRight=function(cr) {  
  this._setn("cropRight",cr);
  this._setn("cropWidth",this._get("width")-cr-this._get("cropX1"));
  this._setn("cropX2",this._get("width")-cr);
}
ImageData.prototype.setCropBottom=function(cb) {  
  this._setn("cropBottom",cb);
  this._setn("cropHeight",this._get("height")-cb-this._get("cropY1"));
  this._setn("cropY2",this._get("width")-cb);
}

//--| ObservedModel methods |---------------------------------------------------
ImageData.prototype._setupObservedModel=function() {
  //--| Setup ObservedModel stuff
  this.observers={};  //Hash(property name) of arrays(callbacks) 
  this.properties={}; //Hash(property name) of properties
}
ImageData.prototype._setb=function(property,value) {
  if(typeof value=='boolean') {
    this._set(property,value);
  }
  else {
    error("Setting property '"+property+"' with non-boolean value '"+value+"'");
    this._notify(property);
  }
}
ImageData.prototype._setn=function(property,value) {
  if(typeof value=='number'&&!isNaN(value)) {
    this._set(property,value);
  }
  else {
    error("Setting property '"+property+"' with non-numeric value '"+value+"'");
    this._notify(property);
  }
}
ImageData.prototype._set=function(property,value) {
  if(this.properties[property]!=value) {
    this.properties[property]=value;
    this._notify(property);
  }
}
ImageData.prototype._setDefault=function(property,value) {
  if(typeof this.properties[property]=="undefined") {
    this.properties[property]=value;
    this._notify(property);
  }
}
ImageData.prototype._notify=function(property) {
  for(var i in this.observers[property]) {
    this.observers[property][i](this.properties[property]);
  }
  for(var i in this.observers["*"]) {
    this.observers["*"][i](this.properties[property],property);
  }
}
ImageData.prototype._get=function(property) {
  return this.properties[property];
}
ImageData.prototype._gets=function(property) {
  var a=[];
  for(var i=0; i<arguments.length; i++) a.push(this._get(arguments[i]));
  return a;
}
ImageData.prototype.registerObserver=function(property,callback) {
  if(!this.observers[property]) {
    this.observers[property]=[];
  }
  this.observers[property].push(callback);
}
ImageData.prototype.unregisterObserver=function(property,callback) {
  var cb=this.observers[property];
  if(!cb) {
    warn("Observer wants to unregister for unknown property");
    return;
  }
  for(var i=0; i<cb.length; i++) {
    if(cb[i]==callback) {
      this.observers.splice(i,1);
      return;
    }
  }
  warn("Unknown observer wants to unregister");  
}