
var sFolderSpec='C:\\Documents and Settings\\Doeke Zanstra\\My Documents\\nrcTemp';
var sDestination='E:\\Inetpub\\wwwroot\\xs4all\\nrc';

//--| First create the filename:cid list
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile('E:\\Inetpub\\wwwroot\\xs4all\\inTec\\nrc.eml.txt',1);
var aCIDList=extractFNCID(file.ReadAll());
file.Close();

//--| Walk through all .html files
var folder = fso.GetFolder(sFolderSpec);
var fileName, sHTML;
for(var fc = new Enumerator(folder.files); !fc.atEnd(); fc.moveNext()) {
  fileName=String(fc.item());
  if(/[^.]\.htm$/.test(fileName)) {
    WScript.Echo('+Processing '+fileName);
    //--| Process the file
    //Read File
    file=fso.OpenTextFile(fileName,1);
    sHTML=file.ReadAll();
    file.Close();
    //Process HTML
    sHTML=replaceCidWithFn(sHTML,aCIDList);
    //Over-write file
    file=fso.CreateTextFile(fileName,true);
    file.Write(sHTML);
    file.Close();
    delete file;

    var iii=fileName.lastIndexOf('\\');
    var sFileName=fileName.substr(iii+1);
    if(fso.FileExists(sDestination+'\\'+sFileName))
    {
      fso.DeleteFile(sDestination+'\\'+sFileName,true);
    }
    else
    {
      WScript.Echo('+File '+sFileName+' doesn\'t exist.');
    }
    fso.MoveFile(fileName,sDestination+'\\');
  }
  else
  {
    WScript.Echo('+Skipping '+fileName);
  }
}


function extractFNCID(s) {
  var i, j=0, ss, fn, cid, res=[];
  //helaas: javascript ondersteund geen multi-line reguliere expressies (pas in ie5.5 of zo)
  //zoek positie "Content-Disposition:" aan het begin vd regel (i)
  //zoek positie lege regel hierna (j)
  //neem deze substring (ss)
  //vindt wsp+'filename="xxx" (fn)
  //vindt Content-ID: <xxx> (cid)
  //voeg toe aan resultaat, indien beide gevonden (res)
  //doe dit net zolang (vanaf j) totdat geen i meer gevonden is.
  while(true) {
    i=s.indexOf('\nContent-Disposition:',j);
    if(i==-1) break; //no more attachments
    j=s.indexOf('\r\n\r\n',i);
    if(j==-1) j=s.length;
    ss=s.substring(i,j); //the part of the header, we are interested in
    fn=ss.match(/[ \t]*filename=\"([^\"]*)\"/i);
    if(fn.length==2) fn=fn[1]; 
    else fn=''; //not found
    cid=ss.match(/Content-ID\: \<([^\>]*)\>/i);
    if(cid.length==2) cid=cid[1]; 
    else cid=''; //not found
    if(fn.length>0&&cid.length>0) res[res.length]=fn+':'+cid;
  }
  return res;
}

function replaceCidWithFn(sHtml,aList) {
  var aElement;
  for(var i=0; i<aList.length; i++) {
    aElement=aList[i].split(':');
    sHtml=sHtml.replace( new RegExp('cid:'+aElement[1],'ig'), aElement[0]);
  }
  return sHtml;
}
