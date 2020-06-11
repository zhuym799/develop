var g_HtmlEditID = "fox_html_content";
var g_TextEditID = "fox_html_content_plaintext";
var g_EditBoxID = "fox_html_content_box";
var g_Macros = null;
var g_curSignatureElement = null;
var g_StationeryMode = false;
var g_TextMode = false;


//Delphi调用的方法
function D2J_SetFocusToContent(bRemove){
	try {
		var dom = null;
		if (g_TextMode) {
			dom = GetJQueryObject(g_TextEditID);
		} else {
			dom = GetJQueryObject(g_HtmlEditID);
			var tempDom = dom.find('#divFMContentBody');
			if (tempDom.length > 0 &&
				tempDom.attr('contenteditable') === 'true'){
				dom = tempDom;
			}

			var cursor = dom.find('#_FoxCURSOR');
			if (cursor.length > 0){
				dom = cursor;
				if (bRemove) {
					dom.removeAttr('id');
				}
				SetFocusToNode(dom[0], 2);
				return;
			}
		}
		SetFocusToNode(dom[0]);
	}catch(e) { }
}

function SetSignature(id, value, showSeperator, seperatorID, seperatorWidth){
	try {
		if (g_curSignatureElement != null){
			ExecuteIgnoreException(function(){
				g_curSignatureElement.html(value);
			});
			g_curSignatureElement = null;
		}else{
			var dom = GetJQueryObject(id);
			if (dom.length > 0){
				ExecuteIgnoreException(function(){
					dom.html(value);
				});
			}else{
				var html = $(value).html();
				html = '<DIV ID="_FoxCURSOR"><BR/></DIV><DIV><SPAN ID="'+id+'">' + value + '</SPAN></DIV><DIV><BR/></DIV>';
				document.execCommand('InsertHTML', null, html);
				var cursor = GetJQueryObject("_FoxCURSOR");
				SetFocusToNode(cursor[0]);
			}
		}
	}catch(e) { }
}

//检测当前DOM是否在Table内部，是则检测该Table是否有背景色样式。没有则添加。
//防止在调用ExecCommand的InsertHTML等方法时，DOM调整过程中背景色设置不一致导致显示不正确的问题。
function CheckTableBackgroundColor(domObject) {
	var table = domObject.closest('table');
	if (table.length > 0) {
		if (table.attr('bgcolor') && table.attr('bgcolor') !== '') {
			table.css('background-color', table.attr('bgcolor'));
		}else if (table.attr('background') && table.attr('background') !== '') {
			table.css('background-color', 'transparent');
		}
	}
}

function CheckStationery(){
	try{
		var divContent = $('#divFMContentBody');
		var content = GetJQueryObject(g_HtmlEditID);
		if (divContent.length > 0){
			divContent.attr('contenteditable', 'true');
			content.css('padding', '0px');
			content.removeAttr('contenteditable');
			CheckTableBackgroundColor(divContent);
			g_StationeryMode = true;
			doResize();
		}else{
			content.css('padding', '10px');
			content.removeAttr('background');
			content.attr('contenteditable', 'true');
			g_StationeryMode = false;
			doResize();
		}
		setTimeout(function(){
	    document.execCommand('SpellCheckAll', null, null);}, 1000);
	}catch(e){ 
		//alert(e); 
	}
}


function RemoveStationery(id, bSetFocus){
	try{
		var divContent = $('#divFMContentBody');
		var content = GetJQueryObject(g_HtmlEditID);
		if (divContent.length > 0){
			ExecuteIgnoreException(function(){
				content.html(divContent.html());
			});
		} 
		content.css('padding', '10px');
		content.removeAttr('background');
		content.attr('contenteditable', 'true');
		g_StationeryMode = false;
		doResize();
		if (bSetFocus) D2J_SetFocusToContent();
	}catch(e){ 
		//alert(e); 
	}
}

function ApplyStationery(strFileContent, bSetFocus){
	try{
		var contentBodyID = 'divFMContentBody';
		var divContent = GetJQueryObject(contentBodyID);
		var content = GetJQueryObject(g_HtmlEditID);
		var strDIVContent = '';
		if (divContent.length > 0){
			strDIVContent = divContent[0].outerHTML;
		}else{
			strDIVContent = '<DIV id="'+contentBodyID+'">'
				+ content.html()
				+ '<DIV id="divFMReplyBody"></DIV></DIV>';
		}
		content.html(strFileContent);
		divContent = GetJQueryObject(contentBodyID);
		if (divContent.length > 0){
			ExecuteIgnoreException(function(){
				divContent[0].outerHTML = strDIVContent;
			});
		}
		divContent = GetJQueryObject(contentBodyID);
		divContent.attr('contenteditable', 'true');
		CheckTableBackgroundColor(divContent);
		content.css('padding', '0px');  //为了平铺信纸，这里padding故设置为0
		content.removeAttr('contenteditable');
		g_StationeryMode = true;
		doResize();
		if (bSetFocus) D2J_SetFocusToContent();
	}catch(e){ 
		//alert(e); 
	}
}
function GetGlobalStyleFromHTML(html){
	var cssText = '';
	var s1 = html.indexOf('<style class="fox_global_style">');
	if (s1 >= 0){
		var s2 = html.indexOf('</style>', s1);
		if (s2 > s1){
			cssText = html.substring(s1+32, s2);
		}
	}
	return cssText;
}

//ctHTMLMode: 超文本标间
//ctTextMode: 源码编辑
//ctPlainTextMode: 纯文本

//ctHTMLMode <==> ctTextMode
function FoxHTMLEditor_ChangeEditMode(id, type){
	try {
		var html_edit = GetJQueryObject(id);
		var text_edit = GetJQueryObject(g_TextEditID);
		if (type == 0){ //ctHTMLMode
			var html = text_edit.text();
			var cssText = GetGlobalStyleFromHTML(html);
			$('style:eq(0)').html(cssText);
			html_edit.find('.fox_global_style').remove();
			ExecuteIgnoreException(function(){
				html_edit.html(html);
			});
			text_edit.hide();
			html_edit.show();
			text_edit.text('');
			g_TextMode = false;
		}else if (type == 1){ //ctTextMode 源码编辑
			html_edit.find('.fox_global_style').remove();
			var html = html_edit.html();
			var cssText = $('style:eq(0)').html();
			if (cssText && cssText !== '') html = '<style class="fox_global_style">' + cssText + '</style>' + html;
			text_edit.text(html);
			html_edit.hide();
			text_edit.show();
			html_edit.html('');
			g_TextMode = true;
		}
	} catch (e) {  }
	return true;
}

//ctPlainTextMode ==>ctHTMLMode
function FoxHTMLEditor_PlainTextModeToHtmlMode(id, content){
	try {
		var html_edit = GetJQueryObject(id);
		var text_edit = GetJQueryObject(g_TextEditID);
		html_edit.find('.fox_global_style').remove();
		ExecuteIgnoreException(function(){
			html_edit.html(content);
		});
		text_edit.hide();
		html_edit.show();
		text_edit.text('');
		//因为当应用信纸时，padding，contenteditable 会被修改, 故转会纯文本要确保设置回来!!!
		html_edit.css('padding', '10px');
		html_edit.attr('contenteditable', 'true'); 
		g_TextMode = false;
	} catch (e) {  }
	return true;	
}

//ctTextMode  ==> ctPlainTextMode (源码 ==> 纯文本)
//ctHTMLMode  ==> ctPlainTextMode
function FoxHTMLEditor_ChangeToPlainTextMode(id, content){
	try {
		var html_edit = GetJQueryObject(id);
		var text_edit = GetJQueryObject(g_TextEditID);	
		html_edit.find('.fox_global_style').remove();
		text_edit.html(content);		
		html_edit.hide();
		text_edit.show();
		html_edit.html('');
		g_TextMode = true;	
	} catch (e) {  }
	return {content: content};	
}


function FoxHTMLEditor_SetText(id, text){
	GetJQueryObject(id).text(text);
}

function FoxHTMLEditor_SetPlainEditorHtml(html){	
	GetJQueryObject(g_TextEditID).html(html);
	g_TextMode = true;
}

function SetCursor(isBrushFormat){	
	if (g_TextMode) retrun;
	var editor = GetJQueryObject(g_HtmlEditID);	
	if (isBrushFormat) {
		editor.addClass('brush_format');	
	} else {
		editor.removeClass('brush_format');		
	}
}

function D2J_FormatBrush(){
	SetCursor(true);
	if (g_FormatBrushEnable) return;
	var curSel = window.getSelection();
	if (curSel.rangeCount = 0) return;
	var range = curSel.getRangeAt(0);
	g_FormatBrushEnable = true;
	var curStyles = GetCurrentFullFontStyle();
	var FormatBrushMouseDown = function(){
		if (!g_FormatBrushEnable){
			//unbind
			$(document).unbind('mousedown', FormatBrushMouseDown);
			$(document).unbind('mouseup', FormatBrushMouseUp);
		}
	};
	var FormatBrushMouseUp = function(){
		$(document).unbind('mousedown', FormatBrushMouseDown);
		$(document).unbind('mouseup', FormatBrushMouseUp);
		ApplyStyles(curStyles);
		J2D_FormatBrushEnd();
		g_FormatBrushEnable = false;
		SetCursor(false);
	};
	$(document).bind('mousedown', FormatBrushMouseDown);
	$(document).bind('mouseup', FormatBrushMouseUp);
}

function CheckFMContentBody(node){
	try{
		var el = $(node).find('#divFMReplyBody');
		if (el.length > 0){
			ExecuteIgnoreException(function() {
				el[0].outerHTML = '<DIV>' + el[0].innerHTML + '</DIV>';
			});
		}
		el = $(node).find('#divFMContentBody');
		if (el != null){
			ExecuteIgnoreException(function() {
				el.html(el.html() + '<DIV id="divFMReplyBody"></DIV>');
			});
		}
	}catch(e) { }
}
function GetTextAndHtml(eID, XRcptTo, bWaitSend, bTemplate){
	var editor = document.getElementById(eID);
	if (editor == null) return {text: '', html: '', imgcidlist: [], imglist: []};
	try {
		//移除多余的样式
		RemoveUnuseCssStyle(g_EditBoxID);
		//移除图片辅助标记
		ClearFoxIMGMark();
		var ctText = g_TextMode;
		var node = null;
		if (g_TextMode) node = document.getElementById(g_TextEditID).cloneNode(true);
		else node = document.getElementById(g_HtmlEditID).cloneNode(true);
		//如果是模版编辑 确保divFMContentBody的结尾存在divFMReplyBody
		if (bTemplate) {
			CheckFMContentBody(node);
			//修正中间版本保存的模版重复生成多个_FoxCURSOR标记导致光标位置的宏不能正常生效的问题。
			var cursor = $(node).find('#_FoxCURSOR');
			while (cursor.length > 0){
				cursor.removeAttr('id');
				cursor = $(node).find('#_FoxCURSOR');
			}
		}
		//替换图片路径生成ContentIds
		var ContentIds = ReplaceResourcesSrc(node);
		//
		var templist = $(node).find('#divFMContentBody');
		if (templist.length > 0){
			templist.removeAttr('contenteditable');
			templist.css('min-height', '');
		}
		//
		var text = node.innerText;
		var html = '';
		var ignore_list = [];
		if (XRcptTo) ignore_list = ['_FoxTONAME', '_FoxTOADDR'];
		if (!ctText) {
			RemoveUnuseTag($(node), g_Macros, ignore_list, bWaitSend);
			html = node.innerHTML;
		} else {
			html = node.innerText;
			var css = GetGlobalStyleFromHTML(html);
			$('style:eq(0)').html(css);
			ExecuteIgnoreException(function() {
				$(node).html(html);
			});
			$(node).find('.fox_global_style').remove();
			RemoveUnuseTag($(node), g_Macros, ignore_list, bWaitSend);
			html = $(node).html();
		}
		//获取全局样式
		var styles = $(document).find('style');
		var cssText = '';
		if (styles.length > 0){
			cssText = styles.get(0).outerHTML.trim();
		}
		if (cssText !== ""){
			cssText = cssText.replace(/div.fox_html_content/g, "body");
		};
		//去掉多余的换行
		html = html.replace(/\n+/g, "\n");
		html = html.replace(/\r+/g, "\r");
		//样式转换
		var removeClassList = ['fox_html_content'];
		var retObj = ApplyInlineStyle(html, removeClassList);
		html = retObj.html;

		// 过滤掉<!--[if mso 9]--><!--[endif]-->
		html = FoxUtils.FilterIfMso9Comment(html);
		
		return {htmlMode: !ctText, text: text, html: html, 
			imgcidlist: ContentIds.imgcidlist, imglist: ContentIds.imglist,
			cssText: cssText};
	}catch(e) { 
		return {text: '', html: '', imgcidlist: [], imglist: []};
	}
}
//替换资源路径
function ReplaceResourcesSrc(node){
	var contentIdCount = 0;
	var CreateContentId = function(){
		countIdCount = contentIdCount + 1;
		return '_Foxmail.' + countIdCount + '@' + NewGuid();
	}
	var imageList = new Map();
	var imgcidlist = new Array();
	var imglist = new Array();
	var addCidToList = function (src, bChecked){
		var ret = {needReplace: false, cid: ''};
		var bNeedReplace = false;
		if (!bChecked) {
			if (src.indexOf('file://') == 0){
				bNeedReplace = true;
			}
		}else bNeedReplace = true;
		if (bNeedReplace){
			var contentId = imageList.get(src);
			if (contentId == null){
				contentId = CreateContentId();
				imageList.put(src, contentId);
				//记录cid readpath
				imglist.push(src);
				imgcidlist.push(contentId);
			}else{
				contentId = imageList.get(src);
			}
			ret.needReplace = bNeedReplace;
			ret.cid = contentId;
		}
		return ret;
	}
	$(node).find('img').each(function(){
		var src = this.src;
		var ret = addCidToList(src);
		if (ret.needReplace){
			this.src = 'cid:' + ret.cid;
		}
	});
	$(node).find('*').each(function(){
		var src = this.style['backgroundImage'] || 
			document.defaultView.getComputedStyle(this, "").getPropertyValue('background-image');
		if (!src || (src === "")) src = $(this).attr('background');
		if (src && (src !== "")){
			//url(xxx)
			var s1 = src.indexOf('url(');
			if (s1 == 0){
				s1 = s1 + 4;
				var s2 = src.indexOf(')', s1);
				if (s2 > s1){
					var filepath = src.substring(s1, s2);
					var ret = addCidToList(filepath);
					if (ret.needReplace){
						this.style['backgroundImage'] = 'url(cid:' + ret.cid + ')';
					}
				}
			}else {
				var temp = src.toLowerCase();
				if ((temp.indexOf('file://') == 0) || (temp.indexOf(':\\') > 0) || (temp.indexOf(':/') > 0)){
					var ret = addCidToList(src, true);
					if (ret.needReplace){
						$(this).attr('background', ('cid:' + ret.cid));
					}
				}
			}
		}
	});
	$(node).find('audio').each(function(){
		var src = this.src;
		var ret = addCidToList(src);
		if (ret.needReplace){
			this.src = 'cid:' + ret.cid;
		}
	});
	return {imgcidlist: imgcidlist, imglist: imglist};
}
//样式处理
function RemoveRuleStyleBySelector(selectorText){
	try {
		var styleSheetList = document.styleSheets;
		for (var i=0; i<styleSheetList.length; i++){
			var styleSheet = styleSheetList[i];
			if (styleSheet.ownerNode.tagName == 'STYLE'){
				var rules = styleSheet.rules;
				for (var j=0; j<rules.length; j++){
					var item = rules[j];
					if (item.selectorText == selectorText){
						styleSheet.removeRule(j);
						break;
					}
				}
			}
		}
	}catch(e) { }
}
function GetSelectorStyleCssText(selectorText){
	var styleSheetList = document.styleSheets;
	var cssText = "";
	try {
		for (var i=0; i<styleSheetList.length; i++){
			var styleSheet = styleSheetList[i];
			if (styleSheet.ownerNode.tagName == 'STYLE'){
				var rules = styleSheet.rules;
				for (var j=0; j<rules.length; j++){
					var item = rules[j];
					if (item.selectorText == selectorText){
						var style = item.style;
						//style.cssText 是STYLE标签里面定义的样式 可能存在覆盖的情况 所以这里要获取真实样式
						var nodes = GetJQueryObject(g_HtmlEditID).find(selectorText); //获取该选择器元素合集
						if (nodes.length > 0){
							var element = nodes.get(0);
							var allStyle = document.defaultView.getComputedStyle(element, null);
							for (var k=0; k<style.length; k++){
								var key = style[k];
								var value = allStyle[style[k]];
								cssText = cssText + key + ": " + value + "; ";
							}
						}
						return cssText;
					}
				}
			}
		}
	}catch(e) { }
	return cssText;
}
function RemoveUnuseCssStyle(eid){
	try{
	var elements = GetJQueryObject(eid);
	elements.find('style').each(function(){
		var style = this;
		var sheet = style.sheet;
		var rules = sheet.rules;
		var cssText = "";
		try{
			for (var j=0; j<rules.length; j++){
				var item = rules[j];
				if (Object.prototype.toString.call(item) === '[object CSSStyleRule]'){
					var selectorText = item.selectorText;
					if (selectorText != undefined){
						var nodes = elements.find(selectorText);
						if (nodes.length > 0){
							cssText = cssText + item.cssText;
						}
					}
				}
			}
			cssText = cssText.trim();
		}catch(err){
			//
		}
		if (cssText === ""){
			$(style).remove();
		}else{
			style.innerHTML = cssText;
		}
	});

	}catch(e){
		//alert(e);
	}
}
function ReplaceNodeToHTML(text, html){
	var node = window.getSelection().anchorNode;
	var offset = window.getSelection().anchorOffset;
	if (node){
		var nodeText = node.textContent;
		var s1 = nodeText.substring(0, offset);
		var s2 = nodeText.substring(offset);
		var i = s1.lastIndexOf(text);
		var preText = s1.substring(0, i);
		var str = preText + html + s2;
		$(node).remove();
		J2D_ExecCommand('InsertHTML', null, str);
	}
}
function D2J_SpellCheckAllText(){
   document.execCommand('SpellCheckAll', null, null);
}

function D2J_EnableSpellCheck(enabled){   
  document.execCommand('EnableSpellCheck', null, enabled ? '1' : '0');
}


function doResize(){
	var htmlEdit = GetJQueryObject(g_HtmlEditID);
	var textEdit = GetJQueryObject(g_TextEditID);
	var editBox = GetJQueryObject(g_EditBoxID);
	resize(editBox, htmlEdit, textEdit);
}
function resize(box, html_edit, text_edit){
	var clientHeight = document.body.clientHeight;
	var height_fix = 22;
	var height = clientHeight - height_fix;
	box.css('min-height', height+'px');
	html_edit.css('min-height', height+'px');
	text_edit.css('min-height', height+'px');
	if (g_StationeryMode) {
		$('#divFMContentBody').css('min-height', height+'px');
	}
}
$(document).ready(function(){
	var htmlEdit = GetJQueryObject(g_HtmlEditID);
	var textEdit = GetJQueryObject(g_TextEditID);
	var editBox = GetJQueryObject(g_EditBoxID);
	resize(editBox, htmlEdit, textEdit);
	g_Macros = J2D_GetMacros();
	$(window).resize(function(){
		resize(editBox, htmlEdit, textEdit);
	});
	textEdit.bind('input', function(){
		J2D_OnInput();
	}).bind('focus', function(){
		J2D_OnFocus();
	});
	htmlEdit.bind('input', function(){
		J2D_OnInput();
	}).bind('focus', function(){
		J2D_OnFocus();
	}).bind('keydown', function(ev){
		var keyCode = ev.keyCode;
		if (keyCode == 9){
			var curSel = window.getSelection();
			var selectionText = curSel.toString();
			var anchorNode = curSel.anchorNode;
			var offset = curSel.anchorOffset;
			var bHandled = false;
			if (anchorNode && (anchorNode.nodeType == 3) && (selectionText.length == 0)){
				//var text = anchorNode.nodeValue;
				var text = anchorNode.textContent;
				//if (text.length == offset){
				J2D_OnTabEnter(text, offset);
				bHandled = true;
				//}
			}
			if (!bHandled){
				//insert tab
				PasteTab();
			}
			ev.stopPropagation();
			ev.preventDefault();
		}
	});
	$(document).on('selectionchange', function(ev){
		J2D_OnSelectionChange();
	}).bind('dragover', function(ev){
		var dataTransfer = ev.dataTransfer || ev.originalEvent.dataTransfer;
		var files = dataTransfer.files;
        var attachments = dataTransfer.getData('foxmail_attachments');
		if ((files && files.length > 0) || (attachments.length > 0)){
            dataTransfer.dropEffect = 'copy';
			ev.stopPropagation();
			ev.preventDefault();
		}
	}).bind('drop', function(ev){
		try{
            var dataTransfer = ev.dataTransfer || ev.originalEvent.dataTransfer;
            var files = dataTransfer.files;
            var attachments = dataTransfer.getData('foxmail_attachments');
            if ((files && files.length > 0) || (attachments.length > 0)){
                J2D_OnFileDropped();
				ev.stopPropagation();
				ev.preventDefault();
			}
		}catch(e){
			//alert(e);
		}
	}).bind('contextmenu', function(ev){
		var target = $(ev.target);
		if (ev.target.tagName === 'IMG') return;
		var fromName = target.closest('#_FoxFROMNAME');
		if (fromName.length > 0){
			if (window.getSelection().toString() === ""){
				g_curSignatureElement = fromName;
				J2D_OnPopupSignatureMenu(ev.clientX, ev.clientY);
				ev.preventDefault();
				return;
			}
		}
		g_curSignatureElement = null;
	});
	InitFoxEditor();
	InitAutoLink(g_HtmlEditID);
	htmlEdit.focus();
});