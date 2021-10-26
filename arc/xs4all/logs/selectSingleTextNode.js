//Usage:
//selectSingleTextNode inputXML javascriptVariableName XPathExpression
function strEncode(s)
{
  return "'"+s.replace("'","\\'")+"'";
}
var o=new ActiveXObject('Msxml2.DOMDocument.4.0');
o.load(WScript.Arguments(0));
o.setProperty("SelectionLanguage", "XPath");
var t=o.selectSingleNode(WScript.Arguments(2));
WScript.Echo("var "+WScript.Arguments(1)+"="+strEncode(t.nodeValue)+";");