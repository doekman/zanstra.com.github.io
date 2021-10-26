// Project Snowstorm
// ----------------------------------------------
// Gathering of Tweakers, W&G 2002
// http://gathering.tweakers.net


var aTileLib=['tile1','tile2','tile-yellow','tile-red','tile-green','tile-blue','tile-white'];
// snel wat level data defineren
var oLevel = {
	// Level via xml laden?
	'width':7,
	'height':9
}
var aBackgroundA=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var aBackgroundB=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

// wat waardes
var oMap;
var iTileWidth = 128,
	iTileHeight = 64,
	iScreenWidth = 640,
	iScreenHeight = 480;

// Init
// ----------------------------------------------
function changeActiveTile()
{
  var o=event.srcElement; //selected element
  var p=document.getElementById('tilePallet');
  var q=document.getElementById(p.activeTile); //active element

  if(o==q) return; //already selectyed
  if(o.tagName!='IMG') return;

  q.className='tile';
  o.className='tileActive';
  p.activeTile=o.id;
  window.status='Selected Tile: '+o.id;
}

function saveLevel(sId)
{
  var o=document.getElementById(sId);
  o.value='var aBackgroundA=['+aBackgroundA.join(',')+'];\n';
  o.value+='var aBackgroundB=['+aBackgroundB.join(',')+'];';
}
function handleTile(sId,nTile,bIsA)
{
  var oTile=document.getElementById(sId);
  var p=document.getElementById('tilePallet');
  oTile.src='images/'+p.activeTile+'.gif';
  if(bIsA) aBackgroundA[nTile]=getTileNr(p.activeTile);
  else aBackgroundB[nTile]=getTileNr(p.activeTile);
}

function getTileNr(s)
{
  for(var i=0; i<aTileLib.length; i++)
  {
    if(aTileLib[i]==s) return i;
  }
  return -1;
}
function initPallet()
{
  var o=document.getElementById('tilePallet');
  o.activeTile=aTileLib[3];
  for(var i=0; i<aTileLib.length; i++)
  {
    var t=document.createElement('img');
    t.id=aTileLib[i];
    t.src='images/'+aTileLib[i]+'.gif';
    t.attachEvent('onclick',changeActiveTile);
    if(aTileLib[i]==o.activeTile)
    {
      t.className='tileActive';
    }
    else
    {
      t.className='tile';
    }
    o.appendChild(t);
  }
}
function initWorldMap() {
	// nieuwe map
	oMap = new map(oLevel.width, oLevel.height);
	
	// map mover (tijdelijk)
  initPallet();

	var oMapDiv=document.getElementById('mapContainer');
  oMapDiv.attachEvent('onmousemove', moveTheMap);

}

document.attachEvent('onload', initWorldMap);

// Map object
// ----------------------------------------------
function map(w, h) {
	this.width = w + 1;
	this.height = h + 1;
	this.tiles = this.width * this.height;

	this.pixelWidth = this.width * iTileWidth;
	this.pixelHeight = this.height * iTileHeight;
	this.container = attachObject('mapContainer');

	this.build();
}

mapProto = map.prototype;
mapProto.build = function() {
	// 2 tables over elkaar heen voor perspectief
	var htmlStart = '<table border=0 cellspacing=0 cellpadding=0><tr>';
	var htmlEnd  = '</tr></table>';
	var mapA =  mapB = htmlStart;

	for(var i=0; i<this.tiles; i++) {
		if(i!=0 && i%this.width == 0) {
			mapA += '</tr><tr>';
			mapB += '</tr><tr>';
		}

		// de ene
		mapA += '<td><img src="images/'+aTileLib[aBackgroundA[i]]+'.gif" id="tileA'+i+'"></td>';
		
		// de andere, heeft iets minder tiles nodig
		if(i%this.width != 1 && i < this.tiles - this.width)
			mapB += '<td>'+createClickableTile(aTileLib[aBackgroundB[i]],i)+'</td>'
	}	
	
	mapA += htmlEnd;
	mapB += htmlEnd;

  // write map/area

	// schrijven
	attachObject('mapContentA').write(mapA)
	attachObject('mapContentB').write(mapB)


	// movement van map beperken
	with(this.container) {
		setProperties(-64,-32, this.pixelWidth, this.pixelHeight, 'visible');
		limitMovement(
			iScreenWidth - this.pixelWidth + iTileWidth/2, 
			iScreenHeight - this.pixelHeight + iTileHeight/2, 
			this.pixelWidth - iTileWidth/2, 
			this.pixelHeight - iTileHeight/2
		)
	}
}
function handleClick(nTile,nPos)
{
  var sTileId;
  switch(nPos)
  {
    case 0:
      sTileId='tileB'+nTile;
      break;
    case 1: //top right
      sTileId='tileA'+(nTile);
      break;
    case 2: //bottom right
      sTileId='tileA'+(nTile+oLevel.width+1);
      break;
    case 3: //bottom left
      sTileId='tileA'+(nTile+oLevel.width);
      break;
    case 4: //top left
      sTileId='tileA'+(nTile-1)
      break;
  }
  if(sTileId) handleTile(sTileId,nTile,nPos!=0);
  window.status='Tile nr '+nTile+' clicked at '+nPos;
}
function createClickableTile(sName,nTile)
{
  return '<img src="images/'+sName+'.gif" id="tileB'+nTile+'" usemap="#diamond'+nTile+'" />'
        +'<map name="diamond'+nTile+'">'
        +'<area shape="poly" coords="64,0,128,32,64,64,0,32" href="#" onclick="handleClick('+nTile+',0); blur(); return false;" />'
        +'<area shape="poly" coords="64,0,128,0,128,32" href="#" onclick="handleClick('+nTile+',1); blur(); return false;" />'
        +'<area shape="poly" coords="128,32,128,64,64,64" href="#" onclick="handleClick('+nTile+',2); blur(); return false;" />'
        +'<area shape="poly" coords="64,64,0,64,0,32" href="#" onclick="handleClick('+nTile+',3); blur(); return false;" />'
        +'<area shape="poly" coords="0,0,64,0,0,32" href="#" onclick="handleClick('+nTile+',4); blur(); return false;" />'
        +'</map>';
}

mapProto.getTile = function() {
}
function coord2str(x,y) { return '('+x+','+y+')'; }

var oldX = 0, oldY= 0;

// tijdelijke mover
function moveTheMap() {
	if(!oldX || !oldY) {
		oldX = mouseX;
		oldY = mouseY;
	} else {
		var dx = mouseX - oldX;
		var dy = mouseY - oldY;

		oldX = mouseX;
		oldY = mouseY;

		oMap.container.moveBy(-dx, -dy);
	}
}