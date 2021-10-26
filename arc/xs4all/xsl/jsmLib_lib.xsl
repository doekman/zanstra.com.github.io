<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" 
xmlns="http://www.w3.org/1999/xhtml"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="text"
   encoding="iso-8859-1"/>
  <!--xsl:output cdata-section-elements="code example"/-->

  <xsl:template match="/lib">/*
 * A collection of methods for javascipts standard objects.
 * Copyright (C) Doeke Zanstra 2003
 * Distributed under the BSD License
 * See http://www.xs4all.nl/~zanstra/logs/jsmLib.htm for more info.
 *
 * NOTICE: do not change this code here, as it is generated.
 */
		<xsl:apply-templates select="object">
			<xsl:sort select="@name"/>
		</xsl:apply-templates>
  </xsl:template>

  <xsl:template match="object">

//--| Object: <xsl:value-of select="@name"/> |-------------------------------------------
		<xsl:apply-templates select="method">
			<xsl:sort select="@name"/>
		</xsl:apply-templates>
  </xsl:template>

  <xsl:template match="method">
		<xsl:value-of select="code-block[@title='Library']"/>
  </xsl:template>

</xsl:stylesheet>