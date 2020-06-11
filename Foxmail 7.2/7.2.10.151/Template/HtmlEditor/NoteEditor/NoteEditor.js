// 调整横向滚动条
setInterval(function() {
	AdjustHorizontalBar($('#fox_html_content'));
}, 100);

function SetSubject(text){
	$('#subject').val(text);
	if (text === ''){
		var emptyString = $('#subject').attr('EmptyValue');
		$('#subject').val(emptyString);
		$('#subject').addClass('EmptySubject');
	}else{
		$('#subject').removeClass('EmptySubject');
	}
}
function SetContent(html){
	var strHtml = '';
	var dom = $('<div</div>').html(html);
	dom.find('audio').each(function(){
		$(this).attr('controls', 'controls');
	});
	strHtml = dom.html();
	$('#fox_html_content').html(strHtml);
	InitHorizontalBar($('#fox_html_content'));
}
function SetNoteId(noteId){
	$('#noteid').val(noteId);
}
window.FoxNoteURLManager = function(){
	this.m_URLList = new Array();
	this.FindURL = function(url){
		for (var i=0; i<this.m_URLList.length; i++){
			if (this.m_URLList[i] === url){
				return i;
			}
		}
		return -1;
	}
	this.AddURL = function(url){
		this.m_URLList.push(url);
	}
	this.AddURLList = function(list){
		for (var i=0; i<list.length; i++){
			this.AddURL(list[i]);
		}
	}
	this.GetURLByIndex = function(index){
		return this.m_URLList[index];
	}
	this.Clear = function(){
		this.m_URLList = new Array();
	}
	this.Count = function(){
		return this.m_URLList.length;
	}
	this.GetList = function(){
		return this.m_URLList;
	}
}
var g_FoxNoteURLMgr = new FoxNoteURLManager();
//
function GetAllImageList(bQQMailNoteUploadFormat){
	var list = new Array();
	$('#fox_html_content').find('img').each(function(){
		if (this.src != ''){
			list.push(this.src);
			if (bQQMailNoteUploadFormat) {
				this.src = this.src;
				$(this).removeAttr('qmtitle');
			}
		}
	});/*
	$('#fox_html_content').find('*').each(function(){
		var src = this.style['backgroundImage'] || 
			document.defaultView.getComputedStyle(this, "").getPropertyValue('background-image');
		if (src && (src != "")){
			var s1 = src.indexOf('url(');
			if (s1 == 0){
				s1 = s1 + 4;
				var s2 = src.indexOf(')', s1);
				if (s2 > s1){
					var filepath = src.substring(s1, s2);
					list.push(filepath);
				}
			}
		}
	});*/
	return list;
}
function ShowMultiSelectedBox(){
	$('#fox_logo_box').hide();
	$('#fox_html_content_box').hide();
	$('#fox_multiselected_box').show();
	$(document.body).css('height', '-webkit-calc(100% - 20px)');
}
function ShowEditorBox(){
	$('#fox_logo_box').hide();
	$('#fox_multiselected_box').hide();
	$('#fox_html_content_box').show();
	$(document.body).css('height', 'auto');
}
function ShowLogoBox(){
	$('#fox_multiselected_box').hide();
	$('#fox_html_content_box').hide();
	$('#fox_logo_box').show();
	$(document.body).css('height', '-webkit-calc(100% - 20px)');
}
function setNoteInfo(noteId, subject, content, bStar, emptyString, showLoading, showPopupBtn){
	$(window).scrollTop(0);
	if (showLoading){
		$('#loading').show();
		var clientHeight = $(window).height();
		var height = clientHeight - 42;
		$('#loading').height(height);
		$('#fox_html_content').hide();
		$('#subject').attr('readonly', 'true');
	}else{
		$('#loading').hide();
		$('#fox_html_content').show();
		$('#subject').removeAttr('readonly');
	}
	if (showPopupBtn){
		$('#foxbtn_popup').show();
	}else{
		$('#foxbtn_popup').hide();
	}
	//
	ShowEditorBox();
	$('#subject').attr('EmptyValue', emptyString);
	SetNoteId(noteId);
	SetSubject(subject);
	SetContent(content);
	if (bStar) SetStarYellow();
	else SetStarGary();
	//记录所有图片资源的连接
	g_FoxNoteURLMgr.Clear();
	g_FoxNoteURLMgr.AddURLList(GetAllImageList());
}
//Delphi调用的方法
function D2J_SetFocusToDocument(){
	$('#FoxFocusTarget').focus();
}
function D2J_SetFocusToContent(){
	$('#fox_html_content').focus();
}
function D2J_SetReadOnly(bReadOnly){
	if (bReadOnly) {
		$('#subject').attr('readonly', "true");
		$('#fox_html_content').removeAttr('contenteditable');
		if (!$('#foxbtn_star').hasClass('fox_disable')) $('#foxbtn_star').addClass('fox_disable');
		if (!$('#foxbtn_popup').hasClass('fox_disable')) $('#foxbtn_popup').addClass('fox_disable');
	}else {
		$('#subject').removeAttr('readonly');
		$('#fox_html_content').attr('contenteditable', "true");
		if ($('#foxbtn_star').hasClass('fox_disable')) $('#foxbtn_star').removeClass('fox_disable');
		if ($('#foxbtn_popup').hasClass('fox_disable')) $('#foxbtn_popup').removeClass('fox_disable');
	}
}
function D2J_SetNoteInfo(noteId, subject, content, bStar, emptyString, showPopupBtn, bFocusContent, readonly){
	setNoteInfo(noteId, subject, content, bStar, emptyString, false, showPopupBtn);
	D2J_SetReadOnly(readonly);
	if (bFocusContent){
		D2J_SetFocusToContent();
	}else{
		D2J_SetFocusToDocument();
	}
}
function D2J_CreateNewNote(noteId, subject, content, emptyString, showPopupBtn){
	D2J_SetNoteInfo(noteId, subject, content, false, emptyString, showPopupBtn, true);
}
function D2J_ShowSelectedNotes(msg, title, content, datetime){
	ShowMultiSelectedBox();
	$('#fox_multiselected_box_info').text(msg);
	//$('#fox_page_title').text(title);
	//$('#fox_page_date').text(datetime);
	//var dom = $(content);
	//var text = dom.text();
	//$('#fox_page_content').text(text);
}
function D2J_UpdateFontStyle(fontStyle){
	var style= document.getElementById('fox_global_style');
	setCssTextFromSelector(style, 'div.fox_html_content', fontStyle);
}
function D2J_GetNoteInfo(){
	var noteID = $('#noteid').val();
	var subject = '';
	if (!$('#subject').hasClass('EmptySubject'))
		subject = $('#subject').val().trim();
	var newlist = GetAllImageList(true);
	var oldlist = g_FoxNoteURLMgr.GetList();
	var content = $('#fox_html_content').html().trim();
	var pureTextContent = $('#fox_html_content')[0].innerText.trim();
	//get global style
	var style= document.getElementById('fox_global_style');
	var cssText = getCssTextFromSelector(style, 'div.fox_html_content');
	var listStyleCssText = 'ol, ul { list-style-position: inside; }';
	if (cssText === '') {
		content = '<style>' + listStyleCssText + '</style>' + content;
	} else  {
		cssText = listStyleCssText + cssText;
		content = '<div style="' + cssText + '">' + content + '</div>';
	}
	g_FoxNoteURLMgr.Clear();
	g_FoxNoteURLMgr.AddURLList(newlist);
	return {
		noteid: noteID,
		subject: subject,
		content: content,
		text: pureTextContent,
		oldlist: oldlist,
		newlist: newlist
	};
}
function D2J_ShowLoading(noteId, subject, bStar, emptyString, showPopupBtn){
	setNoteInfo(noteId, subject, '', bStar, emptyString, true, showPopupBtn);
}
function D2J_ShowLogo(msg){
	ShowLogoBox();
	$('#fox_logo_box_info').text(msg);
}
function D2J_UpdateNoteStarInfo(noteid, bStar){
	var id = $('#noteid').val();
	if (parseInt(id) == noteid){
		if (bStar) SetStarYellow();
		else SetStarGary();
	}
}
function D2J_UpdateNoteSubjectInfo(noteid, subject){
	var id = $('#noteid').val();
	if (parseInt(id) == noteid){
		SetSubject(subject);
	}
}
function resize(box, obj){
	var clientHeight = $(window).height();
	var height_fix = 72;
	var compose_height = clientHeight - height_fix;
	box.css('min-height', compose_height+'px');
	obj.css('min-height', compose_height+'px');
}
var SubjectFocused = false;
var ContentFocused = false;
function EditorLoseFocus(){
	if (ContentFocused == false && SubjectFocused == false){
		J2D_OnEditorLoseFocus();
	}
}
function EditorFocused(){
	J2D_OnEditorFocused();
}
function SetStarGary(){
	var star = $('#foxbtn_star');
	star.removeClass('Yellow');
	star.addClass('Gary');
}
function SetStarYellow(){
	var star = $('#foxbtn_star');
	star.removeClass('Gary');
	star.addClass('Yellow');
}
function IsStarYellow(){
	return $('#foxbtn_star').hasClass('Yellow');
}
$(document).ready(function(){
	var content_obj = $('#fox_html_content');
	var content_box = $('#fox_html_content_box');
	resize(content_box, content_obj);
	$(window).resize(function(){
		resize(content_box, content_obj);
	});
	$(document.body).bind('click', function(ev){
		EditorFocused();
	});
	$(document).on('selectionchange', function(ev){
		var target = $(document.activeElement);
		if (target.closest('#fox_html_content').length > 0){
			J2D_OnSelectionChange();
		}
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
	});

	$('#fox_html_content').bind('input', function(ev){
		J2D_OnNoteInput();
	}).bind('keydown', function(ev){
		var handled = false;
		var keyCode = ev.keyCode;
		switch (keyCode){
			case 38:{
				if (window.getSelection().anchorOffset == 0){
					handled = false; //todo 判断是否首行
					if (handled){
						$('#subject').focus();
					}
				}
				break;
			}
			default: break;
		}
		if (handled) {
			ev.stopPropagation();
			ev.preventDefault();
		}
	});

	$('#subject').bind('input', function(ev){
		J2D_OnNoteInput();
	}).bind('keydown', function(ev){
		var handled = false;
		var keyCode = ev.keyCode;
		switch (keyCode){
			case 13:{
				handled = true;
				$('#fox_html_content').focus();	
				break;
			}
			case 40:{
				if (this.selectionStart == this.value.length){
					$('#fox_html_content').focus();
					handled = true;
				}
				break;
			}
			default: break;
		}
		if (handled) {
			ev.stopPropagation();
			ev.preventDefault();
		}
	}).bind('mousedown', function(ev){
		SubjectFocused = true;
	}).bind('blur', function(ev){
		if ($(this).attr('readonly') !== 'readonly') {
			SubjectFocused = false;
			if ($(this).val() === ''){
				var emptyString = $(this).attr('EmptyValue');
				if (!$(this).hasClass('EmptySubject')) $(this).addClass('EmptySubject');
				$(this).val(emptyString);
			}
			J2D_OnSubjectBlur();
			EditorLoseFocus();
		}
	}).bind('focus', function(ev){
		if ($(this).attr('readonly') !== 'readonly') {
			SubjectFocused = true;
			if ($(this).hasClass('EmptySubject')){
				$(this).val('');
				$(this).removeClass('EmptySubject');
			}
			J2D_OnSubjectFocused();
		}
	});
	$('#fox_html_content').bind('mousedown', function(ev){
		ContentFocused = true;
	}).unbind('focus').bind('focus', function(ev){
		ContentFocused = true;
		J2D_OnContentFocused();
	}).unbind('blur').bind('blur', function(ev){
		ContentFocused = false;
		J2D_OnContentBlur();
		EditorLoseFocus();
	}).bind('keydown', function(ev){
		var keyCode = ev.keyCode;
		if (keyCode == 9){
			PasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
			ev.stopPropagation();
			ev.preventDefault();
		}
	});
	//button event
	$(document).delegate('#foxbtn_star', 'click', function(ev){
		if ($(this).hasClass('fox_disable')) return;
		var noteId = $('#noteid').val();
		var bStar = IsStarYellow();
		if (bStar) SetStarGary();
		else SetStarYellow();
		J2D_OnStarBtnClick(noteId, !bStar);
	}).delegate('#foxbtn_popup', 'click', function(ev){
		if ($(this).hasClass('fox_disable')) return;
		var noteId = $('#noteid').val();
		J2D_OnPopupBtnClick(noteId);
	});

	InitFoxEditor();
	InitAutoLink('fox_html_content', {NeedCtrl: false});
});