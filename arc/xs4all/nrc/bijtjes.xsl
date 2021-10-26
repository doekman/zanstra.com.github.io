<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
                        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                        xmlns="http://www.w3.org/1999/xhtml">

      <xsl:output      method="xml" indent="yes"
                        doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
                        doctype-system="DTD/xhtml1-transitional.dtd"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>NRC nieuwbrief bijtjes</title>
      </head>
      <script language="javascript" type="text/javascript" src="css.js">
      /*fix*/
      </script>
      <body>
        <h1>NRC nieuwbrief bijtjes</h1>

        <xsl:for-each select="bijen/bij">
          <xsl:sort select="substring(@datum,1,4)"/>
          <xsl:variable name="before" select="position() - 1"/>
          <xsl:variable name="lastdate" select="../bij[position() = $before]/@datum"/>

          <xsl:if test="($before &lt; 1) or not(substring(@datum,1,4) = substring($lastdate,1,4))">
            <h1>
              <xsl:value-of select="substring(@datum,1,4)"/>
              <img src="bijtjebalk_boven.gif" alt="scheiding" />
            </h1>
              <xsl:attribute name="id">
                <xsl:value-of select="substring(@datum1,6)"/>
              </xsl:attribute>
          </xsl:if>

          <xsl:if test="($before &lt; 1) or not(substring(@datum,5,2) = substring($lastdate,5,2))">
            <h2>
              <xsl:value-of select="document('months.xml')/months/month[@id = number(substring(current()/@datum,5,2))]/name/text()"/>
            </h2>
          </xsl:if>
            <div>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="concat('nrc',@datum,'.htm')"/>
                </xsl:attribute>
                <xsl:attribute name="title">
                  <xsl:value-of select="concat('Open de NRC nieuwsbrief van ',substring(@datum,7,2),'-',number(substring(@datum,5,2)),'-',substring(@datum,1,4))"/>
                </xsl:attribute>
                <xsl:value-of select="number(substring(@datum,7,8))"/>
              </a>

              <xsl:text> </xsl:text>
              
              <xsl:choose>
                <xsl:when test=". = ''">
                  <em>Geen nieuwsbrief of bijtje</em>
                </xsl:when>
                <xsl:when test="not(. = '')">
                  <xsl:value-of select="."/>
                </xsl:when>
              </xsl:choose>
            </div>
        </xsl:for-each>
        <p>
          <img src="bijtjebalk_onder.gif" alt="scheiding" />
          <br/>
          <small>
            XML file generated with <a href="bijtjes.js">javascript file</a> (wsh) d.d. <xsl:value-of select="concat(substring(bijen/@generated,7,2),'-',number(substring(bijen/@generated,5,2)),'-',substring(bijen/@generated,1,4))"/>.
            XSLT file with help on grouping by people on <a href="http://gathering.tweakers.net/showtopic.php/293980/1/25">gathering of tweakers</a>.
          </small>
        </p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
