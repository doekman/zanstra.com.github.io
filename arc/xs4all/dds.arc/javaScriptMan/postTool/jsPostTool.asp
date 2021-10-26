<%@  Language=Javascript %>
<HTML>
<HEAD>
<META NAME="GENERATOR" Content="Microsoft Visual Studio 6.0">
</HEAD>
<BODY>
<!--###### GET #########################-->
<%if(Request.QueryString.Count==0) { %>
  <H3>GET Query String</H3>
  
  <P>[Empty]</P>
<% } else { %>
  <H1>GET Query String</H1>
	<TABLE>
		<COLGROUP STYLE="FONT-WEIGHT: bold">
		<COLGROUP>
		<THEAD>
			<TR>
				<TD>Parameter</TD>
				<TD>Value</TD>
			</TR>
			<TR>
				<TD colspan="2">
					<HR noshade size=1>
				</TD>
			</TR>
		</THEAD>
		<TBODY>
<%
for(i=1; i<=Request.QueryString.Count; i++)
{	Response.Write("<TR><TD>");
	Response.Write(Request.QueryString.Key(i));
	Response.Write("</TD><TD>");
	Response.Write(Request.QueryString.Item(i));
	Response.Write("</TD></TR>");
}
%>
			<TR>
				<TD colspan="2">
					<HR noshade size=1>
				</TD>
			</TR>
		</TBODY>
</TABLE>

<% } %>
<!--###### POST #########################-->
<%if(Request.Form.Count==0) { %>
  <H3>POST Form</H3>
  <P>[Empty]</P>
<% } else { %>
  <H1>POST Form</H1>
<TABLE>
	<COLGROUP STYLE="FONT-WEIGHT: bold">
	<COLGROUP>
	<THEAD>
			<TR>
				<TD>Parameter</TD>
				<TD>Value</TD>
			</TR>
			<TR>
				<TD colspan="2">
					<HR noshade size=1>
				</TD>
			</TR>
	</THEAD>
	<TBODY>
<%
var strPostCookie;
for(i=1; i<=Request.Form.Count; i++)
{	Response.Write("<TR><TD>");
	Response.Write(Request.Form.Key(i));
	Response.Write("</TD><TD>");
	Response.Write(Request.Form.Item(i));
	Response.Write("</TD></TR>");
}
%>
			<TR>
				<TD colspan="2">
					<HR noshade size=1>
					<input type=text name="f_strPostTitle">
					&nbsp;&nbsp;
					<input type=button onclick="savePost()" value="save">
					<HR noshade size=1>
				</TD>
			</TR>
	</TBODY>
</TABLE>
<% } %>
<SPAN style="font-family:'verdana,arial'; font-size:6pt;">december 1999 by D Zanstra </SPAN> 
</BODY>
</HTML>
