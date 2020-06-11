<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>

<xsl:variable name="common-styles">
	<style type="text/css">
                body,td,th {                
                	background-color: #0;
                }
                html { border: 0px solid gray; }
                body {
                	background-color: #FFFFFF;
                	margin-top: 0px;
                	margin-left: 0px;
                	margin-right: 0px;
                	margin-bottom: 0px;
                }
                a:hover {
                	color: #AF0000;
                	text-decoration: underline;                 	
                }
                a:link{
                	color: #000000;               	               
                }
                .black_12 {
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                	font-size: 12px;
                	color: #000000;
                	text-decoration: none;
                	line-height: 20px;
                }                            
                .black_14 {
                	font-size: 14px;
                	line-height: 25px;
                	color: #000000;
                	font-family: Verdana, Arial, Helvetica, sans-serif;
              	        text-decoration: none;        
                }               
                .black_14_2{
                	font-size: 14px;
                	line-height: 1.5;
                	color: #000000;
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                    text-decoration: none;
                }     
                .black_16{
                	font-size: 16px;
                	line-height: 1.5;
                	color: #000000;
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                    text-decoration: none;
                }                                                                           
                .black_18 {
                	font-family: "宋体";
                	font-size: 18px;
                	font-weight: bold;
                	color: #4f5394;
                	text-decoration: none;
                }                
                .black_24 {
                	font-family: "妤蜂綋_GB2312";
                	font-size: 24px;
                	color: #000000;
                	text-decoration: none;
                }                
                .b9_12 {
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                	font-size: 12px;
                	font-weight: normal;
                	color: #999999;
                	text-decoration: none;                
                }                	        
		.channel {margin-top: 4px}; 		                               	        	                		
                	
                }                                
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
  <span> <xsl:value-of select="channel/CurrentPageNum"/>/<xsl:value-of select="channel/PageTotal"/> </span>
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
          <table width="95%"  border="0" align="center" cellpadding="0" cellspacing="0">

            <tr>
              <td class="black_14">
                <strong>
                  <xsl:value-of select="title" disable-output-escaping="yes"/>
                </strong>
               </td>
            </tr>

            <tr>
              <td height="1" bgcolor="#999999">
              </td>
            </tr>

            <xsl:if test="channel/PageTotal &gt; 1">
              <xsl:call-template name="InsertPageFooter">
              </xsl:call-template>
            </xsl:if>

            <xsl:if test="channel/SubscribeLink">
            <tr>
              <td>
              <table >
                <tr>
                  <xsl:variable name="SubChannelLink" select="channel/SubscribeLink"/>
                  <td height="50" width="100"> <a href="{$SubChannelLink}" class="black_14_2"><font color = "#0000FF">订阅此频道</font></a></td>
                  <xsl:variable name="GoBackLink" select="channel/GoBack"/>
                  <td height="50" width="100"> <a href="{$GoBackLink}" class="black_14_2"><font color = "#0000FF">返回</font></a></td>
                </tr>
              </table>
              </td>
            </tr>
            </xsl:if>
          </table>

          <xsl:if test="channel/image">
          <table width="90%"  border="0" align="center" cellpadding="5" cellspacing="0">
            <tr>
              <xsl:variable name="imgurl" select="channel/image/url"/>
              <xsl:variable name="imgtitle" select="channel/image/title"/>
              <xsl:variable name="imglink" select="channel/image/link"/>
              <td class="black_14">
                <a href="{$imglink}"><img  src="{$imgurl}" alt="{$imgtitle}" align="top"  border="0" /></a>
              </td>
            </tr>
            <tr>
              <td height="5" ></td>
            </tr>
          </table>
          </xsl:if>

          <xsl:for-each select="channel/item">
          <xsl:sort select="sortKey" data-type="number" order="ascending"/>
          <table width="90%"  border="0" align="center" cellpadding="5" cellspacing="0">
            <tr>
              <xsl:variable name="itemnewsId" select="newsId"/>
              <xsl:variable name="itemlink" select="link"/>
              <xsl:variable name="IsRead" select="ReadFlag"/>
              <xsl:choose>
                <xsl:when test="ReadFlag">
                  <td class="black_14">
                    <STRONG>
                      <A class="black_14" href="{$itemlink}" id="{$itemnewsId}">
                       <font color="#808080">  <xsl:value-of select="title" disable-output-escaping="yes"/> </font>
                      </A>
                    </STRONG>
                  </td>
                </xsl:when>
                <xsl:otherwise>
                  <td class="black_16">                   
                    <STRONG>
                        <A class="black_16" href="{$itemlink}" id="{$itemnewsId}"><xsl:value-of select="title" disable-output-escaping="yes"/>
                        </A>
                    </STRONG>
                  </td>
                </xsl:otherwise>
              </xsl:choose>
            </tr>

            <tr>
              <td class="black_14"><SPAN class="black_14_2"><xsl:value-of select="description"  disable-output-escaping="yes"/></SPAN></td>
            </tr>

            <tr>              
              <td height="20" class="black_14"><SPAN class="b9_12">[ <xsl:value-of select="dateDisplay"/> ]</SPAN></td>
            </tr>

            <tr>
              <td>
              <table>
                <xsl:variable name="Images" select="ImagesDir"/>
  
                <xsl:variable name="DetailLink" select="ReadDetailLink"/>
                <td height="20" class="black_14_2" width="50">
                  <a href="{$DetailLink}">全文</a>
                </td>
                
                <xsl:if test="ForwardlNewsLink">                
                <td height="20" class="black_14_2" align="Left" width="50">
                  <xsl:variable name="ForwardlLink" select="ForwardlNewsLink"/>                  
                  <a href="{$ForwardlLink}">转发</a>
                </td>
                </xsl:if>
                
                <xsl:if test="ArchiveNewsLink">
                <td height="20" class="black_14_2" align="Left">
                  <xsl:variable name="ArchiveLink" select="ArchiveNewsLink"/>
                  <a href="{$ArchiveLink}">收藏</a>
                </td>
                </xsl:if>                
                
              </table>
              </td>
            </tr>

            <tr>
              <td height="30">
              </td>
            </tr>

          </table>
          </xsl:for-each>
                       
          <table width="95%"  border="0" align="center" cellpadding="0" cellspacing="0">
            <xsl:if test="channel/PageTotal &gt; 1">
              <xsl:call-template name="InsertPageFooter">
              </xsl:call-template>
            </xsl:if>
          </table>

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
	     .newsitemfooter { text-align: right; margin-top: 14px; padding-top: 4px;  }
	  </style>
	</head>
	<body>
      <table width="95%"  border="0" align="center" cellpadding="2" cellspacing="0">
        <tbody>
          <tr>
            <td height="5"> </td>
          </tr>
          <xsl:for-each select="channel/item">
          <tr>
            <xsl:variable name="itemlink" select="link"/>
            <td class="black_12">
            </td>
          </tr>
          <tr>
            <xsl:if test="from">
            <td class="black_12"><SPAN class="b9_12"> </SPAN> </td>
            </xsl:if>
          </tr>
          <tr>
            <xsl:if test="dateDisplay">
              <td class="black_12"><SPAN class="b9_12"> </SPAN> </td>
            </xsl:if>
          </tr>
         
          <tr>
            <td class="black_14"><SPAN class="black_14_2"><xsl:value-of select="description"  disable-output-escaping="yes"/></SPAN></td>
          </tr>
          <tr>
            <xsl:variable name="itemnewsId" select="newsId"/>
            <td height="10" id="{$itemnewsId}"></td>
          </tr>
          <tr>
            <td height="25" class="black_14_2">
               <a href="{$itemlink}" id="rss_details"><font color = "#0000FF"><!--阅读全文--></font></a>
            </td>
          </tr>
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
          </xsl:for-each>
        </tbody>
      </table>
      <span class="black_24"></span>
	</body>
  </html>
</xsl:template>

</xsl:stylesheet>