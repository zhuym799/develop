window.D2J_UpdatePanel = function(panel) {
	$('body').html(panel).scrollTop(0);
	InitEventHandler();
}

window.D2J_GetDisplayNameData = function() {
	var lastName = $('#last_name').val();
	var firstName = $('#first_name').val();
	var nick = $('.nickname_editor input').val();
	var typeNum = $('.displayNameStyle').attr('typeNum');

	return {
		lastName: 	lastName,
		firstName: 	firstName,
		nick: 		nick,
		typeNum: 	typeNum 
	}
}

window.D2J_GetPersonData = function() {
	var avatar = $('#contactAvatar_img').attr('src');
	var lastName = $('#last_name').val();
	var firstName = $('#first_name').val();
	var displayNameType = $('.displayNameStyle').attr('typeNum');

	var emails = [];
	var emailTypes = [];
	// 默认邮箱放在第一位
	var defaultEmail = $('.set_default_email input[type="email"]');
	if (defaultEmail.length > 0) {
		var label = defaultEmail.parents('.email_item_container').find('.email_item_label');
		emails[emails.length] = defaultEmail.val();
		emailTypes[emailTypes.length] = label.attr('typeNum');	
	}
	$('input[type="email"]').each(function() {
		var el = $(this);
		var con = el.parents('.email_item_container');
		if (!con.hasClass('set_default_email')) {
			var label = con.find('.email_item_label');
			var val = $.trim( el.val() ); 
			if ( val && ($.inArray(val, emails) == -1) ) {
				emails[emails.length] = val;
				emailTypes[emailTypes.length] = label.attr('typeNum');	
			}	
		}
	});
	
	var phones = [];
	var phoneTypes = [];
	$('input[type="tel"]').each(function() {
		var el = $(this);
		var label = $(this).parents('.tel_item_container').find('.tel_item_label');
		var val = $.trim( el.val() ); 
		if ( val ) {
			phones[phones.length] = val;
			phoneTypes[phoneTypes.length] = label.attr('typeNum');		
		}
	});

	var notions = $('.other_editor textarea').val();

	var sex = $('.sex_editor .selectBox').attr('typeNum');
	var birthday = $('.birthday_editor input').val();
	var qq = $('.qq_editor input').val();
	var nick = $('.nickname_editor input').val();
	var website = $('.website_editor input').val();
	var familyCountry = $('.family_country_editor input').val();
	var familyProvince = $('.family_province_editor input').val();
	var familyCity = $('.family_city_editor input').val();
	var familyStreet = $('.family_street_editor input').val();
	var familyPostcode = $('.family_postcode_editor input').val();

	var company = $('.company_editor input').val();
	var department = $('.department_editor input').val();
	var position = $('.position_editor input').val();
	var fax = $('.fax_editor input').val();
	var companyCountry = $('.company_country_editor input').val();
	var companyProvince = $('.company_province_editor input').val();
	var companyCity = $('.company_city_editor input').val();
	var companyStreet = $('.company_street_editor input').val();
	var companyPostcode = $('.company_postcode_editor input').val();

	return {
		avatar: 		avatar,
		lastName: 		lastName,
		firstName: 		firstName,
		displayNameType:displayNameType,
		emails: 		emails,
		emailTypes: 	emailTypes,
		phones:  		phones,
		phoneTypes: 	phoneTypes,
		notions: 		notions,
		sex: 			sex,
		birthday: 		birthday,
		qq: 			qq,
		nick: 			nick,
		website: 		website,
		familyCountry: 	familyCountry,
		familyProvince: familyProvince,
		familyCity: 	familyCity,
		familyStreet: 	familyStreet,
		familyPostcode: familyPostcode,
		company: 		company,
		department: 	department,
		position: 		position,
		fax: 			fax,
		companyCountry: companyCountry,
		companyProvince:companyProvince,
		companyCity: 	companyCity,
		companyStreet: 	companyStreet,
		companyPostcode:companyPostcode
	}
}

window.D2J_GetGroupData = function() {
	var name = $('.displayName_edit input').val();
	return {
		name: name
	}
}

window.D2J_UpdateMembers = function(members) {
	$('.groupEdit_memberList').html(members);
	var count = $('.groupEdit_memberList').find('.groupEdit_memberList_item').length;
	$('.memberSection_title_label_edit span').text('(' + count + ')');
	InitEventHandler();
}

// todo 失效的问题应该与窗口焦点有关
window.D2J_InputError = function(where) {
	$('.errMsg').hide();

	if (where == 'personName') {
		$('.switch_display_name').hide();
		$('.contactName_edit .errMsg').show();
		$('#last_name').focus();
	} else if (where == 'mailAddr') {
		var inputs = $('.email_item_editors input');
		if (inputs.length > 0) {
			$('.contactEdit_emailList .errMsg').show();
			$(inputs[0]).focus();
		}
	} else if (where == 'groupName') {
		$('.groupName_edit .errMsg').show();
		$('.groupName_edit input').focus();
	}
}

window.D2J_UpdateDisplayName = function(vType, value) {
	$('.displayNameStyle').attr('typeNum', vType).text(value);
}

window.D2J_UpdateMailAddrType = function(vType, value) {
	$('.email_item_label[sel="true"]').attr('typeNum', vType).text(value);
}

window.D2J_SetDefaultMailAddr = function(bDefault) {
	$('.email_item_container').removeClass('set_default_email');
	$('.email_item_label[sel="true"]').parents('.email_item_container').addClass('set_default_email');
}

window.D2J_UpdatePhoneType = function(vType, value) {
	$('.tel_item_label[sel="true"]').attr('typeNum', vType).text(value);
}

window.D2J_UpdateBirthday = function(value) {
	$('.birthday_editor input').val(value);
}

window.D2J_UpdateAvatar = function(avatarPath) {
	$('#contactAvatar_img').attr('src', avatarPath);
}

var isMenuCanPopup = true;
window.D2J_ResetCanPopupFlag = function(where, bCan) {
	function setMenuFlag(bCan) {
		!bCan ? isMenuCanPopup = bCan : setTimeout(function() {
			isMenuCanPopup = bCan;
		}, 100);
	}
	if (where == 'menu') {
		setMenuFlag(bCan);
	}
}

$(document).ready(function() {

});

function InitEventHandler() {
	$(document).unbind();
	$('.displayName_view').unbind();

	$(document).click(function() {
		window.J2D_PopupCalendar(0, 0, '', false);
		window.J2D_ShowContactBoard('0', 0, 0, false);
		$('.selectItems').slideUp(50, function() {
			$(this).attr('state', 'close');
		});
	});

	$(document).bind('contextmenu', function(ev) {
		window.J2D_PopupContextMenu(ev.clientX+5, ev.clientY+5);
	});

	$(document).scroll(function() {
		window.J2D_PopupCalendar(0, 0, '', false);
	});

	$('.displayName_view').click(function() {
		if (window.getSelection().toString() !== '') {
			return;	
		}
		var el = $(this);
		var area = el.parents('.contactViewArea');
		if (area.length < 1) {
			area = el.parents('.groupViewArea');	
		}
		
		if (area.length > 0) {
			var noteId = area.attr('noteId');
			window.J2D_PopupCompose('noteId', noteId);	
			return;
		}
	});

	$(document).keydown(function(ev) {
		if (event.keyCode == 13) {
			if (ev.target.tagName == 'TEXTAREA') {
				return;
			}
			if ( $(ev.target).parents('.contactEditPanel').length != 0 ) {
				window.J2D_SavePerson();	
			}
			if ( $(ev.target).parents('.groupEditPanel').length != 0 ) {
				window.J2D_SaveGroup();	
			}
		}
	});

	// Person -------------
	$('.contactEditBtn').unbind();
	$('.savePersonButon').unbind();
	$('.cancelPersonButon').unbind();
	$('.deletePersonButon').unbind();
	$('.email_item').unbind();
	$('.relate_email').unbind();
	$('.mailGroupList_item span').unbind();
	$('.editMore span').unbind();
	$('.birthday_editor').unbind();
	$('.sex_editor .selectBox').unbind();
	$('.sex_editor .selectItems').unbind();
	$('.contactAvatar_edit #contactAvatar_img').unbind();

	// 初始化姓名区域
	InitPersonNameAreaEvent();

	// 编辑
	$('.contactEditBtn').click(function() {
		window.J2D_EditPerson();
	});

	// 保存
	$('.savePersonButon').click(function() {
		window.J2D_SavePerson();
	});
	
	// 取消
	$('.cancelPersonButon').click(function() {
		window.J2D_CancelPerson();
	});

	// 删除
	$('.deletePersonButon').click(function() {
		window.J2D_DeletePerson();
	});

	// 打开写信窗口
	$('.email_item').click(function(ev) {
		if (window.getSelection().toString() !== '') {
			return;	
		}
		var email = $(this).text();
		window.J2D_PopupCompose('email', email);
	});

	// 往来邮件
	$('.relate_email').click(function(ev) {
		if (window.getSelection().toString() !== '') {
			return;	
		}	
		var email = $(this).parents('.viewPanel_item_email').find('.email_item').text();
		window.J2D_FindRelatedMails('email', email);
	});

	// 邮件组--资料卡
	$('.mailGroupList_item span').click(function(ev) {
		if (window.getSelection().toString() !== '') return;	

		var el = $(this).parents('.mailGroupList_item');

		var noteId = el.attr('groupId');
		window.J2D_ShowContactBoard(noteId, ev.clientX+5, ev.clientY+5, true);
		ev.stopPropagation();		
	});

	// 编辑更多
	$('.editMore span').click(function() {
		$('.editMore').hide();
		$('.contactEdit_personalSection').slideDown(100, function() {
			$('.contactEdit_companySection').slideDown(100);
		});	
	});

	// 初始化邮箱区域事件
	InitMailAreaEvent();

	// 初始化电话区域事件
	InitPhoneAreaEvent();

	// 生日
	$('.birthday_editor').click(function(ev) {
		var editor = $('.birthday_editor');

		var birthday =  editor.find('input').val();
		var pt = editor[0].getBoundingClientRect();
		window.J2D_PopupCalendar(pt.left + editor.width(), pt.top + editor.height(), birthday, true);
		ev.stopPropagation();
	});

	// 性别
	$('.sex_editor .selectBox').click(function(ev) {
		var el = $(this);
		var list = el.parent().find('.selectItems');
		if (list.attr('state') == 'open') {
			list.slideUp(50, function() {
				list.attr('state', 'close');	
			});
		} else {
			list.slideDown(50, function() {
				list.attr('state', 'open');
			});
		}
		ev.stopPropagation();
	});
	$('.sex_editor .selectItems').delegate('li', 'click', function() {
		var el = $(this);
		var box = $('.selectBox');
		box.attr('typeNum', el.attr('typeNum'));
		box.text(el.text());
		var list = el.parents('.selectItems');
		list.slideUp(50, function() {
			list.attr('state', 'close');
		});
	});

	// 头像
	$('.contactAvatar_edit #contactAvatar_img').click(function() {
		window.J2D_SetAvatar();
	});


	// Group -------------
	$('.groupEditBtn').unbind();
	$('.groupName_edit input').unbind();
	$('.addMemberBtn').unbind();
	$('.removeMemberBtn').unbind();
	$('.saveGroupButton').unbind();
	$('.cancelGroupButton').unbind();
	$('.deleteGroupButton').unbind();
	$('.member_name').unbind();
	
	// 编辑
	$('.groupEditBtn').click(function() {
		window.J2D_EditGroup();
	});

	// 组名
	$('.groupName_edit input').bind('input', function() {
		$('.groupName_edit .errMsg').hide();
	});

	// 增加成员
	$('.addMemberBtn').click(function() {
		window.J2D_AddMember();
	});

	// 移除成员
	$('.removeMemberBtn').click(function() {
		var id = $(this).parents('.groupEdit_memberList_item').attr('noteId');
		if (id) {
			window.J2D_DeleteMember(id);	
		}
	});

	// 保存
	$('.saveGroupButton').click(function() {
		window.J2D_SaveGroup();
	});
	
	// 取消
	$('.cancelGroupButton').click(function() {
		window.J2D_CancelGroup();
	});

	// 删除
	$('.deleteGroupButton').click(function() {
		window.J2D_DeleteGroup();
	});

	// 组成员--资料卡
	$('.member_name').click(function(ev) {
		if (window.getSelection().toString() !== '') return;	

		var el = $(this).parents('.groupView_memberList_item');

		var noteId = el.attr('noteId');
		window.J2D_ShowContactBoard(noteId, ev.clientX+5, ev.clientY+5, true);
		ev.stopPropagation();		
	});
}

function InitPersonNameAreaEvent() {
	$('#last_name').unbind();
	$('#first_name').unbind();
	$('.nickname_editor input').unbind();
	$('.displayNameStyle').unbind();

	function GetDisplayName(typeNum, firstName, lastName, nick) {
		switch( typeNum ) {
			case 0: 	return lastName + firstName;
			case 1: 	return lastName + ' ' + firstName;
			case 2: 	return lastName + ',' + firstName;
			case 3: 	return firstName + ' ' + lastName;
			case 4: 	return firstName + lastName;
			case 5: 	return atNick;
			default: 	return '';
		}
	}
	function UpdateDisplayName() {
		var typeNum = parseInt( $('.displayNameStyle').attr('typeNum') );
		var firstName = $('#first_name').val();
		var lastName = $('#last_name').val();
		var nick = $('.nickname_editor input').val();
		$('.displayNameStyle').attr('typeNum', typeNum).text( GetDisplayName(typeNum, firstName, lastName, nick) );
		$('.switch_display_name').show();
		$('.contactName_edit .errMsg').hide();	
	}

	$('#last_name').on('input', function() {
		UpdateDisplayName();
	});
	$('#first_name').on('input', function() {
		UpdateDisplayName();
	});
	$('.nickname_editor input').on('input', function() {
		UpdateDisplayName();
	});

	// 显示姓名为菜单
	$('.displayNameStyle').mousedown(function(ev) {
		var el = $(this);
		if (!isMenuCanPopup) {
			return;
		}
		isMenuCanPopup = false;
		var pt = el[0].getBoundingClientRect();
		window.J2D_PopupDisplayNameMenu(pt.left, pt.top + el.height());			
	});
}

function InitMailAreaEvent() {
	$('.email_item_label').unbind();
	$('.addEmail').unbind();
	$('.email_item_btn').unbind();
	$('.email_list input').unbind();

	// 邮箱类型菜单
	$('.email_item_label').mousedown(function(ev) {
		var el = $(this);
		if (!isMenuCanPopup) {
			return;
		}
		isMenuCanPopup = false;

		var typeNum = el.attr('typeNum');
		$('.email_item_label').attr('sel', 'false');
		el.attr('sel', 'true');
		var bDefault = false;
		if (el.parents('.email_item_container').hasClass('set_default_email')) {
			bDefault = true;
		}
		var pt = el[0].getBoundingClientRect();
		window.J2D_PopupMenu('mailAddrType', pt.left, pt.top + el.height(), typeNum, bDefault);	
	});

	// 设置删除邮箱按钮
	function InitDelMailButton() {
		var items = $('.email_item_container');
		if (items.length < 2) {
			$('.email_item_btn').hide();	
		} else {
			$('.email_item_btn').show();
		}
	}
	InitDelMailButton();

	// 增加邮箱
	$('.addEmail').click(function(ev) {
		if ($(this).hasClass('disable')) {
			return;
		}
		var items = $('.email_item_container');
		if (items.length > 0) {
			var item = $(items[0].outerHTML).removeClass('set_default_email').hide();
			$('.email_list').append(item);
			item.slideDown(100, function() {
				item.find('input').focus();
				InitMailAreaEvent();	
			}).find('input').val('');
		}
	});

	// 删除邮箱
	$('.email_item_btn').click(function(ev) {
		var item = $(this).parents('.email_item_container');
		item.slideUp(100, function() {
			var bDefault = item.hasClass('set_default_email');
			item.remove();
			if (bDefault) {
				$('.email_item_container').first().addClass('set_default_email');
			}
			InitMailAreaEvent();	
		});
	});

	// 邮箱输入
	$('.email_list input').bind('input', function() {
		$('.addEmailBar .errMsg').hide();	
	});
}

function InitPhoneAreaEvent() {
	$('.tel_item_label').unbind();
	$('.addTel').unbind();
	$('.tel_item_btn').unbind();

	// 电话类型菜单
	$('.tel_item_label').click(function(ev) {
		return;

		var el = $(this);
		var typeNum = el.attr('typeNum');
		$('.tel_item_label').attr('sel', 'false');
		el.attr('sel', 'true');
		var pt = el.offset();

		var existTypes = [];
		$('.tel_item_label').each(function() {
			existTypes[existTypes.length] = $(this).attr('typeNum');
		});
		window.J2D_PopupMenu('phoneType', pt.left, pt.top + el.height(), typeNum, existTypes);	
	});

	// 设置增加电话按钮
	function InitAddTelButton() {
		var tels = $('.tel_item_container');
		if (tels.length >= 6) {
			$('.addTel').addClass('disable');
		} else {
			$('.addTel').removeClass('disable');
		}
	}

	// 设置删除电话按钮
	function InitDelTelButton() {
		var tels = $('.tel_item_container');
		if (tels.length < 2) {
			$('.tel_item_btn').hide();	
		} else {
			$('.tel_item_btn').show();
		}
	}
	InitAddTelButton();
	InitDelTelButton();

	// 增加电话
	$('.addTel').click(function(ev) {
		if ($(this).hasClass('disable')) {
			return;
		}
		var items = $('.tel_item_container');
		if (items.length > 0) {
			var li = $(items[0].outerHTML).hide();
			$('.tel_list').append(li);
			li.find('input').val('');
			li.slideDown(100, function() {
				li.find('input').focus();
				InitPhoneAreaEvent();
			})
		}
	});

	// 删除电话
	$('.tel_item_btn').click(function(ev) {
		var item = $(this).parents('.tel_item_container');
		item.slideUp(100, function() {
			item.remove();
			InitPhoneAreaEvent();
		});
	});
}