@set @cmd=false
@set @dbg=2
function dummy(s) { return s; }
if(typeof WScript=='undefined') WScript={StdIn:{ReadLine:dummy},StdOut:{Write:dummy},StdErr:{Write:dummy}};

var aChPos; //letter possible, indexed on position
var aLib; //beginWord probability, indexed on length
var aCode=[
  ,
	['a','b','c'],
	['d','e','f'],
	['g','h','i'],
	['j','k','l'],
	['m','n','o'],
	['p','q','r'],
	['s','t','u'],
	['v','w','x'],
	['y','z']
];


@if(@cmd)
//commandline code
  main();

function main() {
  @if(@dbg>=1)
    var dtBegin=new Date();
  @end

  //--| process the lib |------------------------------------------------------
  aLib=[];
  aChPos=[];
  var nWordsInLib=parseInt(WScript.StdIn.ReadLine(),10);
  while(nWordsInLib--) {
    var b=WScript.StdIn.ReadLine().split(' ');
    add2lib(b[0].toLowerCase(),parseInt(b[1],10));
  }
  @if(@dbg>=2)
    WScript.StdErr.Write( lib2str() );
  @end

  //--| crack the code |-------------------------------------------------------
  var s=''; //stdout
  var nCodeLines=parseInt(WScript.StdIn.ReadLine(),10);
  while(nCodeLines--) {
    WScript.StdOut.Write( decodeCombies(WScript.StdIn.ReadLine()) );
  }
  @if(@dbg>=1)
    WScript.StdErr.Write('Done in '+(new Date()-dtBegin)+'ms');
  @end
  return;
} //end main
@end

function lib2str() {
  var s='--(aLib)-------\n';
  for(var i in aLib) {
    s+=i+':[';
    for(var j in aLib[i]) {
      s+=j+':'+aLib[i][j]+',';
    }
    s=s.substr(0,s.length-1)+']\n';
  }
  s+='--(aChPos)-------\n';
  for(var i in aChPos) {
    s+=i+':[';
    for(var j in aChPos[i]) {
      s+=j+',';
    }
    s=s.substr(0,s.length-1)+']\n';
  }
  return s;
}

function add2lib(s,p) {
  for(var i=1; i<=s.length; i++) {
    if(aLib[i]==null) aLib[i]={};
    if(aLib[i][s.substr(0,i)]==null) aLib[i][s.substr(0,i)]=p;
    else aLib[i][s.substr(0,i)]+=p;
    if(aChPos[i-1]==null) aChPos[i-1]={};
    if(aChPos[i-1][s.substr(i-1,1)]==null) aChPos[i-1][s.substr(i-1,1)]=true; 
  }
}

var aLetterChoice; //indexed on pos, contains string of choices;
//if a position contains a zero-length string, this means from this position decoding is impossible
function buildLetterChoice(s) {
  aLetterChoice=[]; 
  var i=0;
  while(s.substr(i,1)!='0') {
    if(s.substr(i,1)=='0') return; //en
    aLetterChoice[i]='';
    var x=aCode[s.substr(i,1)];
    for(var j=0; j<x.length; j++) { //try every character of a digit
      if(aChPos.length<=i) return; //word is longer than longest word in lib
      if(aChPos[i][x[j]]!=null) aLetterChoice[i]+=x[j];
    }
    i++;
  }
}

var sChoice, nChoice; //the found word, and the probability
function GoTdecode(endIndex,s) {
  if(s.length>endIndex) {
    //combination found
    if(aLib[s.length][s]!=null) { //combination is in library
      if(nChoice==null || nChoice<aLib[s.length][s]) { //first match OR higher priority found
        //don't do the stack-thing with strings.
        nChoice=aLib[s.length][s];
        sChoice=s; 
      }
      else if(nChoice==aLib[s.length][s]) { //same priority
        if(s<sChoice) sChoice=s;
      }
    }
  }
  else {
    for(var i=0; i<aLetterChoice[s.length].length; i++) {
      GoTdecode(endIndex,s+aLetterChoice[s.length].substr(i,1));
    }
  }
}

function decodeCombies(s) {
  var res='', wrd;
  var i=0;
  buildLetterChoice(s);

  @if(@dbg>=2)
    @if(@cmd)
      WScript.StdErr.Write('<'+s+':='+aLetterChoice.join(',')+'>\n');
    @else
      res+='<'+s+':='+aLetterChoice.join(',')+'>\n';
    @end
  @end

  while(s.substr(i,1)!='0') {
    if(aLib.length<=i //Lengte te zoeken woord is langer dan langste woord in library
     ||aLetterChoice[i].length==0) { //geen letter mogelijk op die positie
      res+='onmogelijk\n';
      break;
    }
    nChoice=sChoice=undefined;
    GoTdecode(i,'');
    res+=sChoice+'\n';
    i++;
  }
  return res;
}