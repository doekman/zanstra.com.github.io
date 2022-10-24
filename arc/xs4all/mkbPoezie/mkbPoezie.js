var strImgPath=''; /*change if you're accessing this from another folder*/
var arrMkbPoezie = [
  new Gedicht('Brakke smoel ?\nHaal koffie bij Roel', 'Bij Roel, Oude kijk in\'t Jatstraat 27', 'brakke-smoel.jpg',806,605),
  new Gedicht('We do asbest as we can!', 'Sloopcombinatie Laren BV', 'sloopcombinatieLarenBv.jpg',384,512),
  new Gedicht('In de Winkel van Sinkel is alles te koop:\ndaar kan men krijgen: mandjes met vijgen\ndoosjes pommade. flesjes orgeade.\nhoeden en petten en damescorsetten:\ndrop om te snoepen en pillen om te poepen', 'ANWB bordje, Utrecht', 'winkelVanSinkel.jpg',535,524),
  new Gedicht('HAVERMOUTPAP gereed,\nOntbijt compleet.!', 'Fryslân tijdschrift', 'havermoutGereed.jpg',222,357),
  new Gedicht('Is het kledingstuk niet uw maat?\nDan staat de naaimachine paraat!', '?', 'Afb1186editted.jpg',438,625),
  new Gedicht('Mensen met verstand,\nkopen aan deze kant','Tekst wordt geroepen bij Vishandel Chris Zwier op de vismarkt, Groningen', 'chrisZwier.jpg',373,373),
  new Gedicht('Jak\'s haring,\naltijd een openbaring.','Gelezen op de markt in Schalkwijk, Haarlem (Peter Houben)'),
  new Gedicht('Ieder pondje gaat door het mondje,\ndat geldt ook voor onze kat of ons hondje!','Dierenwinkel in Helpman, Groningen','katjehondje.jpg',458,480),
  new Gedicht('Hij en Zij op een fiets van Klei','Klei Tweewielers, Groningen (Nienke Smidt)','HijEnZij.jpg',599,346),
  new Gedicht('Ons vlees, uw genoegen','(voorheen) Slagerij Bakker, Stoeldraaiersstraat, Groningen (Nienke Smidt)'),
  new Gedicht('Geen gemaar!\nKoopt Deelders waar!','webshop op www.deelder.com','deelder.JPG',161,56),
  new Gedicht('Veel schoen,\nvoor weinig poen!','AXI Schoen, Groningen (Hans M)','VeelSchoen-AxiSchoen.jpg',836,182),
  new Gedicht('Veel schoen,\nvoor weinig poen!','De schoen kampioen, Groningen','veelSchoen.jpg',334,480),
  new Gedicht('Vandaag bestellen,\nmorgen bellen','Actie van www.hi.nl','vandaagBestellen.jpg',155,153),
  new Gedicht('Goed bereid\nkost even tijd.','Cafetaria Züderdaip, Groningen','GoedBereidKostEvenTijd.jpg',640,179),
  new Gedicht('Henk v.d. Scheur,\nVan Deur Tot Deur','Tekst op vrachtauto (Peter Koning)','henkvdscheur.jpg',349,116),
  new Gedicht('Friet van de eeuw,\nHaal je bij Cafetaria "De Meeuw"','Cafetaria De Meeuw (Johan K)','frietVanDeEeuw.jpg',640,474),
  new Gedicht('Laat de auto even staan,\nen loop bij ons aan!!!','Janssen tuindecoratie (Peter Post)','tuindecoratie.jpg',640,480),
  new Gedicht('Voor een paar warme uren ga\nik naar de sauna in PIETERBUREN','Groningen (Peter Post)','warmeUren.jpg',640,480),
  new Gedicht('Veel schoen\nvoor weinig poen','(Peter Post)','veelSchoen.jpg',640,480),
  new Gedicht('Onbetwist uw haringspecialist','Folly Zwier, Groningse Vishandel (vismarkt, foto Peter Post)','onbetwist.jpg',640,480),
  new Gedicht('Europa anders,\nMet Toine Manders','Verkiezingen Europarlement 2004 (Johan K)','manders.jpg',246,349),
  new Gedicht('Meer dan doelloos drinken','Café De Buorren, Langweer (Johan K)','deBuorren.jpg',324,238),
  new Gedicht('Koop bloemen van Ruis,\nniet alleen op de markt,\nmaar ook bij Poiesz','Bloemist te Sneek (Jeroen D)'),
  new Gedicht('Voor boeket groot of klein\nmoet u bij PIET zijn','Bloemist in de Marnixstraat te Amsterdam (Jeroen D)','marnixstraat.jpg',271,209),
  new Gedicht('Goede haring,\nu moet het weten,\nmoet je bij Snip eten.\nEens geprobeerd,\naltijd begeerd.','Snip Junior, (oa) Groninger markt'),
  new Gedicht('Bij Veiling De Westertoren,\nGaat uw geld nimmer verloren','Bilderdijkstraat, Amsterdam-Oud West (Guus Rombouts)'),
  new Gedicht('Al een vat, kist of krat van de Phoenix gehad','Voormalige fabriek Phoenix, Halfweg (Hans Krol)'),
  new Gedicht('Meer cadeau,\nvoor je Euro.','De Slegte, Groningen (Hans M)','cadeauEuro.jpg',640,480),
  new Gedicht('Geen gezeur,\nHandel voor de deur.','Winkeliersvereniging Folkingestraat, Groningen (Hans M)','handelVoorDeDeur.jpg',480,640),
  new Gedicht('Geinig voor weinig','Plato, Groningen (Hans M)','plato.jpg',320,240),
  new Gedicht('Goed bekeken,\nSchilderwerk van Veeken','Veeken Schilderwerken (Geert Jan Z)','veekenSchilderwerken.jpg',500,309),
  new Gedicht('Bij OKAPHONE,\nIs kwaliteit nog heel gewoon','OKAPHONE, Groningen (Hans M)'),
  new Gedicht('Wilt u een belegd broodje, \nMaar u ziet er geen. \nVraag ernaar dan maken \nWij deze meteen....','Kantine Hunze Huys, KPN SWH, Groningen','hhKantine.jpg',291,192),
  new Gedicht('Jan Aal A.G.F. producten houden u gezond en maken u fit.','Groentezaak (Dick A)','janAal.jpg',282,400),
  new Gedicht('Waarom verder gaan,\nHier komt alle goeds vandaan!','Dorpswinkel IJsbrechtum (Jeroen D)'),
  new Gedicht('Hiermee brengen wij in vliegende vaart,\nUw brood, koek, gebak of taart','Bakkerij Kielman, Groningen.'),
  new Gedicht('Betonnoverend dus concurrerend','Schokbeton (Huub R)','schokbeton.gif',720,88),
  new Gedicht('Bel de zoon van Toon.','De zoon van Toon, 073','zoonVanToon.jpg',323,358),
  new Gedicht('Germaan,\nDaar heb je wat aan.','Germaan (motormerk 1896-±1965), Meppel'),
  new Gedicht('Keapje in blomke fan Romke.','Bloemverkoper, Leeuwarden, Fryslân (Jeroen D)'),
  new Gedicht('Loop niet om,\nKoop friet bij Ton','Ergens in Brabant (Dick A)'),
  new Gedicht('Geen gelul,\nGebak van Krul.','Bakker uw slager, Sint Jacobsstraat, Leeuwarden (Henk KH)'),
  new Gedicht('Wie tot 5 kan tellen,\nKan voortaan heel KPN bellen','KPN Werkplekdiensten, Univoice, Nederland','kpn5tellen.jpg',340,58),
  new Gedicht('Tuut tuut tuut,\nHelder stopt z\'n patat in \'n puut.','Helder, standplaats Vismarkt, Groningen.','helder.jpg',347,332),
  new Gedicht('\'t Is maar een weet,\nWaar men de fijnste oliebollen eet.','T. Wiltjer, Hollandse Gebakskraam, Groningen.'),
  new Gedicht('Wie rekenen kan,\nKoopt olie bij Jan.','Oliehandelaar, Groningen.')
];

/*Gedicht-class*/
function Gedicht_toString() {
  return '<div class="gedicht">'+this.g.replace(/\n/g,'<br>')
    +'</div>'
    +'<div class="bron">'+this.b
    +(this.img==null?'':' (<a href="javascript: void showFoto(\''+strImgPath+this.img+'\','+this.width+','+this.height+');">foto</a>)')
    +'</div>';
}
function Gedicht(gedicht,bron,img,width,height) {
  this.name='Gedicht';
  this.g=gedicht;
  this.b=bron;
  if(img==null) {
    this.img=null;
  } 
  else {
    this.img=img==null?null:img;
    this.width=parseInt(width,10);
    this.height=parseInt(height,10);
  }
  this.toString=Gedicht_toString;
  return this;
}
/*handy array function*/
Array.prototype.getRandomElement=Array_getRandomElement;
function Array_getRandomElement() {
	return this[parseInt(Math.random()*this.length,10)];
}
function showFoto(src,width,height) {
  var strFeatures;
  width=parseInt(width,10);
  height=parseInt(height,10)+25; //nodig voor IE6/Safari
  var intLeft=parseInt(screen.width/2,10)-parseInt(width/2,10);
  var intTop=parseInt(screen.height/4,10)-parseInt(height/2,10);
  if(window.showModalDialog) {
    strFeatures='scroll:no;status:no;help:no;dialogWidth:'+width+'px;dialogHeight:'+height+'px;dialogLeft:'+intLeft+'px;dialogTop:'+intTop+'px;';
    return window.showModalDialog(src,'',strFeatures);
  }
  else {
    strFeatures='left='+intLeft+',top='+intTop+',width='+width+',height='+height+',toolbar=no,status=yes,scrollbars=no,menubar=no,location=no,resizable=yes';
    return window.open(src,'_blank',strFeatures);
  }
}