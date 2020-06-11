//HTMLEditor Common Function
var g_FormatBrushEnable = false;
function GetJQueryObject(id){
	return $('#'+id);
}
function InitFoxEditor(){
	$(document).bind('contextmenu', function(ev){
		var target = $(ev.target);
		if (ev.target.tagName === 'IMG'){
			ClearFoxIMGMark(); 
			target.attr('FoxIMGMark', 'Marked'); //标记
		}
	});
  if (window.J2D_GetWindowColor) {
    $(document.body).css('background-color', window.J2D_GetWindowColor());
  }
}
function InitAutoLink(id, options){
	if (options == null) options = {NeedCtrl: true};
	var dom = document.getElementById(id);
	if (dom != null){
		var g_activeLink = null;
		$(dom).delegate('a', 'click', function(ev){
			var mEvent = ev.originalEvent;
			//altKey shiftKey ctrlKey
			if (mEvent.button == 0){
				var openURL = false;
				if (options.NeedCtrl){
					openURL = mEvent.ctrlKey;
				}else openURL = true;
				if (openURL){
					var url = $(ev.target).closest('a').attr('href');
					J2D_OpenURL(url);
					ev.stopPropagation();
					ev.preventDefault();
				}
			}
		}).delegate('a', 'mouseenter', function(ev){
			g_activeLink = ev.target;
		}).delegate('a', 'mouseleave', function(ev){
			$(ev.target).removeClass('fox_hand');
			g_activeLink = null;
		});
		$(dom).bind('keyup', function(ev){
			try{
				var keyCode = ev.keyCode;
				if (keyCode == 17){
					if (g_activeLink){
						$(g_activeLink).removeClass('fox_hand');
					}
				}
			}catch(e){ }
		}).bind('keydown', function(ev){
			try{
				var keyCode = ev.keyCode;
				var InsertLink = function(url){
					var fontStyle = GetCurrentFullFontStyle();
					var cssFull = GetCSSStyleTextFromStyleItem(fontStyle);
					var css = GetCSSStyleTextFromStyleItemWithoutColorAndTextDecoration(fontStyle);
					var text_arr = url.split(' ');
					var url_text = text_arr[text_arr.length-1];
					text_arr.length = text_arr.length - 1;
					var text = text_arr.join(' ');
					text = text.replace(/</g, '&lt;');
					text = text.replace(/>/g, '&gt;');
					var link = '<span style=\'' + cssFull + '\'>' + text + '</span> <a href="' + url_text + '" style=\'' + css + '\'>' + url_text + '</a><span style=\'' + cssFull + '\'>&nbsp;</span>';
					document.execCommand('inserthtml', null, link);
				};
				var InsertMailto = function(email){
					var fontStyle = GetCurrentFullFontStyle();
					var cssFull = GetCSSStyleTextFromStyleItem(fontStyle);
					var css = GetCSSStyleTextFromStyleItemWithoutColorAndTextDecoration(fontStyle);
					var text_arr = email.split(' ');
					var strEmail = text_arr[text_arr.length-1];
					text_arr.length = text_arr.length - 1;
					var text = text_arr.join(' ');
					text = text.replace(/</g, '&lt;');
					text = text.replace(/>/g, '&gt;');
					var link = '<span style=\'' + cssFull + '\'>' + text + '</span> <a href="mailto:' + strEmail + '" style=\'' + css + '\'>' + strEmail + '</a><span style=\'' + cssFull + '\'>&nbsp;</span>';
					document.execCommand('inserthtml', null, link);
				};
				switch (keyCode){
					case 17:{
						if (g_activeLink){
							if (!$(g_activeLink).hasClass('fox_hand')){
								$(g_activeLink).addClass('fox_hand');
							}
						}
						break;
					}
					//case 9:
					case 13:
					case 32:{
						var anchorNode = window.getSelection().anchorNode;
						if (anchorNode.nodeType == 3){
							var pNode = anchorNode.parentElement;
							var bATag = (pNode && pNode.tagName === 'A');
							if (!bATag){
								var text = anchorNode.nodeValue;
								var bAtLast = (window.getSelection().anchorOffset == text.length);
								var bFlag = false;
								if (bAtLast){//光标在文本节点最后的时候才处理
									var arr_text = text.split(' '); //空格分割
									if (arr_text.length > 0) {
										var lastText = arr_text[arr_text.length-1].trim();
										if (IsEmailAddress(lastText)) { 
											//插入mailto
											InsertMailto(text);
											$(anchorNode).remove();
											bFlag = true;
										} else if (IsUrlLink(lastText)){
											//插入url
											InsertLink(text);
											$(anchorNode).remove();
											bFlag = true;
										}
									}
								}
								if (bFlag && keyCode == 32) {
									ev.stopPropagation();
									ev.preventDefault();
								}
							}
						}
						break;
					}
					default: break;
				}
			}catch(e){ }
		});
	}
}

function D2J_CreateLink(url){
	try {
		var selObj = window.getSelection();
		var selText = selObj.toString();
		J2D_ExecCommand('CreateLink', null, url);
		if (selText == ''){
			var node = selObj.anchorNode;
			var offset = selObj.anchorOffset;
			var range = document.createRange();
			range.setStartAfter(node, offset);
			selObj.removeAllRanges();
			selObj.addRange(range);
		}
	}catch(e) { }
}

function SelectAll(el){
	var range = document.createRange();
	range.selectNodeContents(el);
	sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

function SetFocusToNode(node){
	if (!node) return;
	var range = document.createRange();
	range.setStart(node, 0);
	sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

function SetFocusToNodeWithPos(node, pos){
	if (!node) return;
	var range = document.createRange();
	switch (pos){
		case 0: range.setStartBefore(node); break;
		case 1: range.setStart(node); break;
		case 2: range.setStartAfter(node); break;
	}
	sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

function GetCSSStyleTextFromStyleItemWithoutColorAndTextDecoration(styleItem) {
	return GetCSSStyleTextFromStyleItem(styleItem, true);
}

function GetCSSStyleTextFromStyleItem(styleItem, withoutColorAndTextDecoration) {
	try {
		var cssText = '';
		if (styleItem.FontName && styleItem.FontName.length > 0) {
			cssText = 'font-family: ' + styleItem.FontName + '; '
		}		
		
		cssText = cssText + 'font-size: ' + styleItem.FontSize + '; ';
		
		if (!withoutColorAndTextDecoration) {
			cssText = cssText + 'color: ' + styleItem.ForeColor + '; ' + 
				'background-color: ' + styleItem.BackColor + '; ';
		}
		if (styleItem.Bold){
			cssText = cssText + 'font-weight: bold; ';
		}else{
			cssText = cssText + 'font-weight: normal; ';
		}
		if (styleItem.Italic){
			cssText = cssText + 'font-style: italic;';
		}else{
			cssText = cssText + 'font-style: normal;';
		}
		if (!withoutColorAndTextDecoration) {
			if (styleItem.Underline && styleItem.Strikethrough){
				cssText = cssText + 'text-decoration: underline line-through;';
			}else if (styleItem.Strikethrough){
				cssText = cssText + 'text-decoration: line-through;';
			}else if (styleItem.Underline){
				cssText = cssText + 'text-decoration: underline;';
			}else{
				cssText = cssText + 'text-decoration: none;';
			}
		}
		return cssText;
	} catch (e) { return ''; }
}

function GetCurrentFullFontStyle() {
	var fontStyle = {};
	try {
		var curSel = window.getSelection();
		if (curSel.rangeCount = 0) return;
		var range = curSel.getRangeAt(0);

		var activeEl = $(document.activeElement);
		fontStyle.FontName = document.queryCommandValue('FontName');
		fontStyle.FontSize = document.queryCommandValue('FontSize');

		fontStyle.ForeColor = document.queryCommandValue('ForeColor');
		fontStyle.BackColor = document.queryCommandValue('BackColor');
		if (fontStyle.BackColor === 'rgb(255, 255, 255)'){
			//当背景色是白色的时候
			var node = range.startContainer;
			if (node.nodeType == 3) node = node.parentElement;
			fontStyle.BackColor = $(node).css('background-color');
		}
		
		fontStyle.Bold = document.queryCommandState('Bold');
		fontStyle.Italic = document.queryCommandState('Italic');
		fontStyle.Underline = document.queryCommandState('Underline');
		fontStyle.Strikethrough = document.queryCommandState('Strikethrough');
	} catch (e) { }
	return fontStyle;
}

function ApplyStyles(styles){
	try{
		var cssText = GetCSSStyleTextFromStyleItem(styles);
		J2D_ExecCommand('ApplyCssStyle', null, cssText);
	}catch(e){ }
}


function AdjustMarkedImage(type, width, height){
	var list = $('img[FoxIMGMark=Marked]');
	list.each(function(){
		if (type === "sisPercent"){
			$(this).attr('width', width+'%');
			$(this).attr('height', 'auto');
		}else if (type === "sisPX"){
			$(this).attr('width', width);
			$(this).attr('height', height);
		}
	});
}
function GetMarkedImageInfo(iTag){
	var list = $('img[FoxIMGMark=Marked]');
	var width = 0, height = 0;
	list.each(function(){
		width = this.naturalWidth;
		height = this.naturalHeight;
	});
	return {iTag: iTag, Width: width, Height: height};
}

function DeleteMarkedImage(){
	var list = $('img[FoxIMGMark=Marked]');
	var range = document.createRange();
	var sel = window.getSelection();
	list.each(function(){
		//$(this).remove();
		$(this).removeAttr('FoxIMGMark');
        range.selectNode(this);
	});
	sel.removeAllRanges();
    sel.addRange(range);
	document.execCommand('delete', null, null);
}
function ClearFoxIMGMark(){
	var list = $('img[FoxIMGMark=Marked]');
	list.each(function(){
		$(this).removeAttr('FoxIMGMark');
	});
}

function InsertImage(src){
	document.execCommand("InsertImage", null, src);
}

function PasteTab() {
	var fontStyle = GetCurrentFullFontStyle();
	var css = GetCSSStyleTextFromStyleItem(fontStyle);
	PasteHTML('<span style="' + css + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
}

function PasteHTML(html, bTransform, selected, scrollToView, strWithFocus){
	try{
		html = ApplyInlineStyle(html, null, bTransform).html;
		document.execCommand("InsertHtml", null, html);
		if(strWithFocus !== '') {
			var el = $('#'+strWithFocus);
			var p = el.parent();
			p.html(el.html());
			SetFocusToNode(p[0], 2);
		}
	}catch(e) { 
	}
}
function PasteText(text, selected, scrollToView) {
	var nodeText = FoxUtils.TextToHtml(text);
	var fontStyle = GetCurrentFullFontStyle();
	var css = GetCSSStyleTextFromStyleItem(fontStyle);
	var html = '<span style=\'' + css + '\'>' + nodeText + '</span>';
	PasteHTML(html, selected, scrollToView);
}