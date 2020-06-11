var gMailId = 0;
var gRightClickElement = null;

var Fix = {
	//
	// 解决邮件内容设置了absolute，使得ContentPanel不能自适应邮件高度的问题。
	// 该问题通常表现为看不到邮件正文，或者看不全邮件正文。
	//
	FixContentPanelHeigth: function(mailid) {
		var panels = (mailid == undefined) ? $('.mail_content_panel') :
											 $('#mail_session_' + mailid).find('.mail_content_panel');

		panels.each(function() {
			var panel = $(this);

			var paddingHeight = panel.innerHeight() - panel.height();
			var height = panel[0].scrollHeight - paddingHeight;

			if (height !== panel.height()) {
				//panel.height(height);
				panel.css('min-height', height);
			}
		});
	}
}

$(document).ready(function(){
	rangy.init();
	window.J2D_OnLoadedFrame('document ready');

	setInterval(InitScroller, 500);
});

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function MakeNormalAttachmentClipboardData(mailId, attachIndex, attachName) {
	return '0:' + mailId + ':' + utf8_to_b64(attachName) + ':' + attachIndex;
}

function MakeHugeAttachmentClipboardData(mailId, attachName, downloadUrl) {
	return '1:' + mailId + ':' + btoa(attachName) + ':' + btoa(downloadUrl);
}


window.D2J_GetSelectionHTML = function(callbackObj, param) {
	try {
		var htmlStr = rangy.getSelection().toHtml();
		var dom = $('<div></div>').html(htmlStr);
		dom.find('img').each(function() {
			$(this).attr('src', this.src);
		});
		htmlStr = dom.html();
		return {
			obj_keys: 'param,htmlStr',
			callbackObj: callbackObj,
			param: param,
			htmlStr: htmlStr
		};
		return;
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_GetSelectionHTML: ' + e.message);
	}
}

window.D2J_ShowMails = function (content, log) {
	try {
		// if (log != undefined && log !== '') {
		// 	$('body').prepend('<div>' + log + '</div>');
		// }

		$('#body_main').html(content).removeClass('hide');
		$('#conversation_logo_panel').addClass('hide').removeClass('webkitbox');
		try {
			AdjustMailHeight();
			CheckLoadMails();
			InitEventHandler();
		} catch (e) {

		}
		return true;
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowMails: ' + e.message);
	}
};

window.D2J_AddMail = function (mailid, content) {
	try {
		$('.mail_session_body').prepend(content);
		InitEventHandler();
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_AddMail: ' + e.message);
	}
};

window.D2J_RemoveMail = function (mailid) {
	try {
		$('#mail_session_' + mailid).remove();
		InitEventHandler();
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_RemoveMail: ' + e.message);
	}
};

window.D2J_ShowMoreMails = function (content, bHideMoreButton) {
	try {
		HideLoadMoreMailsProcess();
		$('.show_more_button').removeClass('hide');
		$('.mail_session_body').append(content);
		if (bHideMoreButton) {
			$('.show_more_mails').addClass('hide');
		}
		var height = $(window).scrollTop() + ($(window).height() / 2);
		$('html,body').animate({ scrollTop: height }, 800, function() {
			setTimeout(function() {
				InitEventHandler();
			}, 200);

		});
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowMoreMails: ' + e.message);
	}
};

window.D2J_ShowLogo = function(logoClass, account) {
	try {
		$('#body_main').addClass('hide');
		$('#conversation_logo_panel').removeClass('hide').addClass('webkitbox');
		$('#conversation_logo_box').attr('class', '').addClass(logoClass);
		$('#conversation_logo_info').html(account);
		return true;
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowLogo: ' + e.message);
	}
};

window.D2J_ShowSelectedMails = function(logoClass, num) {
	try {
		$('#body_main').addClass('hide');
		$('#conversation_logo_panel').removeClass('hide').addClass('webkitbox');
		$('#conversation_logo_box').attr('class', '').addClass(logoClass);
		$('#conversation_logo_info').text(num);
		return true;
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowSelectedMails: ' + e.message);
	}
};

window.D2J_UpdateMailPreview = function(mailid, previewHtml) {
	try {
		if (previewHtml) {
			var mailSession = $('#mail_session_' + mailid);
			mailSession.find('.mail_preview_panel').html(summaryHtml);
		}
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateMailPreview: ' + e.message);
	}
}

window.D2J_UpdateMailDetail = function(mailid, detail) {
	try {
		var el = $('#mail_session_' + mailid).find('.detail_info_panel');
		el.html(detail).slideDown(200, function(){
			$('.detail_info_prompt').attr('state', 'open');
		});
		InitEventHandler();
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateMailDetail: ' + e.message);
	}
};

window.D2J_UpdateMail = function(mailid, headHtml, contentHtml, attachHtml, summaryHtml) {
	try {
		var mailSession = $('#mail_session_' + mailid);
		mailSession.find('.mail_head_panel').html(headHtml);
		mailSession.find('.mail_content_panel .mail_content_panel_zoom_layout').html(contentHtml);
		if (attachHtml != '') {
			mailSession.find('.attachments_info_panel').html(attachHtml).removeClass('hide');
		}

		mailSession.find('.mail_preview_panel').hide(0, function() {
			mailSession.find('.mail_preview_panel').html(summaryHtml);

			InitImages();
			var sessions = $('.mail_session');
			mailSession.find('.mail_full_panel').slideDown(200, function() {
				CheckLoadMails(mailid);
				InitEventHandler();

				if (gDelayOpenFastReply) {
					window.J2D_OpenFastReply(mailid, true);
				}
				gDelayOpenFastReply = false;
			});
		});
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateMail: ' + e.message);
	}
};

window.D2J_UpdateMailBody = function(mailid, contentHtml, attachHtml) {
	try {
		// 更新正文
		var mailSession = $('#mail_session_' + mailid);
		mailSession.find('.mail_content_panel .mail_content_panel_zoom_layout').html(contentHtml);
		// 更新附件区域
		if (attachHtml != '') {
			var attachPanel = mailSession.find('.attachments_info_panel');
			attachPanel.html(attachHtml).removeClass('hide');
		}

		InitEventHandler();
		InitImages();
		CheckLoadMails();
		RecoverMailHeight();

		// 修正邮件正文高度不正确，引起内容无法看到的问题
		Fix.FixContentPanelHeigth(mailid);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateMailBody: ' + e.message);
	}
};

window.D2J_UpdateNormalAttachments = function(mailid, attachHtml) {
	try {
		var mailSession = $('#mail_session_' + mailid);
		var attachList = mailSession.find('.attachments_list');
		attachList.find('.normal_attachment').remove();
		attachList.prepend(attachHtml);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateAttachment: ' + e.message);
	}
};

window.D2J_ChangeTopState = function(bTop) {
	try {
		var state = bTop ? 'top' : 'not_top';
		$('.mail_top_most').removeClass('top not_top').addClass(state);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ChangeTopState: ' + e.message);
	}
}

window.D2J_ChangeReadState = function(mailid, bRead) {
	try {
		var el = $('#mail_session_' + mailid);
		if (bRead)
			el.find('.mail_preview_box').removeClass('unread').addClass('read');
		else
			el.find('.mail_preview_box').removeClass('read').addClass('unread');
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ChangeReadState: ' + e.message);
	}
}

//
// 生成内容Dom, 提取需要修改的image信息
// <html><head></head>
// <body>
// <div class='rplContent'></div>
// <div class='orgContent'></div>
// </body>
// </html>
//
var gReplyDom = null;
var gMacrosArray = null;
window.D2J_PrepareFastReplyStep1 = function(mailid, template) {
	try {
		gReplyDom = $(template);
		gReplyDom.attr('mailid', mailid);
		var session = $('#mail_session_' + mailid);
		var rplContent = session.find('.fast_reply_panel').find('.foxTexter');
		if (rplContent.length > 0){
			rplContent = rplContent[0].innerText;
			rplContent = rplContent.replace(/\n/g, '<br>');
		}else rplContent = "";
		var orgContent = session.find('.mail_content_panel .mail_content_panel_zoom_layout').html();
		//原邮件内容可能有折叠引用的标记 要去除 模版文件 mail_entry_content_blockquote
		var orgContentDOM = $('<div></div>').html(orgContent);
		orgContentDOM.find('.foxmail_blockquote_block_head').remove();
		orgContentDOM.find('.foxmail_blockquote_block_end').remove();
		orgContentDOM.find('.foxmail_blockquote_block').removeClass('foxmail_blockquote_block');
		orgContent = orgContentDOM.html();
		//
		var rplContentEl = gReplyDom.find('.rplContent');
		rplContentEl.html(rplContent);
		rplContentEl.removeClass('rplContent');
		var orgContentEl = gReplyDom.find('.orgContent');
		orgContentEl.html(orgContent);
		orgContentEl.removeClass('orgContent');

		var images = [];
		var cidlist = [];
		var mapping = new Map();
		gReplyDom.find('img').each(function() {
			var src = $(this).attr('src');
			// todo 链接的检测
			if ((src.indexOf('http://') != 0) && (src.indexOf('https://') != 0)) {
				var guid = mapping.get(src);
				var cid = '_Foxmail.';
				if (guid == null){
					guid = NewGuid();
					cid = cid + guid;
					images.push(src);
					cidlist.push(cid);
					mapping.put(src, cid);
				}else{
					cid = guid;
				}
				var newSrc = 'cid:' + cid;
				$(this).attr('src', newSrc);
			}
		});

		//remove unuse tag
		if (!gMacrosArray){
			gMacrosArray = window.J2D_GetMacros();
		}
		RemoveUnuseTag(gReplyDom, gMacrosArray, [], true);

		var content = gReplyDom.html();
		window.J2D_SendFastReply(mailid, content, images, cidlist);

		setTimeout(function() {
			window.J2D_OpenFastReply(mailid, false);
		}, 10);

	} catch (e) {
		window.J2D_WriteLog('JS: D2J_PrepareFastReplyStep1: ' + e.message);
	}
}

window.D2J_OpenFastReply = function(mailid, bOpen, content) {
	try {
		OpenFastReply(mailid, bOpen, content);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_OpenFastReply: ' + e.message);
	}
}

window.D2J_UpdateTags = function(content) {
	try {
		$('.mail_tag_list').html(content);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateTags: ' + e.message);
	}
}

window.D2J_GetFastReplyContent = function(mailid, callbackObj, replyAll, caption){
	try {
		var content = '';
		var el;
		if (mailid === '-1'){
			el = $('.mail_session:eq(0)').find('.fast_reply_panel');
		}else{
			el = $('#mail_session_' + mailid).find('.fast_reply_panel');
		}
		content = el.find('.foxTexter').text();
		return {
			obj_keys: 'mailid,callbackObj,replyall,content,caption',
			mailid: mailid,
			callbackObj: callbackObj,
			replyall: replyAll,
			content: content,
			caption: caption
		};
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_GetFastReplyContent: ' + e.message);
	}
}

window.D2J_ShowCommentEditor = function(mailid, bShow, bAnimation, bRefresh, comment) {
	try {
		ShowCommentEditor(mailid, bShow, bAnimation, bRefresh, comment);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowCommentEditor: ' + e.message);
	}
}

window.D2J_ShowComment = function(mailid, bShow, bAnimation, bRefresh, comment) {
	try {
		ShowComment(mailid, bShow, bAnimation, bRefresh, comment);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowComment: ' + e.message);
	}
}

window.D2J_SetFontSize = function(mailid, delta) {
	try {
		var session = $('#mail_session_' + mailid);
		var panel = session.find('.mail_content_panel');
		panel.children().css( "zoom", parseInt(delta) / 100 );
		//panel.css( 'zoom', parseInt(delta) / 100 );
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_SetFontSize: ' + e.message);
	}
}

window.D2J_ZoomFontSize = function(mailid, bZoomin) {
	try {
		ZoomFontSize(mailid, bZoomin);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ZoomFontSize: ' + e.message);
	}
}

window.D2J_Print = function(targetMailid) {
	try {
		var iframe = document.getElementById('PrintFrame');
		var iframeWindow = iframe.contentWindow;
		var iframeDocument = iframeWindow.document;
		iframeDocument.documentElement.innerHTML = $("html").html();

		// 去除iframe
		$(iframeDocument).find('#PrintFrame').remove();

		// 打印指定邮件
		if ( parseInt(targetMailid) > 0 ) {
			$(iframeDocument).find('.mail_session').each(function() {
				var session = $(this);
				var mailid = session.attr('mailid');
				if (mailid !== targetMailid) {
					session.remove();
				}
			});
		}
		
		setTimeout(function() {
			iframeWindow.print();
		}, 100);
		
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_Print: ' + e.message);
	}
}

window.D2J_ShowPasswordTip = function(mailid) {
	try {
		var session = $('#mail_session_' + mailid);
		session.find('.mail_encrypt_error').removeClass('visibility');
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ShowPasswordTip: ' + e.message);
	}
}

window.D2J_UpdateDelayMailTip = function(mailid, content) {
	try {
		var session = $('#mail_session_' + mailid);
		session.find('.mail_entry_timemail_info1').text(content);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateDelayMailTip: ' + e.message);
	}
}

window.D2J_UpdateSendReceiptState = function(mailid, info, state) {
	try {
		var session = $('#mail_session_' + mailid);
		session.find('.mail_read_receipt_desc').text(info);
		session.find('.mail_read_receipt_send_button').hide();
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateSendReceiptState: ' + e.message);
	}
}

window.D2J_UpdateSubject = function(subject) {
	$('.mail_session_title').html(subject);
}

window.D2J_SelectContent = function(mailid) {
	try {
		var attachments = $('.attachment_item.selected');
		if (attachments.length > 0) {
			var list = attachments.parents('.attachments_list');
			list.find('.attachment_item').removeClass('selected').addClass('selected');
		} else if ( parseInt(mailid) < 0 ) {
			SelectAllContent(gSelectMailId);
		} else {
			SelectAllContent(mailid);
		}
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_SelectContent: ' + e.message);
	}
}

window.D2J_UpdateAttachState = function(mailid, index, state, stateInfo) {
	try {
		var session = $('#mail_session_' + mailid);
		var attach = session.find(".normal_attachment[index='" + index + "']");
		attach.attr('state', state);
		attach.find('.attachment_item_size').text(stateInfo);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateAttachState: ' + e.message);
	}
}

window.D2J_SetLoadingBody = function (mailid, loadingHtml) {
	try {
		var mailSession = $('#mail_session_' + mailid);
		mailSession.find('.mail_content_panel .mail_content_panel_zoom_layout').html(loadingHtml);
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_SetLoadingBody: ' + e.message);
	}
}

window.D2J_SetRetryLoadBody = function(mailid, failHtml) {
	try {
		var mailSession = $('#mail_session_' + mailid);
		mailSession.find('.mail_content_panel .mail_content_panel_zoom_layout').html(failHtml);
		InitEventHandler();
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateFailture: ' + e.message);
	}
}

window.D2J_UpdateDraftAttachArea = function(mailid, attachHtml) {
	try {
		var session = $('#mail_session_' + mailid);
		// 更新附件区域
		if (attachHtml != '') {
			var attachPanel = session.find('.attachments_info_panel');
			attachPanel.html(attachHtml).removeClass('hide');
			InitEventHandler();
		}
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_AddHugeAttachments: ' + e.message);
	}
}

window.D2J_UpdateHugeAttachItem = function(mailid, fileId, info) {
	try {
		var session = $('#mail_session_' + mailid);
		var items = session.find('.huge_attachment');
		items.each(function() {
			var item = $(this);
			if ( item.attr('index') == fileId ) {
				item.find('.attachment_item_size').text(info);
			}
		});
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_UpdateHugeAttachItem: ' + e.message);
	}
}

window.D2J_GetMailIdFromPoint = function(x, y) {
	try {
		var el = $( document.elementFromPoint(x, y) );
		if (!el.hasClass('mail_session')) {
			el = el.parents('.mail_session');
		}
		if (el.length == 0) {
			return;
		}
		var mailid = el.attr('mailid');
		return {
			mailid: mailid
		}
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_GetMailIdFromPoint: ' + e.message);
	}
}

var isMenuCanPopup = true;
window.D2J_ResetCanPopupFlag = function(where, bCan) {
	function setMenuFlag(bCan) {
		!bCan ? isMenuCanPopup = bCan : setTimeout(function() {
			isMenuCanPopup = bCan;
		}, 100);
	}
	try {
		if (where == 'menu') {
			setMenuFlag(bCan);
		}
	} catch (e) {
		window.J2D_WriteLog('JS: D2J_ResetCanPopupFlag: ' + e.message);
	}
}

/////////////////
//   公共函数
/////////////////

//
// 打开邮件备注编辑框
//
function ShowCommentEditor( mailid, bShow, bAnimation, bRefresh, comment ) {
	try {
		var editor = $('#mail_session_' + mailid).find('.mail_comment_editor');

		function afterOpen() {
			editor.attr('state', 'open');
			var texter = editor.find('.foxTexter');
			texter.focus();
		}

		if ( bShow ) {
			if ( bRefresh ) {
				editor.find('.foxTexter').html(comment);
			}
			if ( bAnimation ) {
				editor.slideDown(200, afterOpen);
			} else {
				editor.show(0, afterOpen);
			}
		} else {
			if ( bAnimation ) {
				editor.slideUp(200);
			} else {
				editor.hide(0);
			}
		}
	} catch (e) {
		window.J2D_WriteLog('JS: ShowCommentEditor: ' + e.message);
	}
}

//
// 显示邮件备注
//
function ShowComment( mailid, bShow, bAnimation, bRefresh, comment ) {
	try {
		var panel = $('#mail_session_' + mailid).find('.mail_comment_content');
		if ( comment == '' ) {
			bShow = false;
		}
		if ( bRefresh ) {
			panel.text(comment);
		}
		if ( bShow ) {
			if ( bAnimation ) {
				panel.slideDown(200);
			} else {
				panel.show(0);
			}
		} else {
			if ( bAnimation ) {
				panel.slideUp(200);
			} else {
				panel.hide(0);
			}
		}
	} catch (e) {
		window.J2D_WriteLog('JS: ShowComment: ' + e.message);
	}
}

//
// 字体放大缩小
//
function ZoomFontSize(mailid, bZoomin) {
	try {
		if ( mailid != 0 ) {
		var session = $('#mail_session_' + mailid);
		} else {
			var session = $('.mail_session');
		}

		var panel = session.find('.mail_content_panel .mail_content_panel_zoom_layout');
		var nodes = panel.find('*');

		if (nodes.length < 2000) {
			if ( bZoomin ) {
				nodes.each( function() {
					var fontSize = window.getComputedStyle(this, null).getPropertyValue('font-size');
					fontSize = (parseInt(fontSize) + 2) + 'px';
					this.style.fontSize = fontSize;
				});
			} else {
				nodes.each( function() {
					var fontSize = window.getComputedStyle(this, null).getPropertyValue('font-size');
					fontSize = (parseInt(fontSize) - 2) + 'px';
					this.style.fontSize = fontSize;
				});
			}
		} else {
			var zoom = window.getComputedStyle(panel[0], null).getPropertyValue('zoom');
			if ( bZoomin ) {
				zoom = parseInt(zoom) + 0.2;
			} else {
				zoom = parseInt(zoom) - 0.2;
			}
			panel.css('zoom', zoom);
		}
	} catch (e) {
		window.J2D_WriteLog('JS: ZoomFontSize: ' + e.message);
	}
}

//
// 触发快速回复
//
function EvokeSendFastReply(mailid) {
	var session = $('#mail_session_' + mailid);
	var panel = session.find('.fast_reply_panel');

	var button = panel.find('.send_button');
	if (button.hasClass('disable')) return;

	var texter = panel.find('.foxTexter');
	if (texter.text() == '') return;

	button.removeClass('blue').addClass('disable');
	window.J2D_EvokeSendFastReply(mailid);
}

//
// 打开快速回复面板
//
var gDelayOpenFastReply = false;
function OpenFastReply(mailid, bOpen, content) {
	try {
		var session = $('#mail_session_' + mailid);
		var el = session.find('.fast_reply_panel');
		if (bOpen) {
			var previewPanel = session.find('.mail_preview_panel');
			if (previewPanel.is(':visible') == true) {
				gDelayOpenFastReply = true;
				window.J2D_LoadMail(mailid);
				return;
			}
			var texter = el.find('.foxTexter');
			texter.html(content);
			if (texter.text() != '') {
				texter.parent().find('.send_button').removeClass('disable').addClass('blue');
			} else {
				texter.parent().find('.send_button').removeClass('blue').addClass('disable');
			}
			el.slideDown(200, function(){
				el.attr('state', 'open');
				texter.focus();
			});
		} else {
			el.slideUp(200, function(){
				el.attr('state', 'close');
			});
		}
	} catch (e) {
		window.J2D_WriteLog('JS: OpenFastReply: ' + e.message);
	}
}


//
// 加载更多进度条
//
var loadMoreMailsProcessId = 0;
function ShowLoadMoreMailsProcess() {
	try {
		var tips = $('.mails_loading_tips').removeClass('hide').text();
		var waiting = 0;
		loadMoreMailsProcessId = setInterval(function(){
			var omit = '';
			waiting = waiting % 4;
			for (var i = 0; i < waiting; i++) omit = omit + '.';
			waiting = waiting + 1;
			$('.mails_loading_tips').text(tips + omit);
		}, 500);
	} catch (e) {
		window.J2D_WriteLog('JS: ShowLoadMoreMailsProcess: ' + e.message);
	}
}
function HideLoadMoreMailsProcess() {
	try {
		$('.mails_loading_tips').addClass('hide');
		clearInterval(loadMoreMailsProcessId);
	} catch (e) {
		window.J2D_WriteLog('JS: HideLoadMoreMailsProcess: ' + e.message);
	}
}

function CheckLoadMails(mailid) {
	try {
		if (mailid) {
			var el = $('#mail_session_'+mailid).find('.mail_loading_box');
			if (el.length > 0)
				window.J2D_LoadMailBody(mailid);
		} else {
			$('.mail_loading_box').each(function() {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				if (!isNaN(mailid)) {
					window.J2D_LoadMailBody(mailid);
				}
			});
		}
	} catch (e) {
		window.J2D_WriteLog('JS: CheckLoadMails: ' + e.message);
	}
}

function AdjustMailHeight() {
	var els = $('.mail_full_panel');
	var body = $('body');
	// 在1.5dpi下zoom为0.75，其余为1
	var zoom = body.css('zoom');
	if (els.length == 1) {
		var space = els.offset().top;
		var height = (parseInt($(window).height()) / zoom) - space - (12 / zoom);
		els.css('min-height', height);
	} else {
		var height = parseInt($(window).height()) / 2 / zoom;
		els.first().css('min-height', height);
	}
}

function RecoverMailHeight() {
	var els = $('.mail_full_panel');
	if (els.length > 1) {
		els.first().css('min-height', '');
	}
}

function InitScroller(mailid) {
	try {
		function doInitScroller(mailid) {
			var session = $('#mail_session_' + mailid);
			if (session.length == 0) return;
			var panel = session.find('.mail_content_panel');
			var outWidth = panel.outerWidth(true) - panel.innerWidth();
			var width = panel[0].scrollWidth + outWidth;
			session.find('.scroller_sham_content').css('width', width);
			var scroller = session.find('.horizontal_scroller');
			scroller.unbind('scroll').on('scroll', function(ev){
				panel.scrollLeft(scroller.scrollLeft());
			});
		}
		if (mailid) {
			doInitScroller(mailid);
			AdjustScroller(mailid);
		} else {
			$('.mail_session').each(function(){
				doInitScroller($(this).attr('mailid'));
				AdjustScroller($(this).attr('mailid'));
			});
		}
		AdjustScroller();
	} catch (e) {
		window.J2D_WriteLog('JS: InitScroller: ' + e.message);
	}
}
function AdjustScroller(mailid) {
	try {
		var session = $('#mail_session_' + mailid);
		var el = session.find('.mail_content_panel');
		if (el.length == 0) return;
		var scroller = session.find('.horizontal_scroller');
		var box = el[0].getBoundingClientRect();
		var elHeight = el.height();
		var ScreenHeight = $(window).height();
		var elT2T = box.top;
		var elT2B = elT2T - ScreenHeight;
		var elB2T = elT2T + elHeight;
		var elB2B = elB2T + parseInt(el.css('padding-bottom')) - ScreenHeight;
		if ((elT2B > 0) || (elB2T < 0) || ((elB2T > 0) && (elB2B < 0))) {
			scroller.removeClass('fixed_bottom');
		} else {
			scroller.addClass('fixed_bottom');
		}
	} catch (e) {
		window.J2D_WriteLog('JS: AdjustScroller: ' + e.message);
	}
}

var gSelectMailId = null;
function SelectAllContent(mailid) {
	if (mailid == null) {
		return;
	}
	var session = $('#mail_session_' + mailid);
	var panel = session.find('.mail_content_panel .mail_content_panel_zoom_layout');
	if (panel.length == 0) {
		return;
	}
    var el = session.find('.mail_content_panel .mail_content_panel_zoom_layout')[0];

    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function InitImages() {
	function init(el) {
		el = $(el);
		if (el.closest('td').length > 0) {
			el.attr("norescale", "true");
		} else {
			el.each(function() {
				if ((this.naturalWidth < 5) || (this.naturalHeight < 5)) {
					$(this).attr("norescale", "true");
				}
			});
		}
	}

	var imgClick = 1;

	//
	// 图片放大缩小
	//
	var panel = $('.mail_content_panel .mail_content_panel_zoom_layout');
	panel.find('img').unbind().each(function() {
		this.complete ? init(this) : $(this).load(function() {
			init(this);
		});
	}).mouseenter(function(ev) {
		try {
			var el = $(this);
			if (el.parents('a').length > 0) return;

			function zoomin() {
				el.addClass('image_natural_size image_zoomout').removeClass('image_zoomin').unbind('click').click(zoomout);
				// InitScroller();
			}
			function zoomout() {
				el.removeClass('image_natural_size image_zoomout').addClass('image_zoomin').unbind('click').click(zoomin);
				// InitScroller();
			}
			if ( el.width() < this.naturalWidth ) {
				el.addClass('image_zoomin').unbind('click').click(zoomin);
			}
		} catch (e) {
			window.J2D_WriteLog('JS: img mouseenter: ' + e.message);
		}
	}).bind('error', function() {
		//
		// 图片下载失败
		//
		var el = $(this);
		if (el.width() > 50) {
			$(this).width(50);
		}
		if (el.height() > 50) {
			$(this).height(50);
		}
	});
}

//
// 因为更新邮件的时候刷新了一些元素，所以更新邮件的时候都要重新注册事件。
// 首先要unbind已经注册的事件，然后再重新attach新的事件。
//
function InitEventHandler() {
	try {
		//
		// 后面注册的所有事件都要先在这里unbind
		//
		$(document).unbind();
		$(window).unbind();
		$('.mail_comment_panel').unbind();
		$('.mail_comment_panel .cancel_button').unbind();
		$('.mail_comment_panel .submit_button').unbind();
		$('.mail_comment_content').unbind();
		$('.mail_preview_panel').unbind();
		$('.general_info_panel').unbind();
		$('.detail_info_prompt').unbind();
		$('.show_more_button').unbind();
		$('.mail_top_most').unbind();
		$('.fastreply_button').unbind();
		$('.control_button').unbind();
		$('.fast_reply_panel .foxTexter').unbind();
		$('.fast_reply_panel .send_button').unbind();
		$('.fast_reply_panel .cancel_button').unbind();
		$('.mail_meeting_accept_button').unbind();
		$('.mail_meeting_tentative_button').unbind();
		$('.mail_meeting_refuse_button').unbind();
		$('.attachments_list').unbind();
		$('.attachment_item').unbind();
		$('.attachments_slide_button').unbind();
		$('.mail_contact_item').unbind();
		$('.foxmail_blockquote_block_head_tips').unbind();
		$('.mail_info_switch_time').unbind();
		$('.mail_encrypt_form .foxButton').unbind();
		$('.compose_button').unbind();
		$('.mail_entry_timemail_button').unbind();
		$('.mail_read_receipt_send_button').unbind();
		$('.foxmail_conversation_tips_close_btn').unbind();
		$('.foxmail_conversation_tips_help_btn').unbind();
		$('.mail_encrypt_form .foxInputer').unbind();
		$('.retry_loadbody').unbind();
		$('.mail_x_rcpts_send_button').unbind();

		//
		// 继续分别发送
		//
		$('.mail_x_rcpts_send_button').click(function() {
			try {
				var mailid = $(this).parents('.mail_session').attr('mailid');
				window.J2D_ContinueXSend(mailid);
			} catch (e) {
				window.J2D_WriteLog('JS: mail_x_rcpts_send_button click: ' + e.message);
			}
		});

		//
		// 重新拉取邮件正文
		//
		$('.retry_loadbody').click(function() {
			try {
				var mailid = $(this).parents('.mail_session').attr('mailid');
				window.J2D_RetryLoadBody(mailid);
			} catch (e) {
				window.J2D_WriteLog('JS: retry_loadbody click: ' + e.message);
			}
		});

		//
		// 快速回复快捷键
		//
		$('.fast_reply_panel .foxTexter').keydown(function (ev) {
			try {
				// Ctrl-Enter pressed
				if (ev.ctrlKey && ev.keyCode == 13) {
					var el = $(this);
					var mailid = el.parents('.mail_session').attr('mailid');
					EvokeSendFastReply(mailid);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: fast_reply_panel foxTexter keydown: ' + e.message);
			}
		});

		//
		// 保存快捷回复内容
		//
		var saveFastReplyTimeId = null;
		$('.fast_reply_panel .foxTexter').bind('input', function(ev) {
			try {
				var el = $(this);

				clearTimeout(saveFastReplyTimeId);
				saveFastReplyTimeId = setTimeout(function() {
					var mailid = el.parents('.mail_session').attr('mailid');
					var content = el.html();
					window.J2D_SaveFastReply(mailid, content);
				}, 200);
			} catch (e) {
				window.J2D_WriteLog('JS: fast_reply_panel foxTexter input: ' + e.message);
			}
		});

		//
		// 发送阅读收条
		//
		$('.mail_read_receipt_send_button').click(function() {
			try {
				var mailid = $(this).parents('.mail_session').attr('mailid');
				window.J2D_SendReceipt(mailid);
			} catch (e) {
				window.J2D_WriteLog('JS: mail_read_receipt_send_button click: ' + e.message);
			}
		});

		//
		// 延迟发送
		//
		$('.mail_entry_timemail_button').click(function() {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				var isDelaySendMail = el.parents('.mail_entry_timemail_info').attr('isdelaysend');
				if (isDelaySendMail == 'true') {
					window.J2D_CancelDelaySendMail(mailid);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: mail_entry_timemail_button click: ' + e.message);
			}
		});

		//
		// 打开写信窗口
		//
		$('.compose_button').click(function() {
			try {
				var el = $(this);
				var session = el.parents('.mail_session');
				var mailid = session.attr('mailid');
				var content = session.find('.foxTexter').text();
				window.J2D_PopupCompose(mailid, content);

				setTimeout(function() {
					window.J2D_OpenFastReply(mailid, false);
				}, 10);
			} catch (e) {
				window.J2D_WriteLog('JS: compose_button click: ' + e.message);
			}
		});

		//
		// 邮件解密
		//
		$('.mail_encrypt_form .foxButton').click(function() {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				var form = el.parents('.mail_encrypt_form');
				var password = form.find('.foxInputer').val();
				window.J2D_SubmitPassword(mailid, password);
			} catch (e) {
				window.J2D_WriteLog('JS: mail_encrypt_form foxButton click: ' + e.message);
			}
		});
		$('.mail_encrypt_form .foxInputer').keypress(function(ev) {
			try {
				if(ev.keyCode == 13) {
					var el = $(this);
					var mailid = el.parents('.mail_session').attr('mailid');
					var form = el.parents('.mail_encrypt_form');
					var password = form.find('.foxInputer').val();
					window.J2D_SubmitPassword(mailid, password);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: .mail_encrypt_form .foxInputer keypress: ' + e.message);
			}
		});

		//
		// 时区转换
		//
		$('.mail_info_switch_time').click(function() {
			try {
				var button = $(this);
				var title = button.attr('title');
				var switchTitle = button.attr('switchTitle');
				var panel = button.parents('.mail_info_fulltime');
				if ( button.attr('status') == 'local' ) {
					panel.find('.their_time').show();
					panel.find('.my_time').hide();
					button.attr('status', 'their');
					button.attr('title', switchTitle);
					button.attr('switchTitle', title);
				} else {
					panel.find('.their_time').hide();
					panel.find('.my_time').show();
					button.attr('status', 'local');
					button.attr('title', switchTitle);
					button.attr('switchTitle', title);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: mail_info_switch_time click: ' + e.message);
			}
		});

		//
		//
		// 引用折叠
		//
		$('.foxmail_blockquote_block_head_tips').click(function() {
			try {
				var tip = $(this);
				var state = tip.attr('state');
				var block = tip.parents('.mail_content_panel').find('.foxmail_blockquote_block');
				if (state == 'hide') {
					block.slideDown(200, function() {
						tip.attr('state', 'show');
						tip.text(tip.attr('hideTip'));
					});
				} else {
					block.slideUp(200, function() {
						tip.attr('state', 'hide');
						tip.text(tip.attr('showTip'));
					});
				}
			} catch (e) {
				window.J2D_WriteLog('JS: foxmail_blockquote_block_head_tips click: ' + e.message);
			}
		});

		//
		// 会话提示
		//
		$('.foxmail_conversation_tips_close_btn').click(function() {
			try {
				$(this).parents('.mail_session_tips').addClass('hide');
				window.J2D_CloseSessionTips();
			} catch (e) {
				window.J2D_WriteLog('JS: foxmail_conversation_tips_close_btn click: ' + e.message);
			}
		});

		//
		// 会话帮助
		//
		$('.foxmail_conversation_tips_help_btn').click(function() {
			try {
				window.J2D_OpenSessionHelp();
			} catch (e) {
				window.J2D_WriteLog('JS: foxmail_conversation_tips_help_btn click: ' + e.message);
			}
		});

		//
		// 禁止a标签在新窗口打开
		//
		$(document).delegate('a', 'mousedown', function(ev) {
			try {
				// 使用浏览器的弹出新窗口拦截，这部分逻辑在Delphi的OnBeforePopup里
				var el = $(this);
				var href = el.attr('href');

				var regexp = /^#/i;
				if (!href.match(regexp)) {
					el.attr('target', '_blank');
					el.attr('href', ReformHref(href) );
				}
			} catch (e) {
				window.J2D_WriteLog('JS: document a mousedown: ' + e.message);
			}
		});

		//
		// 点击area会触发OnBeforeBrowse，但在delphi层我们禁止页面跳转到外部url，
		// 因此这里需要挂载点击事件把area的点击转成普通的window.open行为
		//
		$(document).delegate('area', 'click', function(ev) {
			try {
				var el = $(this);
				var href = el.attr('href');
				if (href !== "") {
						window.open(href);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: document area click: ' + e.message);
			}
		});

		//
		// 邮件备注
		//
		$('.mail_comment_panel').delegate('*', 'click', function(ev) {
			ev.stopPropagation();
		});

		$('.mail_comment_panel .cancel_button').click( function(ev) {
			try {
				var session = $(this).parents('.mail_session');
				var mailid = session.attr('mailid');
				var comment = session.find('.mail_comment_content').text();
				if ( comment == '') {
					ShowComment(mailid, false, false, false);
					ShowCommentEditor(mailid, false, true, false);
				} else {
					ShowComment(mailid, true, false, false);
					ShowCommentEditor(mailid, false, false, false);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: mail_comment_panel cancel_button click: ' + e.message);
			}

		});

		$('.mail_comment_panel .submit_button').click( function(ev) {
			try {
				var session = $(this).parents('.mail_session');
				var mailid = session.attr('mailid');
				var editor = session.find('.mail_comment_editor');
				ShowCommentEditor(mailid, false, false, false);
				var texter = editor.find('.foxTexter');
				texter.length !== 0 && window.J2D_SaveComment(mailid, texter.html());
			} catch (e) {
				window.J2D_WriteLog('JS: mail_comment_panel submit_button click: ' + e.message);
			}
		});

		$('.mail_comment_content').click(function(ev) {
			try {
				var el = $(this);
				var session = el.parents('.mail_session');
				var mailid = session.attr('mailid');
				var comment = session.find('.mail_comment_content');
				ShowComment(mailid, false, false, false);
				ShowCommentEditor(mailid, true, false, true, comment.html());
			} catch (e) {
				window.J2D_WriteLog('JS: mail_comment_content click: ' + e.message);
			}
		});

		//
		// Scroller
		//
		$(window).scroll(function(ev) {
			try {
				$('.mail_session').each(function(){
					AdjustScroller($(this).attr('mailid'));
				});
			} catch (e) {
				window.J2D_WriteLog('JS: window scroll: ' + e.message);
			}
		});

		//
		// 加载邮件正文
		//
		$('.mail_preview_panel').click(function() {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				if (!isNaN(mailid)) {
					setTimeout(function(){
						window.J2D_LoadMail(mailid);
					}, 100);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: mail_preview_panel click: ' + e.message);
			}
		});

		//
		// 会话折起
		//
		$('.general_info_panel').click(function(){
			try {
				if ( $('.mail_session').length == 1 ) {
					return;
				}

				var el = $(this).parents('.mail_session');
				var mailid = el.attr('mailid');
				if ( $('.mail_session').first().attr('mailid') == mailid ) {
					RecoverMailHeight();
				}
				el.find('.mail_full_panel').slideUp(200, function(){
					el.find('.mail_preview_panel').show();
					window.J2D_OpenFastReply(mailid, false);
				});
			} catch (e) {
				window.J2D_WriteLog('JS: general_info_panel click: ' + e.message);
			}
		});

		//
		// 加载邮件详细信息
		//
		$('.detail_info_prompt').click(function(ev) {
			try {
				var el = $(this);
				if (el.attr('state') == 'open') {
					el.parents('.mail_session').find('.detail_info_panel').slideUp(200, function(){
						el.attr('state', 'close');
						el.text(el.attr('showPrompt'));
						window.J2D_ShowMailDetail(false);
					});
				} else {
					el.attr('state', 'open');
					el.text(el.attr('hidePrompt'));
					window.J2D_ShowMailDetail(true);

					var mailid = el.parents('.mail_session').attr('mailid');
					if (!isNaN(mailid)) window.J2D_LoadMailDetail(mailid);
				}
				ev.stopPropagation();
			} catch (e) {
				window.J2D_WriteLog('JS: detail_info_prompt click: ' + e.message);
			}
		});

		//
		// 加载更多
		//
		$('.show_more_button').mousedown(function(ev) {
			try {
				ShowLoadMoreMailsProcess();
				$('.show_more_button').addClass('hide');
				window.J2D_LoadMoreMails();
			} catch (e) {
				window.J2D_WriteLog('JS: show_more_button click: ' + e.message);
			}
		});

		//
		// 邮件置顶
		//
		$('.mail_top_most').click(function(){
			try {
				var el = $(this);
				var bTop = el.hasClass('top') ? false : true;
				var mailid = el.parents('.mail_session').attr('mailid');
				window.J2D_ChangeTopState(mailid, bTop);
			} catch (e) {
				window.J2D_WriteLog('JS: mail_top_most click: ' + e.message);
			}
		});

		//
		// 快速回复
		//
		$('.fastreply_button').click(function(ev) {
			try {
				var session = $(this).parents('.mail_session');
				var mailid = session.attr('mailid');
				window.J2D_OpenFastReply(mailid, true);
				ev.stopPropagation();
			} catch (e) {
				window.J2D_WriteLog('JS: fastreply_button click: ' + e.message);
			}
		});

		//
		// 控制菜单
		//
		$('.control_button').mousedown(function(ev) {
			ev.stopPropagation();
			var el = $(this);
			try {
				setTimeout(function() {
					if (!isMenuCanPopup) {
						return;
					}
					isMenuCanPopup = false;
					var session = el.parents('.mail_session');
					var mailid = session.attr('mailid');
					var state = session.find('.fast_reply_panel').attr('state');
					var bFastReplyOpen = state == 'open' ? true : false;
					var box = el[0].getBoundingClientRect();
					window.J2D_ShowContextMenu('main_head', box.left - 111, box.top + el.height() + 2, mailid, bFastReplyOpen);
				}, 10);
			} catch (e) {
				window.J2D_WriteLog('JS: control_button: click: ' + e.message);
			}
		});

		//
		// 快速回复
		//
		$('.fast_reply_panel .foxTexter').on('input propertychange', function(){
			try {
				var el = $(this);
				if (el.text() != '') {
					el.parent().find('.send_button').removeClass('disable').addClass('blue');
				} else {
					el.parent().find('.send_button').removeClass('blue').addClass('disable');
				}
			} catch (e) {
				window.J2D_WriteLog('JS: fast_reply_panel foxTexter click: ' + e.message);
			}
		});
		$('.fast_reply_panel .send_button').click( function(){
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				EvokeSendFastReply(mailid);
			} catch (e) {
				window.J2D_WriteLog('JS: fast_reply_panel send_button click: ' + e.message);
			}
		});
		$('.fast_reply_panel .cancel_button').click( function(){
			try {
				var mailid = $(this).parents('.mail_session').attr('mailid');
				window.J2D_OpenFastReply(mailid, false);
			} catch (e) {
				window.J2D_WriteLog('JS: fast_reply_panel cancel_button click:' + e.message);
			}
		});

		//
		// 会议请求
		//
		$('.mail_meeting_accept_button').click( function() {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				window.J2D_ResponseMeeting(mailid, 'accept');
			} catch (e) {
				window.J2D_WriteLog('JS: mail_meeting_accept_button: click' + e.message);
			}
		});
		$('.mail_meeting_tentative_button').click( function() {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				window.J2D_ResponseMeeting(mailid, 'tentative');
			} catch (e) {
				window.J2D_WriteLog('JS: mail_meeting_tentative_button click: ' + e.message);
			}
		});
		$('.mail_meeting_refuse_button').click( function() {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				window.J2D_ResponseMeeting(mailid, 'refuse');
			} catch (e) {
				window.J2D_WriteLog('JS: mail_meeting_refuse_button click: ' + e.message);
			}
		});

		//
		// 附件点击
		//
		$('.attachments_list').delegate('.attachment_item', 'mousedown', function(ev) {
			if (ev.ctrlKey || ev.shiftKey) return;
			var el = $(this);
			var list = el.parents('.attachments_list');

			if (!el.hasClass('selected')) {
				list.find('.attachment_item').removeClass('selected');
				el.addClass('selected');
			}
		}).delegate('.attachment_item', 'click', function(ev) {
			try {
				var el = $(this);
				var list = el.parents('.attachments_list');
				if (ev.shiftKey) {	// shift
					var hit = parseInt(list.attr('shiftHit'));
					if (el.attr('type') == 'huge')
						var index =	parseInt(el.attr('index')) + list.find('.normal_attachment').length;
					else
						var index = parseInt(el.attr('index'));
					if (hit == -1) {	// 第一次使用shift
						el.addClass('selected');
						list.attr('shiftHit', index);
						ev.stopPropagation();
						return;
					}
					var start = Math.min(index, hit);
					var end = Math.max(index, hit);
					var items = list.find('.attachment_item');
					for (var i = 0; i < items.length; i++) {
						if ( (i >= start) && (i <= end) )
							$(items[i]).addClass('selected');
						else
							$(items[i]).removeClass('selected');
					}
				} else if (ev.ctrlKey) {
					if (el.hasClass('selected')) el.removeClass('selected');
					else {
						if (el.attr('type') == 'huge')
							var index =	parseInt(el.attr('index')) + list.find('.normal_attachment').length;
						else
							var index = parseInt(el.attr('index'));
						list.attr('shiftHit', index);
						el.addClass('selected');
					}
				} else {
					if (el.attr('type') == 'huge')
						var index =	parseInt(el.attr('index')) + list.find('.normal_attachment').length;
					else
						var index = parseInt(el.attr('index'));
					list.attr('shiftHit', index);
					list.find('.attachment_item').removeClass('selected');
					el.addClass('selected');
				}
				ev.stopPropagation();
				gMailId = el.parents('.mail_session').attr('mailid');
			} catch (e) {
				window.J2D_WriteLog('JS: attachment_item click: ' + e.message);
			}
		}).delegate('.attachment_item', 'dblclick', function() {
			try {
				var el = $(this);
				var session = el.parents('.mail_session');
				var mailid = session.attr('mailid');

				var names = [];
				var infos = [];

				var attachments = session.find('.attachment_item[type="normal"]');
				var nAttachCount = attachments.length;
				attachments.each(function() {
					var item = $(this);
					names[names.length] = item.attr('name');
					infos[infos.length] = item.attr('index');


				});

				var attachments = session.find('.attachment_item[type="huge"]');
				attachments.each(function() {
					var item = $(this);
					names[names.length] = item.attr('name');
					infos[infos.length] = item.attr('downloadUrl');
				});

				var isHuge = false;
				var showIndex = parseInt( el.attr('index') );
				if (el.attr('type') == 'huge') {
					var showIndex = showIndex + nAttachCount;
					isHuge = true;
				}
				
				var isLoaded = el.attr('state') == 'loaded';
				window.J2D_DoubleClickAttachment(mailid, nAttachCount, showIndex, names, infos, isHuge, isLoaded);
				if ( ! isLoaded ) {
					return;
				}				
				window.J2D_PreviewAttachment(mailid, nAttachCount, showIndex, names, infos, isHuge);
			} catch (e) {
				window.J2D_WriteLog('JS: attachment_item dblclick: ' + e.message);
			}
		});

		//
		// 附件折叠
		//
		$('.attachments_slide_button').click( function(){
			try {
				var el = $(this);
				var list = el.parents('.attachments_info').find('.attachments_list');
				function SlideDown() {
					var height = list.height();
					var scrollHeight = list[0].scrollHeight;
					if (height < scrollHeight) {
						height = height + 8;
						height = height < scrollHeight ? height : scrollHeight;
						list.height(height);
						setTimeout(SlideDown, 10);
					} else {
						list.height(scrollHeight);
						list.height('auto');
					}
				}
				function SlideUp() {
					var maxHeight = 80;
					var height = list.height();
					if (maxHeight < height) {
						height = height - 8;
						height = maxHeight < height ? height : maxHeight;
						list.height(height);
						setTimeout(SlideUp, 10);
					} else {
						list.height(maxHeight);
						list.height('auto').addClass('collapse');
					}
				}
				if (el.hasClass('down')) {
					list.height(list.height()).removeClass('collapse');
					SlideDown();
					el.removeClass('down').addClass('up');
				} else {
					SlideUp();
					el.removeClass('up').addClass('down');
				}
			} catch (e) {
				window.J2D_WriteLog('JS: attachments_slide_button: ' + e.message);
			}
		});
		function CopyAttachments() {
			try {
				var files = [];
				var indexs = [];
				$('#mail_session_'+gMailId).find('.attachment_item').each(function() {
					var el = $(this);
					if (el.hasClass('selected')) {
						files[files.length] = el.attr('name');
						indexs[indexs.length] = el.attr('index');
					}
				});
				if (files.length > 0) {
					window.J2D_CopyAttachments(gMailId, files, indexs);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: CopyAttachments: ' + e.message);
			}
		}
		$('.attachment_item').on('dragstart', function(ev) {
			try {
				var el = $(this);
				var mailid = el.parents('.mail_session').attr('mailid');
				var p = el.parents('.attachments_list');
				el = p.children('.attachment_item').filter('.selected').add($(this));
				var data = '';
				var index;
				for (index = 0; index < el.length; index++) {
					var item = $(el[index]);
					if (item.attr('type') == 'normal') {
						data = data + MakeNormalAttachmentClipboardData(mailid, item.attr('index'), item.attr('name')) + '\n';
					} else if (item.attr('type') == 'huge') {
						data = data + MakeHugeAttachmentClipboardData(mailid, item.attr('name'), item.attr('downloadUrl')) + '\n';
					}
				}
				ev.originalEvent.dataTransfer.setData("foxmail_attachments", data);
			} catch (e) {
				window.J2D_WriteLog('JS: attachment_item dragstart: ' + e.message);
			}
		});

		//
		// 联系人点击
		//
		$('.mail_contact_item').click(function(ev) {
			try {
				ev.stopPropagation();

				if(window.getSelection().toString() != '') return;

				var el = $(this);

				var mailid = el.parents('.mail_session').attr('mailid');
				var name = el.attr('name');
				var email = el.attr('email');
				var box = el[0].getBoundingClientRect();
				window.J2D_ShowContactBoard(mailid, name, email, ev.clientX+5, ev.clientY+5, true);
			} catch (e) {
				window.J2D_WriteLog('JS: mail_contact_item mouseup: ' + e.message);
			}
		});

		function AdjustAttachmentArea() {
			try {
				var cMaxHeight = 80;
				var els = $('.attachments_info');
				els.each(function(){
					var el = $(this);
					var list = el.find('.attachments_list');
					var scrollHeight = list[0].scrollHeight;
					if (scrollHeight <= cMaxHeight) {
						el.find('.attachments_slide_button').hide();
						el.parent().find('.attachments_info_bottom').removeClass('crown');
					} else if(scrollHeight > (list.height() + 5)) {
						el.find('.attachments_slide_button').removeClass('up').addClass('down').show();
						el.parent().find('.attachments_info_bottom').addClass('crown');
					} else {
						el.find('.attachments_slide_button').hide();
						el.parent().find('.attachments_info_bottom').removeClass('crown');
					}
				});
			} catch (e) {
				window.J2D_WriteLog('JS: AdjustAttachmentArea: ' + e.message);
			}
		}
		setTimeout(AdjustAttachmentArea, 1);

		// Resize
		$(window).resize(function() {
			try {
				// 邮件高度
				var els = $('.mail_full_panel');
				if (els.length == 1) {
					AdjustMailHeight();
				}
				// 附件区域
				AdjustAttachmentArea();
				// 调整横向滚动条
				// InitScroller();
				AdjustScroller();

				// 修正邮件正文高度不正确，引起内容无法看到的问题
				Fix.FixContentPanelHeigth();
			} catch (e) {
				window.J2D_WriteLog('JS: resize: ' + e.message);
			}
		});
		// Keydown
		$(document).keydown(function(ev) {
			try {
				var vKey = 86, cKey = 67;
		    	if (ev.ctrlKey) {
		    		// Ctrl + c: Copy
		    		if (ev.keyCode == cKey) {
		    			CopyAttachments();
		    		}
		    	}
			} catch (e) {
				window.J2D_WriteLog('JS: keydown: ' + e.message);
			}
		});

		//
		// 右键菜单
		//
		$(document).bind('contextmenu',function(ev){
			function isBasicElement(target) {
				if (target.length != 0) {
					var tagName = target[0].tagName;
					if ( (tagName == 'IMG') || (tagName == 'A') ) {
						return true;
					} else if (target.parents('IMG').length != 0) {
						return true;
					} else if (target.parents('A').length != 0) {
						return true;
					}
				}
				return false;
			}
			try {
				var target = $(ev.target);
				gRightClickElement = target;
				var session = target.parents('.mail_session');
				if (session.length <= 0) return;
				var mailid = session.attr('mailid');

				if ( target.hasClass('attachment_item') || (target.parents('.attachment_item').length > 0) ) {	// 附件
					ev.preventDefault();

					if (target.hasClass('attachment_item')) {
						var targetItem = target;
					} else {
						var targetItem = target.parents('.attachment_item');
					}

					var list = target.parents('.attachments_list');

					if ( !targetItem.hasClass('selected') ) {
						list.find('.selected').removeClass('selected');
						targetItem.addClass('selected');
					}

					var type = '';
					var selectedItems = list.find('.selected');
					selectedItems.each(function () {
						var temp = $(this).attr('type');
						if (type !== temp) type = type + temp;
					});
					if ( type == 'normal' ) {  // 选中普通附件
						var nNames = [], nIndexes = [];
						var selectIndex = targetItem.attr('index');
						var selectName = targetItem.attr('name');
						selectedItems.each(function() {
							nNames[nNames.length] = $(this).attr('name');
							nIndexes[nIndexes.length] = $(this).attr('index');
						});
						window.J2D_ShowContextMenu('attachment', ev.clientX, ev.clientY, mailid, 'normal', nNames, nIndexes, selectIndex, selectName);

					} else if ( type == 'huge' ) {  // 选中超大附件
						var hNames = [], hUrls = [];
						selectedItems.each(function() {
							hNames[hNames.length] = $(this).attr('name');
							hUrls[hUrls.length] = $(this).attr('downloadUrl');
						});
						window.J2D_ShowContextMenu('attachment', ev.clientX, ev.clientY, mailid, 'huge', hNames, hUrls);
					}
				} else if ( target.hasClass('mail_contact_item') || target.parents('.mail_contact_item').length > 0 ) {
					ev.preventDefault();

					var selection = window.getSelection().toString();
					var bHasSelection = selection != '';

					var nodes = [];
					if (bHasSelection) {
						nodes = GetNamesAndAddrsFromText(selection);
					} else {
						if (target.hasClass('mail_contact_item')) {
							var targetItem = target;
						} else {
							var targetItem = target.parents('.mail_contact_item');
						}
						var name = targetItem.attr('name');
						var addr = targetItem.attr('email');
						nodes[nodes.length] = [name, addr];
					}
					
					window.J2D_ShowContextMenu('address', ev.clientX, ev.clientY, mailid, nodes, bHasSelection);

				} else if ( window.getSelection().toString() != '' ) {
					// 这里不做处理
				} else if ( !target.hasClass('foxTexter') && !isBasicElement(target) ) {	// 邮件主菜单
					ev.preventDefault();

					var state = session.find('.fast_reply_panel').attr('state');
					var bFastReplyOpen = state == 'open' ? true : false;
					window.J2D_ShowContextMenu('main_body', ev.clientX, ev.clientY, mailid, bFastReplyOpen);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: document contextmenu: ' + e.message);
			}
		}).bind('dragover', function(ev) {
            dataTransfer = ev.dataTransfer || ev.originalEvent.dataTransfer;
            dataTransfer.dropEffect = 'none';
            ev.stopPropagation();
            ev.preventDefault();
        });

		$(document).click( function(ev) {
			try {
				$('.attachment_item').removeClass('selected');
				$('.attachments_list').attr('shiftHit', -1);
				$('.mail_header_receiver_item').removeClass('selected');

				// 保存备注
				var session = $(ev.target).parents('.mail_session');
				var mailid = session.attr('mailid');
				var editor = session.find('.mail_comment_editor');
				if ( editor.is(':visible') ) {
					ShowCommentEditor(mailid, false, false, false);
					window.J2D_SaveComment(mailid, editor.find('.foxTexter').text());
				}
				gSelectMailId = mailid;
			} catch (e) {
				window.J2D_WriteLog('JS: document click: ' + e.message);
			}
		});

		//
		// 字体放大缩小
		//
		var bCtrlDown = false;
		var bShiftDown = false;
		$(document).keydown( function(ev) {
			try {
				if ( ev.ctrlKey ) {
					bCtrlDown = true;
				}
				if ( ev.shiftKey ) {
					bShiftDown = true;
				}
				if ( ev.keyCode == 188 ) {
					if ( bCtrlDown && bShiftDown )
						ZoomFontSize(0, false);
				} else if ( ev.keyCode == 190 ) {
					if ( bCtrlDown && bShiftDown )
						ZoomFontSize(0, true);
				}
			} catch (e) {
				window.J2D_WriteLog('JS: document keydown: ' + e.message);
			}
		}).keyup( function(ev) {
			try {
				if ( ev.ctrlKey ) {
					bCtrlDown = false;
				}
				if ( ev.shiftKey ) {
					bCtrlDown = false;
				}
			} catch (e) {
				window.J2D_WriteLog('JS: document keyup: ' + e.message);
			}
		});
	} catch (e) {
		window.J2D_WriteLog('JS: InitEventHandler: ' + e.message);
	}
}
