//--| Style |------------------------------------------------------------------
//Creates a style object, and parses the CSS <s> text
//FIXME: also check if a property does exist for a certain scope (chart, shape, line)? 
function Style(s) {
  var a=s.split(';');
  for(var i=0; i<a.length; i++) {
    var dash,b=a[i].split(':',2);
    if(b.length==2) {
      var name=b[0].replace(/^\s+|\s+$/g,'');
      var value=b[1].replace(/^\s+|\s+$/g,'');
      //convert from css-style to javascriptStyle
      while((dash=name.indexOf('-'))!=-1) {
        ch=name.substr(dash+1,1);
        name=name.replace('-'+ch,ch.toUpperCase());
      }
      //set property (either shorthand property, or direct)
      if(this["psp_"+name]) this["psp_"+name](value);
      else this[name]=value;
    }
  }
}
//--| psp == parse shorthand property (not playstation portable)
Style.prototype.psp_padding=function(value) {
  var c=this.splitOneFour(value);
  this.paddingTop=c[0];
  this.paddingRight=c[1];
  this.paddingBottom=c[2];
  this.paddingLeft=c[3];
}
Style.prototype.psp_margin=function(value) {
  var c=this.splitOneFour(value);
  this.marginTop=c[0];
  this.marginRight=c[1];
  this.marginBottom=c[2];
  this.marginLeft=c[3];
}
Style.prototype.psp_border=function(value) {
  var c=value.split(/\s+/);
  this.borderWidth=c[0];
  this.borderStyle=c[1];
  this.borderColor=c[2];
}
//--| Convert a margin/padding list to 4 values
Style.prototype.splitOneFour=function(s) {
  var a=s.split(/\s+/), b;
  //FIXME: check on correct length value+unit
  switch(a.length) {
    case 1: b=[a[0],a[0],a[0],a[0]]; break;
    case 2: b=[a[0],a[1],a[0],a[1]]; break;
    case 3: b=[a[0],a[1],a[2],a[1]]; break;
    case 4: b=a; break;
    default:throw new Error("Wrong padding format (1..4 digits, "+a.length+" supplied): "+value);
  }
  return b;
}
Style.prototype.toString=function(n) {
  var a=[];
  for(var i in this) {
    if(this.hasOwnProperty(i)) {
      a[a.length]="  "+i+' -> '+this[i];
    }
  }
  return a.join('\n');
}
Style.prototype.getValue=function(s) {
  if(this[s]) return +this[s].replace(/[^-0-9]/g,'');
  else return null;
}
