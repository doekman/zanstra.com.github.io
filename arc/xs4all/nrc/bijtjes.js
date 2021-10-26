var fso;
processFiles('.')

function processFiles(sFolderSpec)
{
  var f, f1, fc, outputFile;
  var aIssues=[];
  fso = new ActiveXObject('Scripting.FileSystemObject');
  outputFile=fso.OpenTextFile("bijtjes.xml", 2, true);
  outputFile.WriteLine('<?xml version="1.0" encoding="iso-8859-1"?>');
  outputFile.WriteLine('<?xml-stylesheet type="text/xsl" href="bijtjes.xsl"?>');
  outputFile.WriteLine('<bijen generated="'+dt2iso(new Date())+'">');
  f = fso.GetFolder(sFolderSpec);
  for (fc = new Enumerator(f.files); !fc.atEnd(); fc.moveNext())
  {
      file=String(fc.item());
      if(/nrc[0-9]{8,8}.htm$/.test(file)) {
        var arr=getBee(file);
        aIssues[aIssues.length]=file.match(/nrc([0-9]{8,8}).htm$/)[1];

        if(arr[1]==null) outputFile.WriteLine('  <bij datum="'+aIssues[aIssues.length-1]+'"/>');
        else outputFile.WriteLine('  <bij datum="'+aIssues[aIssues.length-1]+'">'+arr[1]+'</bij>');
        //determine first and last issue
      }
  }
  outputFile.WriteLine('</bijen>');
  outputFile.Close();

  outputFile=fso.OpenTextFile("issue.js", 2, true);
  outputFile.WriteLine('var aIssues=[\''+aIssues.sort().join('\',\'')+'\'];');
  outputFile.Close();
  return 0;
}

function getISODate(str) {
  //looks for 8 digits in a row, and interprets it as a date in format YYYYMMDD
  //and converts it to a js-date
  //with error, undefined is returned
  var arr=String(str).match(/(\d{4,4})(\d{2,2})(\d{2,2})/);
  if(arr.length!=4) return;
  else return new Date(arr[1],parseInt(arr[2],10)-1,arr[3]);
}

function getBee(sFileName) {
  var nieuwsbrief=fso.OpenTextFile(sFileName, 1);
  var sHTML=nieuwsbrief.ReadAll();
  var reDatum=/size="-2">([^<]+)</i;
  var reBijtje=/<center><[^>]+>([^<]+)</;
  var arr=[], i;
  reDatum.exec(sHTML);
  arr[0]=dateConvert(RegExp.$1);
  i=sHTML.indexOf('bijtjebalk_boven.gif');
  if(i>=0) {
    reBijtje.exec(sHTML.substr(i));
    arr[1]=RegExp.$1;
  }
  nieuwsbrief.Close();
  return arr;
}

function dateConvert(s) {
  var re=/[a-z]+ ([0-9]+) ([a-z]+) ([0-9]+)/i;
  var res;
  re.exec(s);
  switch(RegExp.$2.toLowerCase()) {
    case 'januari': res='1'; break;
    case 'februari': res='2'; break;
    case 'maart': res='3'; break;
    case 'april': res='4'; break;
    case 'mei': res='5'; break;
    case 'juni': res='6'; break;
    case 'juli': res='7'; break;
    case 'augustus': res='8'; break;
    case 'september': res='9'; break;
    case 'oktober': res='10'; break;
    case 'november': res='11'; break;
    case 'december': res='12'; break;
  }
  return RegExp.$3+fix(res,2)+fix(RegExp.$1,2);
}

function fix(i,l) {
  //fix integer i at length l by adding 0 in front, and returning a string
  var s=String(i);
  while(s.length<l) s='0'+s;
  return s;
}

function dt2iso(dt) {
  return dt.getFullYear()+fix(dt.getMonth()+1,2)+fix(dt.getDate(),2);
}

