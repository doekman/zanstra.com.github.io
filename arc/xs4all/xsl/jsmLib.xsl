<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" 
xmlns="http://www.w3.org/1999/xhtml"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html"
   encoding="iso-8859-1"/>
  <xsl:output cdata-section-elements="code example"/>

  <xsl:template match="/lib">
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
				
				<p>
					Welcome to the growing collection of javascript methods for
					it's standard objects. You may <a href="jsmLib.js">download</a>
					the code in one file here.
				</p>
        <div class="weblog">
          <xsl:apply-templates select="object">
						<xsl:sort select="@name"/>
					</xsl:apply-templates>
        </div>

        <div class="footer">
          <a href="mailto:zanstra@xs4all.nl?subject=jsmLib" title="Send an email">Doeke Zanstra</a>, 2003. 
          The xml-version can be downloaded <a href="jsmLib.xml">as well</a>.
         </div>
      </td></tr></table><!--end columns--></body>
    </html>
  </xsl:template>

  <xsl:template match="object">
    <h1 style="margin:0px;font-size:18pt">
			<xsl:value-of select="@name"/>
    </h1>
    <xsl:apply-templates select="method">
			<xsl:sort select="@name"/>
		</xsl:apply-templates>
  </xsl:template>

  <xsl:template match="method">
    <h2 class="title">
      <a>
        <xsl:attribute name="name">
          <xsl:value-of select="../@name"/>_<xsl:value-of select="@name"/>
        </xsl:attribute>
  			<xsl:value-of select="@name"/>
      </a>
    </h2>
    <xsl:apply-templates/>
  </xsl:template>

	<xsl:template match="description">
    <xsl:call-template name="inline-elements"/>
	</xsl:template>

	<!--Library functions-->

	<xsl:template name="block-elements">
    <xsl:apply-templates select="p|code-block|table"/>
  </xsl:template>

  <xsl:template name="inline-elements">
    <xsl:apply-templates select="em|strong|code|a|text()"/>
  </xsl:template>

  <xsl:template match="p">
    <p>
      <xsl:call-template name="inline-elements"/>
    </p>
  </xsl:template>

  <xsl:template match="code-block">
		<h3><xsl:value-of select="@title"/></h3>
    <pre class="JS">
      <xsl:value-of disable-output-escaping="yes" select="."/>
    </pre>
  </xsl:template>
	
	<xsl:template match="table">
		<xsl:copy-of select="."/>
	</xsl:template>

  <xsl:template match="em">
    <em>
      <xsl:apply-templates/>
    </em>
  </xsl:template>

  <xsl:template match="code">
    <code>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <xsl:template match="strong">
    <strong>
      <xsl:apply-templates/>
    </strong>
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