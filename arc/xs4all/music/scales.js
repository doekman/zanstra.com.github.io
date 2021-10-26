var arrScale = [
	{name:'MAJEUR', arrAfstand:null },
	{name:'ionisch (majeur)', arrAfstand:[2,2,1,2,2,2,1] },
	{name:'lydisch (F)', arrAfstand:[2,2,2,1,2,2,1] },
	{name:'myxolidisch (G)', arrAfstand:[2,2,1,2,2,1,2] },

	{name:'MINEUR', arrAfstand:null },
	{name:'dorisch (D)',arrAfstand:[2,1,2,2,2,1,2] },
	{name:'phrygisch (E)', arrAfstand:[1,2,2,2,1,2,2] },
	{name:'aeolisch (A)', arrAfstand:[2,1,2,2,1,2,2] },
	{name:'mineur harmonisch (A)', arrAfstand:[] },
	{name:'mineur melodisch (A)', arrAfstand:[] },
	{name:'locrisch (B)', arrAfstand:[1,2,2,1,2,2,2] },

	{name:'OVERIGE', arrAfstand:null },
	{name:'blues',  arrAfstand:[3,2,1,1,3,2] },
	{name:'blues pentatonisch',  arrAfstand:[3,3,1,3,2] },
	{name:'chromatisch', arrAfstand:[1,1,1,1,1,1,1,1,1,1,1,1] }
];

function checkScales() {
	var intTotal;
	for(var i=0; i<arrScale.length; i++) {
		intTotal=0;
    if(arrScale[i].arrAfstand!=null) {
      for(var j=0; j<arrScale[i].length; j++) {
        intTotal+=arrScale[i][j];
      }
      if(intTotal!=12&&arrScale[i].arrAfstand.length!=0) {
        //als de opgetelde afstanden samen ongelijk aan 12 zijn
        //en als er elementen in het array staan, klopt er iets niet.
        alert('De "toonladder" '+arrScale[i].name
          +' is geen toonladder. De som van de afstanden is ongelijk aan 12 (som is '+intTotal
          +'). \n\nOp deze pagina kunnen alleen 12-tonige ladders gebruikt worden.'
        );
      }
    }
  }
}