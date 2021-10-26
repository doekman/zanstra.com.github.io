/*iteration is not re-entrant*/
function POTW() {
  this.arrPI=arrPhotoIndex;
  this.intPIFirstWeek=27;// 9 juli..15juli, count from 0
  this.intWeekNr=0;

  this.moveFirst=POTW_moveFirst; 
  this.moveLast=POTW_moveLast;
  this.movePrev=POTW_movePrev;
  this.moveNext=POTW_moveNext;
  this.moveTo=POTW_moveTo;
  this.cursorPos=POTW_cursorPos;
  //--| retrieval
  this.weekNrCards=POTW_weekNrCards;
  this.weekNrOrdinal=POTW_weekNrOrdinal;
  this.image=POTW_image;
  this.description=POTW_description;
}

function POTW_moveFirst() { this.intWeekNr=0; return this.arrPI.length>0; }
function POTW_moveLast() { this.intWeekNr=this.arrPI.length-1; return this.arrPI.length>0; }
function POTW_movePrev() { if(this.intWeekNr==0) { return false; } else { this.intWeekNr--; return true; } }
function POTW_moveNext() { if(this.intWeekNr==this.arrPI.length-1) { return false; } else { this.intWeekNr++; return true; } }
function POTW_moveTo(i) { if(i>=0&&i<this.arrPI.length) { this.intWeekNr=i; return true; } else { return false; } }
function POTW_cursorPos() { return this.intWeekNr; }
function POTW_weekNrCards() { return weekNr2Card(this.weekNrOrdinal()-1); }
function POTW_weekNrOrdinal() { return this.intWeekNr+this.intPIFirstWeek+1; }
function POTW_image() { return this.arrPI[this.intWeekNr].img; }
function POTW_description() { return this.arrPI[this.intWeekNr].description; }

var arrPhotoIndex=
  [ {img:'../fotos/potw/giropas-zonder-chipper.jpg',description:'Giropas zonder chipper, maar pinnen werkt nog steeds goed.<br><font color=gray>(inderdaad Hans, dit is het effect van een groothoeklens).</font>'}
  , {img:'../fotos/potw/doeke-spacy.jpg',description:'Spacy.'}
  , {img:'../fotos/potw/andersom-inge.jpg',description:'Het fototoestel andersom houden, Inge!'}
  , {img:'../fotos/potw/pauwen.jpg',description:'Pauwen bij de Menkemaborg, Uithuizen, Groningen.'}
  , {img:'../fotos/potw/janke.gif',description:'Mijn tante Janke, gefotografeerd met m\'n Lomo Cyber Sampler'}
  , {img:'../fotos/potw/happyWalker.jpg',description:'Lampen bij Happy Walker, Groningen<br><font color=gray>(zo zie je maar dat bijvoorbeeld sluitertijd een handige optie is, die ik niet heb<img src="../img/smileySad.gif">)</font>'}
  , {img:'../fotos/potw/tuintjeTroost.jpg',description:'Als troost voor mijn <em>tuintje</em><br><font color=gray>(voor de ingewijden...)</font>'}
  , {img:'../fotos/potw/eenKratGladiolen.jpg',description:'Yиииииииииииииииииииииииииииииииииp,<br>Eйn krat gladiolen.'}
  , {img:'../fotos/potw/basBoos.jpg',description:'Leuk hи Bas, op de foto gezet te worden...'}
  , {img:'../fotos/potw/deadRat.jpg',description:'Een stukje uit de animatie <em>Deadrat Lives, the Silence of the Strings</em> (episode 3).<br><font color=gray>Zie <a style="color: gray" href="http://www.hoving.com/deadrat.html">hoving.com</a> voor de Flash filmpjes.</font>'}
  , {img:'../fotos/potw/bbMotor.jpg',description:'Blauwbaard op weg op zijn motor naar het kasteel (toen de sleutel ging bloeden)<br><font color=gray>Geript van <a style="color: gray" href="http://www.jeroendeen.nl/work.htm">jeroendeen.nl</a>.</font>'}
  , {img:'../fotos/potw/zanst001.jpg',description:'<nobr>Picollo Doeke (tot voor kort KPN Internet Center identiteit)</nobr><br><nobr><font color=gray title="Hans Marks">MS-Paint montage van Harl Marx\' <a href="http://www.xs4all.nl/~jrmarks/week/2001/page.html?title=Week&first=1&last=35&target=24" style="color: gray">Foto van de week</a>.</font></nobr>'}
  , {img:'../fotos/potw/plaatje.png',description:'<nobr>Neem deze <strong>gewиииldige</strong> uitdrukking van expressie...<br><font color=gray>Euh, uitdrukking, expressie, je begrijpt het al, volgende week beter...</nobr>'}
  , {img:'../fotos/potw/doekeEnCobi.jpg',description:'Doeke en nichtje <a href="mailto:c_leijstra@yahoo.com?subject=Foto van de week&body=http://www.xs4all.nl/~zanstra/potw/index.htm?potw=13">Cobi</a> op bezoek bij Oompje en Tantetje in Paterwolde.'}
  , {img:'../fotos/potw/kattendiepBijNacht.jpg',description:'Gedempte Kattndiep bij nacht.'}
  , {img:'../fotos/potw/zen.gif',description:'<nobr>Zen, and the art of floor maintenance</nobr><br><nobr><font color=gray>Ripped from <a href="http://www.groovechamber.com/flash4/zen.htm" style="color: gray">groovechamber.com</a></nobr><br><nobr>(with the sheep on caffeine)</nobr>'}
  , {img:'../fotos/potw/blackie.jpg',description:'Blackie, mijn nieuwe hond.<br><font color=gray>door IME Dijkslag, oktober 2001</font>'}
  , {img:'../fotos/potw/darthVader.jpg',description:'<a href="http://www.musicman.nl/">Tabe</a> in <a href="http://www.starwars.com/episode-v/">gevecht</a> met <a href="http://home.wish.net/~bhaarlem/starwars/personen/anakin_skywalker.htm">Darth Vader</a> van echt <a href="http://home.zonnet.nl/ericbrok/legomind/index.htm">LEGO</a> in <a href="http://www.lego.com/legoland/billund/defaultus.asp">Legoland</a>.'}
  , {img:'../fotos/potw/2bier.gif',description:'2 bier<br><nobr><font color=gray>Ripped from <a href="http://www.smileys.nl/" style="color: gray">smileys.nl</a></font></nobr>'}
  , {img:'../fotos/potw/doekMobiel.jpg',description:'Doekman to the rescue!!!<br><font color=gray>Wel computerwerk, maar <a href="http://www.deendesign.nl/" title="Voor al uw snijplotter werk" style="color: gray">anders dan je denkt</a>.</font>'}
  , {img:'../fotos/potw/baltasar.jpg',description:'Goeiesnavons buurman.'}
  , {img:'../fotos/potw/bankje.jpg',description:'Ik houd altijd de helicopterview...'}
  , {img:'../fotos/potw/bier.jpg',description:'Bier in wording<br><font color=gray>De helft van de rechterfles haalt het flesje<br>(de rest einigt tussen en onder de tegels</font>'}
  , {img:'../fotos/potw/niceBar.jpg',description:'Dat wil ik thuis ook<br><font color=gray>Alleen niemand vult het aan...</font>'}
  , {img:'../fotos/potw/mannen.jpg',description:'Dzjoe-man, Omke Bjokkel en Freddy.'}
  , {img:'../fotos/potw/homelessCat.jpg',description:'Dakloze kat (dooskat) Smikey.'}
  ];

/*
harten: lente, 
klaver: zomer, 
schoppen: herfst, 
ruiten: winter
week 1: 21 maart
*/

var arrCard=['2','3','4','5','6','7','8','9','10','B','V','H','A'];
var arrSuit=['&hearts;','&clubs;','&spades;','&#9830;'];
var intFirstWeek=12; //which week is 2 of hearts (when the spring starts)
function weekNr2Card(intWeekNr) {
  var intCard, intSuit;
  intWeekNr=(parseInt(intWeekNr,10)-intFirstWeek)%52; /*weeknr van 0 t/m 51*/
  intCard=intWeekNr%arrCard.length;
  intSuit=parseInt(intWeekNr/arrCard.length,10);
  return '<span style="font-family: sans-serif; color:'+(intSuit==0||intSuit==3?'red':'black')+'">'+arrCard[intCard]+arrSuit[intSuit]+'</span>';
}