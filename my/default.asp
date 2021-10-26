<!-- Previous version of index.html -->
<%@language=javascript%>
<html>
  <head>
    <title>my</title>
    <style type="text/css">
h1 { font: bold 48px/100% "Optima", "Arial Black", sans-serif;}    
a, p, ul { font: 14px/140% "Gill Sans", Tahoma, sans-serif; }
ul { list-style-type: circle; color:gray;}  
a:link, a:visited { color:slateblue; } /* #6A5ACD */
a:hover, a:active { 
  color:slateblue; 
  background-color:#D4CFF0; 
  text-decoration:none;
  border-bottom:1px solid #939393;
}
    </style>
  </head>
  <body>
    <h1>my projects</h1>
    <ul>
<%
ShowFiles();

function ShowFiles() {
  var fso=Server.CreateObject("Scripting.FileSystemObject");
  var wildcard=Server.MapPath(".");
  var folder=new Enumerator(fso.GetFolder(wildcard).Files);
  var list=[];
  for( ; !folder.atEnd(); folder.moveNext()) {
    var file=folder.item();
    if(/^[A-Z].*\.html$/.test(file.Name)) {
      list.push(
        { path: String(file)
        , filename: file.Name
        , name: GetTitle(fso,file)||file.Name
        , modified: new Date(Date.parse(file.DateLastModified))
        }
      );
    }
  }
  list=list.sort(function(b,a) { return a.modified.valueOf()-b.modified.valueOf() });
  for(var i=0; i<list.length; i++) {
    var file=list[i];
    Response.Write('\t\t\t<li><a href="'+file.filename+'">'+file.name+'</a></li>\n');
  }
}
function GetTitle(fso,file) {
  var s=ReadFirst(fso,file,10,"</title>");
  var r=/<title>((?:.|\n)+)<\/title>/i;
  var a=r.exec(s);
  return a?a[1]:null;
}
function ReadFirst(fso,file,n,search) {
  var s="", t="", lines=0;
  var f=fso.OpenTextFile(file,1);
  while(!f.AtEndOfStream&&lines<n&&t.indexOf(search)==-1) {
    s+=t=f.ReadLine();
    lines++;
  }
  return s;
}
%>    </ul>
      <p>Or you can go to <a href="../arc/">my archive</a>.</p>

  </body>
</html>
