/*
** Class: Keyboard
** uses: keys.js, Keyboard.css
*/
function Keyboard() {
  this.arrKeyboard=[[],[],[],[],[],[],[],[],[],[],[],[]]; 
  /*array 0..11 where 0=C, 1=C#, ..., 11=B
    arrKeyboard[0] keeps an array of id's (string) of all keys (eg C1, C2, C3)*/
  this.intStartKey=0;
  this.intEndKey=12*3;
/*methods*/
  this.insertHTML=Keyboard_insertHTML;
  this.pressKeys=Keyboard_pressKeys;
  this.releaseAllKeys=Keyboard_releaseAllKeys;
}

function Keyboard_insertHTML(idElement) {
	var s='<table class="keyboard" onselectstart="return false;">';
  var s1='<tr class="whiteAndBlack">', s2='<tr class="whiteOnly">';
	var i, strClass, id, note, colspan;

	for(i=this.intStartKey; i<this.intEndKey; i++) {
    note=i%12;
		switch(note) {
      case 0: case 4: case 5: case 11:
        strClass='white';
        colspan=2;
        break;
      case 2: case 7: case 9:
        strClass='white';
        colspan=3;
        break;
      case 1: case 3: case 6: case 8: case 10:
        strClass='black';
        colspan=2;
        break;
      default:
        if(confirm('foutje.')) return;
    }
    id='key'+i;
    if(strClass=='black') {
      s1+='<td id="'+id+'" class="black" colspan="2" title="'+getKey(note)+'">o</td>';
    }
    else {
      s1+='<td class="whiteTop" title="'+getKey(note)+'">&nbsp;</td>';
      s2+='<td id="'+id+'" colspan="'+colspan+'" class="whiteBottom" title="'+getKey(note)+'">o</td>';
    }
    this.arrKeyboard[note][this.arrKeyboard[note].length]=id;
	}
  s1+='</tr>';
  s2+='</tr>';
	ID(idElement).innerHTML=s+s1+s2+'</table>';
}
function Keyboard_pressKeys(n,blnHigh) {
	var o;
	n=parseInt(n,10)%12;
	if(typeof blnHigh=='undefined') blnHigh=false;
	for(var j=0; j<this.arrKeyboard[n].length; j++) {
		o=ID(this.arrKeyboard[n][j]);
    o.style.color=o.className=='black'?(blnHigh?'red':'white'):(blnHigh?'red':'black')
	}
}

function Keyboard_releaseAllKeys() {	
	for(var i=0; i<this.arrKeyboard.length; i++) {		
		for(var j=0; j<this.arrKeyboard[i].length; j++) {
			o=ID(this.arrKeyboard[i][j]);
			o.style.color=o.className=='black'?'black':'white';
		}
	}
}