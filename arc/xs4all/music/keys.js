var arrKey=[
	{name:'- #', arr:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] },
	{name:'-is', arr:['C','Cis','D','Dis','E','F','Fis','G','Gis','A','Ais','B'] },
	{name:'- b', arr:['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'] },
	{name:'-es', arr:['C','Des','D','Es','E','F','Ges','G','As','A','Bes','B'] }
];
var intKeyIndex=0;

function getKey(n) {
  n=parseInt(n,10)%12;
  return arrKey[intKeyIndex].arr[n];
}
function ID(s) {
	if(document.getElementById)	return document.getElementById(s);
	else if(document.all) return document.all[s]
	else return null;
}
