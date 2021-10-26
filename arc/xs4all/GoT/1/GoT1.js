var sNewLine='\r\n';
/*constructor*/ function GoT1(s) {
  var arr;
//--| Properties
//var nB, nH;
//var aKolom, aRij;
//var aSolution;
//--| Methods
  this.process=GoT1_process;
  this.zoekKolomBlok=GoT1_zoekKolomBlok;
  this.kanKolomSchuiven=GoT1_kanKolomSchuiven;
  this.vertShift=GoT1_vertShift;
  this.zoekRijBlok=GoT1_zoekRijBlok;
  this.kanRijSchuiven=GoT1_kanRijSchuiven;
  this.horShift=GoT1_horShift;
  this.strSol=GoT1_strSol;

//--| Verwerk inputstring in gegevensstructuur
//zoek breedte en hoogte
  i=s.indexOf(' ');
  this.nB=parseInt(s.substring(0,i),10);
  j=s.indexOf(sNewLine,i+1);
  this.nH=parseInt(s.substring(i,j),10);
//Verzamel de  kolom data
  this.aKolom=[];
  for(var k=0;k<this.nB;k++) {
    i=j+sNewLine.length; 
    j=s.indexOf(sNewLine,i);
    this.aKolom[k]=i>=j?[]:s.substring(i,j).split(' '); //split atleast returns array of lenght 1
    for(var l=0; l<this.aKolom[k].length; l++) {
      this.aKolom[k][l]=parseInt(this.aKolom[k][l],10); //convert to int
    }
  }
//Verzamel de  rij data
  this.aRij=[];
  for(var k=0;k<this.nH;k++) {
    i=j+sNewLine.length; 
    j=s.indexOf(sNewLine,i);
    if(j==-1) j=s.length; //EOString
    this.aRij[k]=i>=j?[]:s.substring(i,j).split(' ');
    for(var l=0; l<this.aRij[k].length; l++) {
      this.aRij[k][l]=parseInt(this.aRij[k][l],10); //convert to int
    }
  }

//--| initialiseer oplossings-array
  var idBlok=1;
  this.aSolution=[];
  //aSolution[rowIndex][colIndex]=number:0x##$$
  //## is blockid of column, $$ is blockid of row
  //for 8 bits, max dimension is 22 (either hor. or vert. or both)
  //for 30x30, we need 16 bits.
  //Eerst rijen invullen [RIJ,0]

  for(var rij=0; rij<this.nH; rij++) //voor elke rij
  {
    var kol=0;
    this.aSolution[rij]=[]; //elke rij krijgt cellen
    for(var i=0; i<this.aKolom[rij].length; i++) //voor elk blokje in de rij
    {
      for(var j=0; j<this.aKolom[rij][i]; j++)
      {
        this.aSolution[rij][kol++]=idBlok; //1st 8 bits
      }
      idBlok++;
      if(kol<this.nB) this.aSolution[rij][kol++]=0x00; //lege ruimte
    }
    while(kol<this.nB) //rij afvullen met lege ruimte
    {
      this.aSolution[rij][kol++]=0x00;
    }
  }

  //Nu kolommen invullen [RIJ,0]
  idBlok=1<<8;
  for(var kol=0; kol<this.nB; kol++) //voor elke rij
  {
    var rij=0;
    for(var i=0; i<this.aRij[kol].length; i++) //voor elk blokje in de rij
    {
      for(var j=0; j<this.aRij[kol][i]; j++)
      {
        this.aSolution[rij++][kol]|=idBlok; //set 2nd set of bits
      }
      idBlok+=1<<8; 
      if(rij<this.nH) rij++; //lege ruimte, reeds op nul gezet
    }
    //kolom hoeft meer afgevuld te worden
  }
}

function GoT1_strSol(s) {
  var a=[]; 
  for(var i=0; i<this.aSolution.length; i++) {
    a.push('['+this.aSolution[i].hexJoin('|',4)+']');
  }
  return a.join(s);
}

//--| Kolom methods |---------------------------------------------------

function GoT1_zoekKolomBlok(kol,rij) {
//zoek kolom blok, op, of voor (kol,rij)
  var blokId;
  //zoek eerst blok
  for(var i=rij; i>=0; i--) {
    if(!this.aSolution[i][kol]&0xff) { //kolom-blok vrij?
      blokId=this.aSolution[i][kol]&0xff00; //is het uberhaupt wel een kolom-blok
      if(blokId) break; //blok gevonden, en het is vrij
    }
  }
  if(!blokId) return; //geen blok gevonden
  //nu begin blok vinden
  while(i>0) {
    if(this.aSolution[i-1][kol]&0xff00) i--;
    else return i; //begin blok gevonden
  }
  return 0; //return i, blok begint bij rand.
}

function GoT1_kanKolomSchuiven(kol,rij) {
  return !(this.aSolution.top()[kol]&0xff00)
}

function GoT1_vertShift(kol,rijVan) {
//--| ga nu daadwerkelijk schuiven, van onder (rijTot, tot en met) naar boven (rijVan, vanaf) werken.
  for(var j=this.aSolution.length; j>rijVan; j--) {
    this.aSolution[j][kol]=this.aSolution[j-1][kol]&0xff00 | this.aSolution[j][kol]&0xff;
  }
  this.aSolution[j][kol]&=0xff;
}

//--| Rij methods |-------------------------------------------------------

function GoT1_zoekRijBlok(kol,rij) {
//Zoek het eerste vrije punt in de rij
  var vakVrij=0;
  for(var i=kol; i<this.aSolution[rij].length; i++) {
    if(this.aSolution[rij][i]&0xff) vakVrij=0;
    else vakVrij++;
    if(vakVrij==2) return i-1;
    else if(vakVrij==1&&i==this.aSolution[rij].length-1) return i;
  }
}

function GoT1_kanRijSchuiven(kol,rij) {
  return !(this.aSolution[rij].top()&0xff)
}

function GoT1_horShift(kol,rij) {
  for(var i=this.aSolution[rij].length-1; i>kol; i--) {
    this.aSolution[rij][i]=this.aSolution[rij][i]&0xff00 | this.aSolution[rij][i-1]&0xff;
  }
  this.aSolution[rij][i]&=0xff00;
}

//--| Het oplos algoritme |-----------------------------------------------

function GoT1_process() {
  for(var i=0; i<3 /*this.aSolution.length*/; i++) { //one row at a time
    for(var j=0; j<this.aSolution[i].length; j++) { //check each cell in row
      var cell=this.aSolution[i][j]; 
      while(!(cell&0xff00) && cell&0xff) { 
        var k=undefined, canShift;
        //--| volgens rij kan er hier een blok staan, volgens kolom is het niet bekend
        //--| probeer eerst een kolom-blok van boven naar beneden te schuiven
        //is er wat naar beneden te schuiven?
        if(i>0) { //is er hier ruimte boven?
          k=this.zoekKolomBlok(j,i)
          if(k!=null) {
            //is er ruimte om dit naar beneden te schuiven?
            canShift=this.zoekRuimteKolom(j,k);
          }
        }
        if(k==null||!canShift) {
          //kan geen passend kolom blokje vinden. blokje naar volgende kolom doorschuiven
          //(dit kan altijd, omdat er een oplossing moet zijn)
          //maw: geen kolomblok beschikbaar, schuif rijblok naar rechts.
          this.horShift(j,i); 
          break; 
        }
        else {
          this.vertShift(j,k);
        }        
      }
    }
    if(i==2&&j==1) return;//debug
  }
}