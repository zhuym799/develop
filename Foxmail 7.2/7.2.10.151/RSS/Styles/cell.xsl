<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>

<xsl:variable name="common-styles">
	<style type="text/css">
                body,td,th {
                	color: #edf1f4;
                }	
                body {
                	margin-top: 0px;
                	margin-left: 0px;
                	margin-right: 0px;
                	margin-bottom: 0px;
                	
                }
                html { border: 0px solid gray;}
                a:link {            	   
 	                text-decoration: none;                
                };
                a:hover {
                	color: #AF0000;
                	text-decoration: none;
                }
                .white_14 {
                	font-family: "黑体";
                	font-size: 14px;
                	line-height: 25px;
                	color: #FFFFFF;
                }
                .white_20 {
                	font-family: "楷体_GB2312";
                	font-size: 20px;
                	color: #FFFFFF;
                }   
                .white_25 {
                	font-family: "楷体_GB2312";
                	font-size: 25px;
                	color: #FFFFFF;
                }
                .black_10 {
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                	font-size: 12px;
                	color: #000000;
                	text-decoration: none;
                	line-height: 25px;
                }                
                .black_12 {
                	font-size: 12px;
                	line-height: 25px;
                	color: #000000;
                	font-family: "宋体";
                    text-decoration: none;
                }                                
                .black_14 {
                	font-size: 14px;
                	line-height: 25px;
                	color: #000000;
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                	text-decoration: none;
                }                                             
                .black_14_2 {
                	font-size: 14px;
                	line-height: 25px;
                	color: #000000;
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                    text-decoration: none;
                }
                .black_18 {
                	font-family: "宋体";
                	font-size: 18px;
                	font-weight: bold;
                	color: #4f5394;
                	line-height: 25px;
                	text-decoration: none;
                }
                .black_24 {
                	font-family: "妤蜂綋_GB2312";
                	font-size: 24px;
                	color: #000000;
                	text-decoration: none;
                }
                .black_26 {
                	font-family: "黑体";
                	font-size: 26px;
                	color: #000000;
                	text-decoration: none;
                }
		.channel {margin-top: 4px};
	</style>
</xsl:variable>

<xsl:template name="PageFooter" match="newspaper[@type='channel']">
  <xsl:variable name="gotoprevpageId" select="channel/gotoprevpage"/>
  <xsl:variable name="vPageTotal" select="channel/PageTotal"/>
  <xsl:variable name="vCurrentPageNum" select="channel/CurrentPageNum"/>
  <xsl:choose>
    <xsl:when test="channel/CurrentPageNum &gt; 1 ">
       <a href="{$gotoprevpageId}" class="black_14_2"> <font color = "#0000FF">上一页</font></a>
    </xsl:when>
    <xsl:otherwise>
       <span class="black_14_2"> <font color = "#000000">上一页</font></span>
    </xsl:otherwise>
  </xsl:choose>
  <xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
  <span class="black_14_2"> <xsl:value-of select="channel/CurrentPageNum"/>/<xsl:value-of select="channel/PageTotal"/> </span>
  <xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
  <xsl:choose>
    <xsl:when test="channel/CurrentPageNum &lt; channel/PageTotal">
       <xsl:variable name="gotonextpageId" select="channel/gotonextpage"/>
       <a href="{$gotonextpageId}"  class="black_14_2"> <font color = "#0000FF">下一页</font></a>
    </xsl:when>
    <xsl:otherwise>
       <span class="black_14_2"> <font color = "#000000">下一页</font></span>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template name="InsertPageFooter">
  <tr>
    <td>
      <table align="right" >
        <tr>
          <td align="right" valign="center" style="float:right; width:150; height:20; padding-right:0px;">
            <xsl:call-template name="PageFooter">
            </xsl:call-template>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</xsl:template>

<!-- channel newspaper -->
<xsl:template match="newspaper[@type='channel']">
  <html>
    <head>
      <title></title>
      <xsl:copy-of select="$common-styles"/>
      <style>
          div.newspapertitle { margin-bottom: 12px; border-bottom: 1px dashed silver;  }
      </style>
    </head>
    <body>
      <table width="100%"  border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <xsl:variable name="Images" select="ImagesDir"/>
            <td align="center" valign="top" background="{$Images}/0089.gif">
              <table width="95%"  border="0" align="center" cellpadding="5" cellspacing="0">
                <tr>
                  <td height="30" colspan="2" align="left" valign="center"  class="black_18">
                   <xsl:value-of select="title" disable-output-escaping="yes"/>
                  </td>
                </tr>

                <xsl:if test="channel/PageTotal &gt; 1">
                  <xsl:call-template name="InsertPageFooter">
                  </xsl:call-template>
                </xsl:if>

                <xsl:if test="channel/SubscribeLink">
                <tr>
                  <xsl:variable name="SubChannelLink" select="channel/SubscribeLink"/>
                  <xsl:text disable-output-escaping="yes">&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;</xsl:text>
                  <td height="50"> <a href="{$SubChannelLink}" class="black_14_2"><font color = "#0000FF">订阅此频道</font></a></td>
                </tr>
                </xsl:if>

                <tr>
                <xsl:if test="channel/image">
                  <xsl:variable name="imgurl" select="channel/image/url"/>
                  <xsl:variable name="imgtitle" select="channel/image/title"/>
                  <xsl:variable name="imglink" select="channel/image/link"/>
                  <td colspan="2" class="black_18" align="center">
                    <a href="{$imglink}"><img class="channel" src="{$imgurl}" alt="{$imgtitle}" align="bottom"  border="0" /></a>
                  </td>
                </xsl:if>
                </tr>
                <tr>
                  <td height="5"> </td>
                </tr>

                <xsl:for-each select="channel/item">
                 <xsl:sort select="sortKey" data-type="number" order="ascending"/>
                  <tr>
                    <tr>
                       <xsl:variable name="itemlink" select="link"/>
                       <td align="center" class="white_14"><span class="black_18">
                         <a href="{$itemlink}" class="black_18"><xsl:value-of select="title" disable-output-escaping="yes"/></a></span>
                       </td>
                    </tr>

                    <tr>
                      <td height="5" ></td>
                    </tr>
                    <tr>
                        <td><span class="black_14_2"><xsl:value-of select="description"  disable-output-escaping="yes"/></span></td>
                    </tr>
                    <tr align="right">
                       <td class="black_14_2"><span class="black_14_2">[ <xsl:value-of select="dateDisplay"/> ]</span></td>
                    </tr>
                  </tr>
                </xsl:for-each>

                <xsl:if test="channel/PageTotal &gt; 1">
                  <xsl:call-template name="InsertPageFooter">
                  </xsl:call-template>
                </xsl:if>

                <tr>
                  <td height="10"></td>
                </tr>                

              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
</xsl:template>

<!-- single news item -->
<xsl:template match="newspaper[@type='newsitem']">
  <html>
    <head>
      <title></title>
      <xsl:copy-of select="$common-styles"/>
      <style>
         .newsitemfooter { text-align: right; margin-top: 14px; padding-top: 6px; border-top: 1px dashed #CBCBCB; }
      </style>
    </head>
	<body>
	  <table width="100%" height="100%"  border="0" align="center" cellpadding="0" cellspacing="0">
	    <tbody>
        <xsl:for-each select="channel/item">
          <tr>
            <xsl:variable name="Images" select="ImagesDir"/>
            <td align="center" valign="top" background="{$Images}/0089.gif">
              <table width="95%"  border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td height="10" >
                  </td>
                </tr>
                <tr>
                   <xsl:variable name="itemnewsId" select="newsId"/>
                   <xsl:variable name="itemlink" select="link"/>
                   <td height="30" align="center" valign="middle"  class="white_14" id="{$itemnewsId}">
                     <a href="{$itemlink}"  class="black_18">
                       <xsl:value-of select="title" disable-output-escaping="yes"/>
                     </a>
                   </td>
                </tr>

                <tr>
                  <td height="5" ></td>
                </tr>

                <tr>
                   <td><span class="black_14_2"><xsl:value-of select="description"  disable-output-escaping="yes"/></span></td>
                </tr>

                <tr>
                  <td height="10" ></td>
                </tr>

                <tr>
                  <td height="25" class="black_14_2" >
                     <a href="{$itemlink}"><span class="black_12"><font color = "#0000FF">阅读全文</font></span></a>
                  </td>
                </tr>

                <tr align="right">
                   <td class="black_14"><span class="black_14_2">[ <xsl:value-of select="dateDisplay"/> ]</span></td>
                </tr>

              </table>
            </td>
            <!-- add link to comments if available -->
            <tr>
              <td class="newsitemfooter">
                <xsl:if test="comments">
                <xsl:variable name="commentlink" select="comments"/>
                <xsl:variable name="commentimg" select="commentsImage"/>
                <a href="{$commentlink}"><img src="{$commentimg}" border="0" hspace="6"/></a>
                </xsl:if>
              </td>
            </tr>
          </tr>
  		</xsl:for-each>
        </tbody>
	  </table>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>