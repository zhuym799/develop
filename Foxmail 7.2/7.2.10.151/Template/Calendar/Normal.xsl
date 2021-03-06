<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" /> 
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
                }
                a:visited {
                	text-decoration: none;
                }   
                a:hover {
                	text-decoration: underline;
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
                        text-decoration: underline;                	
                }                                
                .black_14 {
                	font-size: 14px;
                	line-height: 18px;
                	color: #000000;
                	font-family: Verdana, Arial, Helvetica, sans-serif;
                	text-decoration: none;
                }                                             
                .black_14_2 {
                	font-size: 14px;
                	line-height: 22px;
                	color: #000000;
                	font-family: "宋体";
                }
                .black_14_3 {
                	font-size: 14px;
                	line-height: 18px;
                	color: #edf1f4;
                	font-family: "宋体";
                }
                .black_16 {
                	font-family: "宋体";
                	font-size: 16px;
                	color: #4f5394;
                	line-height: 18px;
                	text-decoration: none;                	
                }  
                .black_18 {
                	font-family: "宋体";
                	font-size: 18px;
                	font-weight: bold;
                	color: #4f5394;
                	line-height: 30px;
                	text-decoration: none;                	
                }     
                .black_18_2 {
                	font-family: "宋体";
                	font-size: 18px;
                	color: #4f5394;
                	line-height: 20px;
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
                .DateDesc {
                	font-family: "宋体";
                	font-size: 10.5pt;
                	font-weight: bold;
                	color: #4f5394;
                	line-height: 30px;
                	text-decoration: none;                	
                }  
                .Time {
                	font-size: 10.5pt;
                	line-height: 18px;
                	color: #000000;
                	font-family: "宋体";
                }
                .Subject {
                	font-family: "宋体";
                	font-size: 10.5pt;
                	color: #4f5394;
                	line-height: 18px;            	
                }  
                .location {
                	font-size: 10.5pt;
                	line-height: 18px;   
                	color: #808080;
                	font-family: "宋体";                
                }     
                .content {
                	font-size: 10.5pt;
                	line-height: 20px;
                	color: #808080;
                	font-family: "宋体";                
                }                            	        	                		                		
	</style>
</xsl:variable>
  
  
<xsl:template match="Calendar">
		<xsl:variable name="Images" select="ImagesDir"/>  
		<html>
				<head>
						<title></title>
						<xsl:copy-of select="$common-styles"/>
						<style>
								div.newspapertitle { margin-bottom: 12px; border-bottom: 1px dashed silver;  }
						</style>
				</head>  	
				<body background="{$Images}\0089.gif">
						<div style="text-indent:20px; line-height: 50px" class="DateDesc"><xsl:value-of select="Description"/></div>
						<table width="100%"  border="0" cellspacing="0" style="empty-cells: show">
						<tbody>	
								<xsl:apply-templates select="Group" /> 
						</tbody>	
						</table>
				</body>
		</html>
</xsl:template>

<xsl:template match="Group">
		<xsl:apply-templates select="Date" /> 
		<xsl:apply-templates select="Item" /> 
</xsl:template>

<xsl:template match="Date"> 
		<tr>		          
				<td style="text-indent:20px" align="left" valign="center"  class="DateDesc">
						<xsl:value-of select="ShowDate" disable-output-escaping="yes"/>
				</td>		         		         		          
		</tr>
</xsl:template>

<xsl:template match="Item">
		<tr>    		    
		<tr>		         		                  		     		          
				<td rowspan="3"  style="text-indent:40px" align="left" width="200" valign="top">
						<span class="Time"><xsl:value-of select="Time"/></span>
				</td>		 
				<td align="left">
					  <xsl:variable name="MailId" select="MailId"/>  
						<a href="http://Type=Subject;MailId={$MailId};" title="点击打开" class="Subject" id="{$MailId}"><xsl:value-of select="Subject"/></a>
				</td>
		</tr>	             		        
		<tr align="left">                            
				<td>
					  <span class="location"><xsl:value-of select="Location"/></span>
				</td>
		</tr>                       		        
		<tr align="left">
				<td valign="top">
						<span class="content"><xsl:value-of select="Content"/></span>
				</td>
		</tr>   
		<tr>
				<td height="15"> </td> 
		</tr>		  
		</tr>	
</xsl:template>

</xsl:stylesheet>
