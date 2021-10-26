/*
** Class GuitarNeck
** uses: keys.js, GuitarNeck.css
*/
function GuitarNeck() {
/*private variables*/
  this.intBars=12;
  this.arrNeck=[[],[],[],[],[],[],[],[],[],[],[],[]];
  this.arrString=[
    {afstand:4,string:'E2'},
    {afstand:9,string:'A'},
    {afstand:14,string:'D'},
    {afstand:19,string:'G'},
    {afstand:23,string:'B'},
    {afstand:28,string:'E'}
  ]; //afstand vanaf 0 (=c1)

/*methods*/
  this.insertHTML=GuitarNeck_insertHTML;
  this.pressKeys=GuitarNeck_pressKeys;
  this.releaseAllKeys=GuitarNeck_releaseAllKeys;
}

function GuitarNeck_insertHTML(idElement) {
  var s='', id, note;
  s+='<table class="neck" onselectstart="return false;">';
  for(var i=this.arrString.length-1; i>=0; i--) {
    s+='<tr>';
    for(var j=0; j<this.intBars; j++) {
      id=this.arrString[i].string+j;
      note=(this.arrString[i].afstand+j+1)%12; //plus 1, want als je op het eerste hokje van de E drukt, krijg je een F
      s+='<td class="vinger" id="'+id+'" title="'+getKey(note)+'">o</td>';
      this.arrNeck[note][this.arrNeck[note].length]=id;
    }
    s+='</tr>';
  }
  s+='</table>';
  ID(idElement).innerHTML=s;
}

function GuitarNeck_pressKeys(n,blnHigh) {
//press the keys n (n=0, press all C's)
	var o;
	n=parseInt(n,10)%12;
  if(typeof blnHigh=='undefined') blnHigh=false;
	for(var j=0; j<this.arrNeck[n].length; j++) {
		o=ID(this.arrNeck[n][j]);
    o.style.color=blnHigh?'red':'black';
	}
}

function GuitarNeck_releaseAllKeys() {	
	for(var i=0; i<this.arrNeck.length; i++) {		
		for(var j=0; j<this.arrNeck[i].length; j++) {
			o=ID(this.arrNeck[i][j]);
      o.style.color='white';
		}
	}
}