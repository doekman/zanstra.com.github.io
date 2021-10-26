//--| StyleRule |-------------------------------------------------------------
function StyleRule(selector,style) {
  this.selector=selector;
  this.style=style;
}
StyleRule.prototype.toString=function() {
  return this.selector+" [\n"+this.style.toString()+"\n]";
}

//--| StyleRules |-------------------------------------------------------------
function StyleRules() {
  this.rules=new Array();
}
StyleRules.prototype.toString=function() {
  return this.rules.join('\n');
}
// selector:  * (all), shape (name of shape), #id (id of item) 
//            might be seperated by , (comma)
StyleRules.prototype.add=function(selector,style) {
  var a=selector.split(/\s*,\s*/);
  for(var i=0; i<a.length; i++) {
    this.rules.push(new StyleRule(a[i],style));
  }
}
StyleRules.prototype.selectWeight=function(selector,shape,id) {
  if(selector=='*') return 1;
  if(selector==shape) return 10;
  if(selector=='#'+id) return 100;
  return 0;
}
// @param property: name of css property (javascript style: fontFamily)
// @param shape: name of shape
// @param id: id of shape
// @param style: style object of shape itself
StyleRules.prototype.getValue=function(property,shape,id,style) {
  if(style&&style[property]) {
    //inline style has biggest weight
    return style[property];
  }
  var bestWeight=1, bestValue=null;
  for(var i=0; i<this.rules.length; i++) {
    var rule=this.rules[i];
    var weight=this.selectWeight(rule.selector,shape,id);
    if(weight>=bestWeight) {
      var value=rule.style[property];
      if(value) {
        bestWeight=weight;
        bestValue=value;
      }      
    }
  }
  return bestValue;
}

StyleRules.prototype.getValueInPx=function(property,shape,id,style) {
  var val=this.getValue(property,shape,id,style);
  if(val) {
    var a=/(\d+)([a-z]+)/i.exec(val);
    if(!a) return 0;
    if(a[2]=='px') return +a[1];
  }
  else {
    return 0;
  }
}
