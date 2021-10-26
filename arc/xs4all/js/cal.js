/*month-view calendar object.
constructor: 
-monthView([in] nYear, [in] nMonth) //month is 0 based, year is 4 digit
methods
-setAnchor([in] nDay, [in] sURL, [in] [sAttributes]) //sAttributes is Anchor attributes
-toHTML() //document.writeln the generated HTML
html:
month name
m t w t  f  s  s
    1 2  3  4  5
6 7 8 9 10 11 12
*/

MonthView.prototype.toHTML=MonthView_toHTML;
MonthView.prototype.setAnchor=MonthView_setAnchor;

/*private constructor*/ function mvDate(nDate,sClasses) {
  this.nDate=nDate;
  this.sClasses=sClasses;
  return this;
}

/*public constructor*/ function MonthView(nYear,nMonth,bHide) {
  var dtLastSunday, dtToday=new Date();
  var i, sClassNames;
//init constants and variables
  this.aMonthNames=['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];
  this.nYear=nYear;
  this.nMonth=nMonth;
//-Eerst de maandag vinden, op of voor de 1e dag vd maand
  this.dtFirstMonday=new Date(nYear,nMonth,1); //first day of month
  this.dtFirstMonday.setDate(this.dtFirstMonday.getDate()-convertDay(this.dtFirstMonday.getDay()));
  this.bHide=bHide;
//-Dan de zondag vinden, op of na de laatste dag vd maand
  dtLastSunday=new Date(nYear,nMonth+1,0); //last day of month
  dtLastSunday.setDate(dtLastSunday.getDate()+(6-convertDay(dtLastSunday.getDay())));
//-Now iterate from dtFirstMonday to dtLastSunday per day, and fill the array of weeks (array
  this.aWeeks=[]; //keeps array of weeks, week is array of days, day is object with nDate, sClasses, sURL
  i=0; //use as iterator for array, same as: dt.valueInDays()-this.dtFirstMonday.valueInDays()
  for(var dt=new Date(this.dtFirstMonday.valueOf()); dt.valueInDays()<=dtLastSunday.valueInDays(); dt.setDate(dt.getDate()+1) ) {
    //determine classes of this day
    if(dt.getDay()==0||dt.getDay()==6) sClassNames='mvWeekend';
    else sClassNames='mvWeekDay';
    if(dt.getMonth()!=nMonth) sClassNames+=' mvNonDay';
    if(dt.valueInDays()==dtToday.valueInDays()&&dtToday.getMonth()==nMonth) sClassNames+=' mvToday';
    //create the day object
    if(this.aWeeks[parseInt(i/7,10)]==null) this.aWeeks[parseInt(i/7,10)]=new Array(7); //create a new array for every week
    this.aWeeks[parseInt(i/7,10)][i%7]=new mvDate(dt.getDate(),sClassNames);
    i++;
  }
  return this;
}

/*helper*/ function mvMakeDay(o) {
  if(o.sURL==null) return '    <td class="'+o.sClasses+'">'+o.nDate+'</td>\n';
  else {
    var sAttr;
    if(o.sAttributes==null) sAttr='';
    else sAttr=' '+o.sAttributes;
    return '    <td class="'+o.sClasses+'"><a href="'+o.sURL+'" class="'+o.sClasses+'"'+sAttr+'>'+o.nDate+'</td>\n';
  }
}
/*helper*/ function mvMakeWeek(s) {
  return '  <tr>'+s+'</tr>\n';
}
/*helper*/ function mvMakeMonth(s,sMonth,sYear,bHide) {
  return '<table class="mvMonth">\n'+
         '  <tr>\n'+
         '    <td colspan="7" class="mvTitle" onmouseover="this.className+=\' hiLite\';" onmouseout="this.className=this.className.replace(\' hiLite\',\'\');" onclick="toggleView(\'calBody'+sYear+sMonth+'\');">'+sMonth+' '+sYear+'</td>\n'+
         '  </tr>\n'+
         '  <tbody id="calBody'+sYear+sMonth+'" style="display: '+(bHide?'none':'block')+'">\n'+
         '  <tr>\n'+
         '    <td class="mvDayNames">'+['m','d','w','d','v','z','z'].join('</td><td class="mvDayNames">')+'</td>'+
         '  </tr>\n'+
         s+
         '</tbody>'+
         '</table>';
}

//-setAnchor([in] nDay, [in] sURL, [in] [sAttributes]) //sAttributes is Anchor attributes
function MonthView_setAnchor(nDay,sURL,sAttributes) {
 //i=dt.valueInDays()-this.dtFirstMonday.valueInDays()
 var dt=new Date(this.nYear,this.nMonth,nDay);
 var i;
 i=dt.valueInDays()-this.dtFirstMonday.valueInDays();
 this.aWeeks[parseInt(i/7,10)][i%7].sURL=sURL;
 if(sAttributes!=null) this.aWeeks[parseInt(i/7,10)][i%7].sAttributes=sAttributes;
}
function MonthView_toHTML(bHide,fMakeDay,fMakeWeek,fMakeMonth) {
  var sMonth, sWeek;
  if(fMakeDay==null) fMakeDay=mvMakeDay;
  if(fMakeWeek==null) fMakeWeek=mvMakeWeek;
  if(fMakeMonth==null) fMakeMonth=mvMakeMonth;
  sMonth='';
  for(var i=0; i<this.aWeeks.length; i++) {
    sWeek='';
    for(var j=0; j<this.aWeeks[i].length; j++) {
      sWeek+=fMakeDay(this.aWeeks[i][j]);
    }
    sMonth+=fMakeWeek(sWeek);
  }
  return fMakeMonth(sMonth,this.aMonthNames[this.nMonth],this.nYear,bHide);
}


/////handy functions///////////////////////////////////////////////////////////////////////////////

function toggleView(sId) {
  var o;
  if(document.getElementById!=null) o=document.getElementById(sId);
  else if(document.all!=null) o=document.all[sId];
  else return;
  if(o.currentStyle!=null) o.style.display=o.currentStyle.display=='block'?'none':'block';
  else o.style.display=o.style.display=='block'||o.style.display==''?'none':'block';
}

function convertDay(nDay) {
  //js: sunday..saterday==0..6 (sunday first day of week)
  //returns: monday..sunday==0..6 (monday first day of week)
  return nDay==0?6:nDay-1;
}

//results in #days since 1970; handy to compares dates without time
Date.prototype.valueInDays=Date_valueInDays;	
function Date_valueInDays()
{	var dtTemp = new Date(this.getFullYear(), this.getMonth(), this.getDate() ); 
	var res=parseInt( dtTemp.valueOf() / (24*60*60*1000) );
	dtTemp=null;
	return res;
}