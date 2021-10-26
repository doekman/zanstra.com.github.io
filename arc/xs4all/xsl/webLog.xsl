<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" 
xmlns="http://www.w3.org/1999/xhtml"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:import href="../xsl/dates.xsl"/>
  <xsl:output method="html"
   encoding="iso-8859-1"/>
  <xsl:output cdata-section-elements="code-block"/>

  <xsl:template match="/log">
    <html>
      <xsl:attribute name="lang">
        <xsl:value-of select="@xml:lang"/>
      </xsl:attribute>
      <xsl:attribute name="xml:lang">
        <xsl:value-of select="@xml:lang"/>
      </xsl:attribute>
      <head>
        <title><xsl:value-of select="@title"/></title>
        <link rel="stylesheet" href="../default.css"/>
        <link rel="stylesheet" href="../xsl/webLog.css"/>
        <script language="javascript" src="../js/menu.js">/*fix*/</script>
        <script language="javascript" src="mindex.js">/*fix*/</script>
        <script language="javascript" src="../js/colorSyntaxJS.js">/*fix*/</script>
        <script language="javascript" type="text/javascript">
window.onload=function()
{
	hiLiteJS("JS");
	hiLiteJS("JSnr",true);
}
        </script>
      </head>
      <body>
      <table cellpadding="0" border="0"><tr><td width="100"><!--column 1a-->
        <div style="text-align: center">
          <img src="../img/jsLogo.png" /><!--img as icon-->
        </div>  
          <div style="font-family: Tahoma, sans-serif; font-size: 8pt; text-align: center">
            log.js<!--filename-->
        </div>
      </td><td style="width: 5px"><!--column 2a-->
      <xsl:text> </xsl:text>
      </td><td><!--column 3a-->  
        <h1>
          <xsl:value-of select="@title"/>
        </h1>
      </td></tr><tr><td><!--column 1b-->
          <!--menu-->
          <script language="javascript">writeMenu();</script>
          <!--einde menu-->
      </td><td><!--column 2b-->
      </td><td style="border-left: 1px solid black; padding-left: 7px"><!--column 3b-->  

        <div class="weblog">
          <xsl:apply-templates select="topics/topic"/>
        </div>

        <div class="footer">
          <a href="mailto:zanstra@xs4all.nl?subject=webLog" title="Stuur een email">Doeke Zanstra</a>, 2002-2005. 
          The xml-version can be downloaded <a href="jsLog.xml">as well</a>.
					<!-- Begin Nedstat Basic code -->
					<!-- Title: Javascript weblog -->
					<!-- URL: http://www.xs4all.nl/~zanstra/logs/jsLog.htm -->
					<script language="JavaScript" type="text/javascript" src="http://m1.nedstatbasic.net/basic.js">/*FIX*/
					</script>
					<script language="JavaScript" type="text/javascript" >
						nedstatbasic("ACdvQQtX8Iv8zer9asttUOWaqE6Q", 0);
					</script>
					<noscript>
					<a target="_blank" href="http://v1.nedstatbasic.net/stats?ACdvQQtX8Iv8zer9asttUOWaqE6Q"><img
					src="http://m1.nedstatbasic.net/n?id=ACdvQQtX8Iv8zer9asttUOWaqE6Q"
					border="0" nosave="nosave" width="18" height="18"
					alt="Nedstat Basic - Free web site statistics" /></a>
					</noscript>
					<!-- End Nedstat Basic code -->
				 </div>
      </td></tr></table><!--end columns--></body>
    </html>
  </xsl:template>

  <xsl:template match="topic">
    <h2 class="title">
      <a title="Link for future reference to this entry">
        <xsl:attribute name="name"><xsl:value-of select="@id"/></xsl:attribute>
        <xsl:attribute name="href">#<xsl:value-of select="@id"/></xsl:attribute>
        <xsl:value-of select="title"/>
      </a>
      <span class="date">
        (<xsl:call-template name="long-date">
          <xsl:with-param name="value" select="@created"/>
        </xsl:call-template>)
      </span>
    </h2>
    <xsl:call-template name="block-elements"/>
    <div class="spacer"><xsl:text> </xsl:text></div>
  </xsl:template>

  <xsl:template name="block-elements">
    <xsl:apply-templates select="p|code-block|table"/>
  </xsl:template>

  <xsl:template name="inline-elements">
    <xsl:apply-templates select="em|strong|code|run|a|updated|text()"/>
  </xsl:template>

  <xsl:template match="p">
    <p>
      <xsl:choose>
        <xsl:when test="@class">
          <xsl:attribute name="class"><xsl:value-of select="."/></xsl:attribute>
        </xsl:when>
      </xsl:choose>
      <xsl:call-template name="inline-elements"/>
    </p>
  </xsl:template>

  <xsl:template match="code-block[@type='application/x-javascript']">
    <pre>
      <xsl:choose>
        <xsl:when test="@linenumbers='true'">
          <xsl:attribute name="class">JSnr</xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="class">JS</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:value-of disable-output-escaping="yes" select="."/>
    </pre>
		<xsl:choose>
			<xsl:when test="@exec='true'">
				<script language="javascript">
		      <xsl:value-of disable-output-escaping="yes" select="."/>
				</script>
			</xsl:when>
		</xsl:choose>
  </xsl:template>
	
	<xsl:template match="table">
		<xsl:copy-of select="."/>
	</xsl:template>

  <xsl:template match="code-block">
    <pre class="unknown">
      <xsl:value-of disable-output-escaping="yes" select="."/>
    </pre>
  </xsl:template>

  <xsl:template match="em">
    <em>
      <xsl:apply-templates/>
    </em>
  </xsl:template>

  <xsl:template match="strong">
    <strong>
      <xsl:apply-templates/>
    </strong>
  </xsl:template>

  <xsl:template match="code">
    <code>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <xsl:template match="run">
    <span class="run" title="Click to run the code">
	   <xsl:attribute name="onclick"><xsl:value-of select="text()"/></xsl:attribute>
		 <xsl:value-of select="text()"/>
    </span>
  </xsl:template>

  <xsl:template match="updated">
    <span class="updated">Updated:</span>
		<xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="a">
    <a>
      <xsl:attribute name="href">
        <xsl:value-of select="@href"/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </a>
  </xsl:template>

</xsl:stylesheet>