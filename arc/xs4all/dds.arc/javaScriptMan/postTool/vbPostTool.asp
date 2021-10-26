<%@  Language=VBScript %>
<HTML>
<HEAD>
<META NAME="GENERATOR" Content="Microsoft Visual Studio 6.0">
<LINK rel="stylesheet" type="text/css" href="../styleSheets/msypDefault.css">
</HEAD>
<BODY>

<%if Request.QueryString.Count=0 then %>
  <H3>GET Query String</H3>
  <P>[Empty]</P>
<% else  %>
  <H1>GET Query String</H1>
  <P><%=Request.QueryString%></P>
<% end if %>

<%if Request.Form.Count = 0 then%>
  <H3>POST Form</H3>
  <P>[Empty]</P>
<% else %>
  <H1>POST Form</H1>
<TABLE>
	<COLGROUP STYLE="FONT-WEIGHT: bold">
	<COLGROUP>
	<THEAD>
	<TR>
		<TD>Parameter</TD>
		<TD>Value</TD>
	<TR>
	<TR>
		<TD colspan="2">
			<HR noshade size=1>
		</TD>
	</TR>
	</THEAD>
	<TBODY>
<%
for each strKey in Request.Form
	Response.Write "<TR><TD>"
	Response.Write strKey
	Response.Write "</TD><TD>"
	Response.Write Request.Form(strKey)
	Response.Write "</TD></TR>"
next	
%>
	<TR>
		<TD colspan="2">
			<HR noshade size=1>
		</TD>
	</TR>
	</TBODY>
</TABLE>
<% end if%>
<SPAN style="font-family:'verdana,arial'; font-size:6pt;">december 1999 by D Zanstra </SPAN> 
</BODY>
</HTML>
