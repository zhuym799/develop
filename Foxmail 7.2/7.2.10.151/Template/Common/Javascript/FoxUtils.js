/**
 * FoxUtils提供一些基础工具函数。
 * @type {Object}
 */
var FoxUtils = {
	/**
	 * Translate text to html.
	 * @param {[type]} text [description]
	 */
	TextToHtml: function(text) {
		return String(text).replace(/&/g, '&amp;')
				           .replace(/"/g, '&quot;')
				           .replace(/'/g, '&#39;')
				           .replace(/</g, '&lt;')
				           .replace(/>/g, '&gt;')
				           .replace(/ /g, '&nbsp;')
				           .replace(/\t/g, '<span style=\'white-space: pre;\'>	</span>')
				           .replace(/\r/g, '')
				           .replace(/\n/g, '<br>');
	},

	/**
	 * Translate html to text.
	 * @param {[type]} html [description]
	 */
	HtmlToText: function(html) {
		return $('<div></div>').html(html).text();
	},

	/**
	 * 过滤掉<!--[if mso 9]--> <!--[endif]-->
	 * @param {[type]} html [description]
	 */
	FilterIfMso9Comment: function(html) {
		return html.replace(/<!--\[if mso 9\]-->\s*<!--\[endif\]-->/g, "");
	}
}

//
// 对于没有协议头部的href，都加上http://
//
function ReformHref(href) {
	if (href) {
		var regexp = /:\/\/|^\\\\|^mailto:|^#|^\//i;
		if (!href.match(regexp)) {
			href = 'http://' + href;
		}
	}
	return href;
}

//
// 从字符串获取邮件地址: jiapeng<jiapengchen@foxmail.com>
//
function GetAddrsFromText(text) {
	var res = [];
	var list = text.split(/,|;|\n/i);
	for (var i in list) {
		var s = list[i].match(/\<(.+)\>/i);
		if (s) {
			res[res.length] = s[1];
		}
	}
	return res;
}

//
// 从字符串获取名字: jiapeng<jiapengchen@foxmail.com>
//
function GetNamesFromText(text) {
	var res = [];
	var list = text.split(/,|;|\n/i);
	for (var i in list) {
		var s = list[i].match(/^(.+)\</i);
		if (s) {
			res[res.length] = s[1];
			continue;
		}
		s = list[i].match(/\<(.+)\@/i);
		if (s) {
			res[res.length] = s[1];
			continue;
		}
	}
	return res;
}

//
// 从字符串获取名字与地址: jiapeng<jiapengchen@foxmail.com>
//
function GetNamesAndAddrsFromText(text) {
	function GetName(s) {
		var s = list[i].match(/^(.+)\</i);
		if (s) {
			return s[1];
		}
		s = list[i].match(/\<(.+)\@/i);
		if (s) {
			return s[1];
		}
	}
	function GetAddr(s) {
		var s = list[i].match(/\<(.+)\>/i);
		if (s) {
			return s[1];
		}
	}

	var res = [];
	var list = text.split(/,|;|\n/i);
	for (var i in list) {
		var addr = GetAddr(list[i]);
		if (addr) {	
			var name = GetName(list[i]);
			res[res.length] = [name, addr];
		}
	}
	return res;
}

function IsUrlLink(strText) {
	strText = strText.trim();
	if ((strText.indexOf('http://') == 0 && strText.length > 7) || 
		(strText.indexOf('https://') == 0 && strText.length > 8) ||
		(strText.indexOf('www.') == 0 && strText.lastIndexOf('.') > 4))
		return true;
	else return false;
}

function HasUrlLink(strText) {
	var arr = strText.split(' ');
	for (var i=0; i<arr.length; i++) {
		var text = arr[i];
		if (IsUrlLink(text)) return true;
	}
	return false;
}

function IsEmailAddress(strText) {
	var checkEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
	return checkEmail.test(strText);
}
/*
function FixBorderWidth(cssText, value){
	//fix paste table from xls will lost border style
	var fixValue = value;
	if (cssText.indexOf('-width') > 0){
		if (value.indexOf('pt') > 0){
			var fValue = parseFloat(value);
			if (fValue > 0){
				//table border width transform
				if (fValue == 0.5){ //office wps
					fValue = 0.75;
				}else if (fValue == 1){
					fValue = 1.75;
				}else if (fValue == 1.5){
					fValue = 2.5;
				}else if (fValue == 1.2){ //wps
					fValue = 1.75;
				}else if (fValue == 2){
					fValue = 2.5;
				}else if (fValue < 0.75) { //common
					fValue = 0.75;
				}
			}
			fixValue = fValue + 'pt';
		}
	}
	return fixValue;
}*/


function setCssTextFromSelector(el, selectorText, cssText){
	try{
		if (el == null) return;
		var sheet = el.sheet;
		if (sheet == null) return;
		var rules = sheet.rules;
		if (rules == null) return;
		for (var i=0; i<rules.length; i++){
			var rule = rules[i];
			if (rule.selectorText === selectorText){
				rule.style.cssText = cssText;
				break;
			}
		}
	}catch(e){ 
		//alert(e.message); 
	}
}


function getCssTextFromSelector(el, selectorText){
	try{
		if (el == null) return '';
		var sheet = el.sheet;
		if (sheet == null) return '';
		var rules = sheet.rules;
		if (rules == null) return '';
		for (var i=0; i<rules.length; i++){
			var rule = rules[i];
			if (rule.selectorText === selectorText){
				return rule.style.cssText;
			}
		}
	}catch(e){ 
		//alert(e.message); 
	}
}


function ApplyInlineStyle(html, removeClassList, bFixBorder){
	var result = html;
	var bodyCssText = '';
	try{
		if (removeClassList == null) removeClassList = [];
		var dom = $('<div></div>').html(html);
		dom.find('style').each(function(){
			var style = $(this);
			$(document.body).prepend(style);
			var sheet = style[0].sheet;
			var rules = sheet.rules;
			for (var i=0; i<rules.length; i++){
				var item = rules[i];
				if (Object.prototype.toString.call(item) === '[object CSSStyleRule]'){
					var selectorText = item.selectorText;
					var nodes = dom.find(selectorText);
					if ((nodes.length > 0) || (selectorText === 'body')){
						if (item.style == null) continue;
						for (var k=0; k<item.style.length; k++){
							var cssText = item.style[k];
							var value = item.style[cssText];
							//if (bFixBorder){
							//	value = FixBorderWidth(cssText, value);
							//}
							if (selectorText === 'body') {
								//dom.css(cssText, value);
								if (value !== ''){
									bodyCssText = bodyCssText + cssText + ':' + value + ';'; 
								}
							} else nodes.css(cssText, value);
						}
					}
				}
				//'[object CSSImportRule]' [object CSSPageRule]
			}
			style.remove();
		});
		/*
		if (bFixBorder){
			//fix border width
			dom.find('td').each(function(){
				var target = $(this);
				var styles = ['border-left-width', 'border-right-width', 
						'border-top-width', 'border-bottom-width'];
				for (var i=0; i<styles.length; i++){
					var value = target.css(styles[i]);
					var fixValue = FixBorderWidth(styles[i], value);
					if (fixValue !== value){
						target.css(styles[i], fixValue);
					}
				}
			});
		}*/
		dom.find('meta').remove();
		dom.find('link').remove();
		dom.find('head').remove();
		for (var i=0; i<removeClassList.length; i++){
			var className = removeClassList[i];
			dom.find('.'+className).removeClass(className);
		}
		result = dom.html();
	}catch(e) { 
		
	}
	return {html: result, bodyCss: bodyCssText};
}

function RemoveTag(node, id, remove){
	var elements = node.find('#'+id);
	while (elements.length > 0){
		if (remove){
			elements.remove();
		}else{
			elements.removeAttr('id');
		}
		elements = node.find('#'+id);
	}
}

//
function RemoveUnuseTag(node, macro_list, ignore_macro_list, remove_foxmail_tag){
	try{
		if (macro_list == null) macro_list = [];
		if (ignore_macro_list == null) ignore_macro_list = [];
		node.find('meta').remove();
		node.find('title').remove();
		if (remove_foxmail_tag){
			//删除Foxmail定义的内容标记
			node.find('#divFMContentBody').removeAttr('contenteditable');
			node.find('#divFMContentBody').css('min-height', '');
			RemoveTag(node, 'divFMContentBody', false);
			RemoveTag(node, 'divFMReplyBody', false);
			RemoveTag(node, 'FMOriginalContent', false);
			RemoveTag(node, 'FMSigSeperator', false);
			for (var i=0; i<macro_list.length; i++){
				var key = macro_list[i];
				var ignore = false;
				for (var j=0; j<ignore_macro_list.length; j++){
					if (ignore_macro_list[j] === key) {
						ignore = true;
						break;
					}
				}
				if (ignore) continue; 
				RemoveTag(node, key, false);
			}
		}
	}catch(e){ }
}

//
function ExecuteIgnoreException(callback) {
	try {
		if (callback) {
			callback();
		}
	} catch (e) { }
}

// generate guid
function NewGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;
}

// map container
function Map() {
	this.elements = new Array();
	//获取MAP元素个数
	this.size = function() {
		return this.elements.length;
	}
	//判断MAP是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	}
	//删除MAP所有元素
	this.clear = function() {
		this.elements = new Array();
	}
	//向MAP中增加元素（key, value) 
	this.put = function(_key, _value) {
		this.elements.push( {
			key : _key,
			value : _value
		});
	}
	//删除指定KEY的元素，成功返回True，失败返回False
	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}
	//获取指定KEY的元素值VALUE，失败返回NULL
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	}
	//获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}
	//判断MAP中是否含有指定KEY的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}
	//判断MAP中是否含有指定VALUE的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}
	//获取MAP中所有VALUE的数组（ARRAY）
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	}
	//获取MAP中所有KEY的数组（ARRAY）
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	}
}