<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" /> 

<xsl:template match="Rss">
  <html>
     <head>
	    <xsl:variable name="StyleLink" select="StyleLinkUrl"/>
        <title></title>
		<link href="{$StyleLink}" type="text/css" rel="stylesheet" rev="stylesheet"/>
     </head>
     <body>
           
        <div id="detail_body">
		
		    <!--头部的文字描述-->
            <div id="magsearcharea">
			    <div id="searchMag">
                    <span>
                        <xsl:value-of select="ShowHeadText" disable-output-escaping="yes"/>
                    </span>
					<xsl:variable name="SearchEditorId" select="SearchEditId"/>
					<xsl:variable name="SearchButtonId" select="SearchBtnId"/>	
					<xsl:variable name="SearchTextId" select="SearchText"/>	
                    <input id="{$SearchEditorId}" class="search_box" type="text" name="keyword"/>
					<input id="{$SearchButtonId}" class="submit_btn" type="submit" value="{$SearchTextId}"/>					
			    </div>
            </div>                  

            <div id="search_result">
		        <!-- 左边的列表 -->
		        <xsl:variable name="GroupsId" select="GroupListId"/>
                <div  id="{$GroupsId}">
                    <xsl:apply-templates select="Group"/>
                </div>
			
			    <!-- 右边的频道-->
                <xsl:variable name="ChannelsId" select="Channels/ChannelTableId"/>
                <div id="resultitems">
				    <xsl:apply-templates select="Channels"/>                       					
                </div>  
			
                <!--底下的页码-->    
                <div id="changepage">
                    <xsl:variable name="PageId" select="ChannelsPageId"/>
                    <div id="{$PageId}"> 										
 				        <div> <xsl:apply-templates select="PageCount"/></div>					
				  </div>	 
                </div>
			</div>
		</div>
     </body>
   </html>
</xsl:template>

<xsl:template match="Group">            
            <ul class="searchfilter">			
			    <xsl:for-each select="GroupItem">
                <xsl:variable name="GroupItemId" select="GroupId"/>
                <xsl:choose>
                  <xsl:when test="GroupSelected">
                     <li class="selected"><a href="{$GroupItemId}" ck="chooseTag" hidefocus="">
                            <xsl:value-of select="GroupName" disable-output-escaping="yes"/>
                     </a></li>
				  </xsl:when>
				  <xsl:otherwise>
                     <li><a href="{$GroupItemId}" ck="chooseTag" hidefocus="">
                            <xsl:value-of select="GroupName" disable-output-escaping="yes"/>
                     </a></li>
				  </xsl:otherwise>
				</xsl:choose>
				</xsl:for-each>
			</ul>
</xsl:template>

<xsl:template match="Channels"> 
            <xsl:apply-templates select="ChannelItem"/>                                          
</xsl:template>

<xsl:template match="ChannelItem">
                <div class ="item">
                  <xsl:variable name="ChannelItemLink" select="ChannelLink"/>
				  <xsl:variable name="SubscriptionUrl" select="SubscriptionLink"/>
				  <xsl:variable name="ChannelImage" select="ChannelImageSrc"/>
				  <xsl:variable name="ChannelImageHint" select="ChannelHint"/>
				  
            	    <a href="{$ChannelItemLink}"><img src="{$ChannelImage}" alt="{$ChannelImageHint}"/></a>
                    <div class="iteminfo">
                	    <h3 class="feedname"><a href="{$ChannelItemLink}"><xsl:value-of select="ChannelName" disable-output-escaping="yes"/></a></h3>
 						<p>
						    <xsl:value-of select="ChannelUpdate" disable-output-escaping="yes"/>
						</p>
						
                        <div class="suboperate">
                    	    <a class="rss_submit" href="{$SubscriptionUrl}">
							    <xsl:value-of select="ChannelSubmit" disable-output-escaping="yes"/>
							</a>
							 
                            <span><a href="{$ChannelItemLink}">
							    <xsl:value-of select="ChannelPreview" disable-output-escaping="yes"/>
							</a></span>
                        </div>
                    </div>				  
               </div>
</xsl:template>

<xsl:template match="PageCount">  	
                <!--上一页-->
                    <div id="topre">
                        <xsl:variable name="PrePage" select="PrePageUrl"/>                        
                        <xsl:choose>
                            <xsl:when test="CurrentPage &gt; 1">
                                <a href="{$PrePage}" class="" ck="pre"></a>
                            </xsl:when>
                            <xsl:otherwise>
						        <a href="{$PrePage}" class="disable" ck="pre"></a>                          
                            </xsl:otherwise>
                        </xsl:choose>
				    </div>			         
					<div>
		                <xsl:value-of select="CurrentPage" disable-output-escaping="yes"/>/<xsl:value-of select="TotalPage" disable-output-escaping="yes"/>
		            </div>
					<!--下一页-->
				    <div id="tonext">
					    <xsl:variable name="NextPage" select="NextPageUrl"/>
                        <xsl:choose>
                            <xsl:when test="CurrentPage &lt; TotalPage">
                                <a href="{$NextPage}" class="" ck="next"></a>                                							
                            </xsl:when>
                            <xsl:otherwise>
							    <a href="{$NextPage}" class="disable" ck="next"></a> 
                            </xsl:otherwise>
                        </xsl:choose>
				    </div>		
</xsl:template>

</xsl:stylesheet>
