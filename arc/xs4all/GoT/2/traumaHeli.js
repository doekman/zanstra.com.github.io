var n=parseInt(WScript.StdIn.ReadLine(),10); //aantal huizen
var dx=0, dy=0; //delta-x, delta-y: de som van de x en y coordinaten
//n is max 2 miljoen, elke x en elke y is min. -1000 en max. 1000
//dus dx is minimaal 2 miljoen keer -1000 en max 2 miljoen keer 1000
//dir is dus plus en min 2 miljard, en past dus mooi in een signed 32-bit integer, 
//en dus gemakkelijk in een signed 64 bit double-ding zonder mantise.
//zelfde geldt voor dy
for(var i=0; i<n; i++) //i zou niet eens hoeven, maar toch graag controle over een foute file...
{
  var a=WScript.StdIn.ReadLine().split(' ');
  dx+=parseInt(a[0],10);
  dy+=parseInt(a[1],10);
}
WScript.StdOut.Write( Math.round(dx/n) + ' ' + Math.round(dy/n) );