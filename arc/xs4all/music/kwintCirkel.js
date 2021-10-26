/*Class kwintencirkel
**Uses: keys.js, kwintCirkel.css
*/
function Kwintencirkel(radius,left,top) {
  this.currentKey=null;
  this.intRadius=radius; //in pixels
  this.intLeft=left; //from left upper 
  this.intTop=top; 
  this.intSelectorSize=30; //width and height of the selector in pixel
  this.insertHTML=Kwintencirkel_insertHTML;
  this.pressKey=Kwintencirkel_pressKey;
}
function Kwintencirkel_insertHTML(id) {
  var s, left, top, size, note;
  size=this.intRadius+this.intSelectorSize;
  s='';
  for(var i=0; i<12; i++) {
    left=parseInt(Math.sin(i*Math.PI/6)*this.intRadius,10) + this.intLeft+this.intRadius;
    top=parseInt(Math.cos(i*Math.PI/6)*this.intRadius,10)*-1 + this.intTop+this.intRadius;
    note=i*7%12;
    s+=divKey(note,left,top,this.intSelectorSize);
  }
  document.getElementById(id).innerHTML=s;
}

function Kwintencirkel_pressKey(n) {
  var oKey;
  n=parseInt(n,10)%12;
  if(this.currentKey!=null) {
    oKey=document.getElementById('kwint'+this.currentKey);
    oKey.style.fontWeight='normal';
    oKey.style.color='Black';
  }
  oKey=document.getElementById('kwint'+n);
  oKey.style.fontWeight='bold';
  oKey.style.color='Red';
  this.currentKey=n;
}

/*private*/ 
function divKey(n,left,top,size) {
  return '<div class="kwintSelector" id="kwint'+n+'" style="left:'+left+'px; top:'+top+'px; width:'+size+'px; height:'+size+'px">'+getKey(n)+'</div>\n';
}

function obj2str(o,r) {
  var s=''; 
  for(var i in o) { 
    if(!r||r.test(i)) {
      s+=i+': '+o[i]+'\n'; 
  } }
  return s;
}