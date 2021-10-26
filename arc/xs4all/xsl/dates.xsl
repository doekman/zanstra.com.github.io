<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">

  <xsl:output method="xml" indent="yes"/>

  <xsl:template name="long-date">
    <xsl:param name="value"/>
    <xsl:param name="lang">
      <xsl:value-of select="ancestor-or-self::*/@xml:lang[last()]"/>
    </xsl:param>
    <xsl:value-of select="number(substring($value,9,2))"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="document('dates.xml')/dates/months/month[@id = number(substring($value,6,2))]/name[@xml:lang=$lang]/text()"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="number(substring($value,1,4))"/>
  </xsl:template>

</xsl:stylesheet>