<%@language=javascript%>
<!--#include file="lib/util.asp"-->
<%
//http://zanstra.com/my/RegexMate/LinkThing/linkthing.asp?usr=doekman&pwd=geheim&dir=apps
if(httpMethod()!='POST') {
%>
<html> 
  <head>
    <title>Linkthing</title>
  </head>
  <body> 
    <h1>Linkthing</h1>
    <form method="POST" action="linkthing.asp"> 
      <label>User:</label> <input type="text" name="usr" value="<%=qs('usr','')%>">  
      <br>
      <label>Password:</label> <input type="password" name="pwd">  
      <br>
      <label>Directory:</label> <input type="text" name="dir" value="<%=qs('dir','apps')%>">  
      <br>
      <input type="submit" name="gogo" value="Generate">
    </form>
  </body>
</html>
<%
}
else {
  frm_req("dir","usr","pwd");
  if(frm("usr")!="doekman" || frm("pwd")!="geheim") {
    throw new Error("Not authorized."); 
  }
  
  var dir=Server.MapPath(frm("dir"));
  var fso = Server.CreateObject("Scripting.FileSystemObject");
  var FSO = { forReading:1, forWriting:2, forAppending:8};
  if(!fso.FolderExists(dir)) throw new Error("The folder '{0}' doesn't exist".format(dir));
  var prj=ReadJson(dir+"\\linkthing.json");
  var baseUrl="http://feeds.delicious.com/feeds/json/"+prj.account+"/{0}?raw&count=100";
  var menu=[], siteUrl=Request.ServerVariables("URL").Item().replace('linkthing.asp', frm("dir")+'/');
  CreateMenu:for(var i=0; i<prj.pages.length; i++) {
    var page=prj.pages[i];
    menu.push(tag("li", tag("a", HtmlEncode(page.title), {href: siteUrl+page.name})));
  }
  ForFeed:for(var i=0; i<prj.pages.length; i++) {
    var page=prj.pages[i];
    var content=ReadAll(dir+"\\linkthing.htm").replace(/\[\[TITLE]]/g, page.title).replace("[[MENU]]", menu.join('').replace(page.name+'"', page.name+'" class="active"')).replace("[[FOOTER]]", tag("a", "delicious", {href:"http://del.icio.us/regexmate/"+page.tags.join("+")}));
    var feed=FetchJson(baseUrl.format(page.tags.join("+")));
    var entries=[];
    ForItem:for(var j=0; j<feed.length; j++) {
      entries.push(EntryTemplate(feed[j]));
    }
    content = content.replace("[[ITEMS]]", entries.join(""));
    WriteAll(dir+"\\"+page.name, content);
    //break ForFeed;
  }
  writeln("done");
}

//--| functions |---------------------------------------------------------------------------------
function EntryTemplate(obj){
  // u: url, n: description(O), d: title, t: tags
  return tag("h2", tag("a", HtmlEncode(obj.d), {href: HtmlEncode(obj.u)})) +
    ("n" in obj ? htmlize(obj.n) : "<p><em>No description available</p>");
}
function htmlize(s) {
  return '<p>'+String(s).replace(/(\r\n){2,}/g, '</p><p>').replace(/\r\n/g, '<br>')+'</p>';
}
function ReadJson(filename) {
  return eval("("+ReadAll(filename)+")");
}
function ReadAll(filename) {
  var f;
  if(!fso.FileExists(filename)) throw new Error("The file '{0}' doesn't exist".format(filename));
  try {
    f = fso.OpenTextFile(filename, FSO.forReading, true);
    return f.ReadAll();
  } 
  finally {
    if(f) f.Close();
  }
}
function WriteAll(filename, content) {
  write("Writing '"+filename+"'");
  var f = fso.OpenTextFile(filename, FSO.forWriting, true, true);
  f.Write(content);
  f.Close();
  writeln("; written<br>");
}
function FetchJson(url) {
  var http = Server.CreateObject("MSXML2.ServerXMLHTTP");
  http.open("GET", url, false);
  http.send(null);
  return eval("("+http.responseText+")");
}
%>