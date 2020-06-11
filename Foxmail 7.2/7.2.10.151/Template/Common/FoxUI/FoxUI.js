/* Button */
(function($) {
	//
	// FoxButton类
	//
	var FoxButton = function(el) {
		this.el = $(el);
	};
	FoxButton.prototype = {
		disable: function() {
			this.el.removeClass('normal');
			this.el.addClass('disable');
		},
		enable: function() {
			this.el.removeClass('disable');
			this.el.addClass('normal');
		}
	};
	$.fn.foxButton = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxButton');
			if (!data) el.data('foxButton', (data = new FoxButton(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);

/* Combobox */
(function($) {
	//
	// FoxCombobox类
	//
	var FoxCombobox = function(el) {
		this.el = $(el);
		$(document).bind('click', $.proxy(this.pullup, this));
		this.input = this.el.find('a');
		this.input.bind('mouseover', $.proxy(this.toggleInputHover, this));
		this.input.bind('mouseout', $.proxy(this.toggleInputHover, this));
		this.input.bind('click', $.proxy(this.toggle, this));
		this.el.find('.select-button').bind('click', $.proxy(this.toggle, this));
		this.el.delegate('li', 'mouseover', $.proxy(this.liHover, this));
		this.el.delegate('li', 'click', $.proxy(this.select, this));
		this.isDisable = false;
	};
	FoxCombobox.prototype = {
		//
		// 获取输入项
		//
		getValue: function(){
			return this.input.text();
		},

		//
		//	设置输入项
		//
		setValue: function(data){
			this.input.text(data);
		},

		//
		// 更新下拉选项
		//
		updateList: function(items) {
			this.el.find('li').remove();
			var ul = this.el.find('ul');
			for (var i = 0; i < items.length; i++) {
				var li = '<li val='+items[i]+'>' + items[i] + '</li>';
				ul.append(li);
			};
		},
		disable: function() {
			this.isDisable = true;
		},
		enable: function() {
			this.isDisable = false;
		},
		toggleInputHover: function(e) {
			if(this.isDisable) return;
			if(this.isDropdown) return;

			if(e.type === 'mouseover') {
				this.el.removeClass('normal press');
				this.el.addClass('hover');
			}
			if(e.type === 'mouseout') {
				this.el.removeClass('hover press');
				this.el.addClass('normal');
			}
		},
		//
		// 选项hover效果
		//
		liHover: function(e) {	
			this.el.find("li").each(function(){
				$(this).removeClass("hover");
			});
			$(e.target).addClass("hover");
		},

		select: function(e) {
			var value = $(e.target).attr('val');
			this.setValue(value);
			this.toggle(e);
		},

		pullup: function(e) {
			if(this.isDropdown) {
				this.el.removeClass('press hover');
				this.el.addClass('normal');
				this.el.find('.list').addClass('hidden');
				this.isDropdown = false;
			}
		},
		//
		// 更改下拉状态
		//
		toggle: function(e) {
			if(this.isDisable) return;
			//$(e.target).blur();

			if(this.isDropdown) {
				this.el.removeClass('press hover');
				this.el.addClass('normal');
				this.el.find('.list').addClass('hidden');
			} else {
				this.el.removeClass('normal hover');
				this.el.addClass('press');
				this.el.find('.list').removeClass('hidden');
			}
			this.el.find("li").each(function(){
				$(this).removeClass("hover");
			});
			
			this.isDropdown = this.isDropdown ? false : true;
			e.stopPropagation();
		}
	};

	$.fn.foxCombobox = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxCombobox');
			if (!data) el.data('foxCombobox', (data = new FoxCombobox(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);


/* foxTextArea */
(function($) {
	//
	// FoxTextArea类
	//
	var FoxTextArea = function(el) {
		this.el = $(el);
		this.input = this.el.find('textarea');
		this.input.on('focus', $.proxy(this.focus, this));
		this.input.on('blur', $.proxy(this.blur, this));
	};
	FoxTextArea.prototype = {
		//
		// 清除所有事件和清除该空间对象
		//
		remove: function() {
			this.input.unbind();
			this.el.data('foxTextArea', '');
		},
		//
		// 获取输入项
		//
		getValue: function(){
			return this.el.find('textarea').text();
		},
		//
		//	设置输入项
		//
		setValue: function(data){
			//this.el.find('textarea').val(data);
			this.el.find('textarea').text(data);
			//this.el.find('textarea').attr('value', data);
		},
		blur: function() {
			this.el.removeClass('focus');
			this.el.addClass('blur');
		},
		focus: function() {
			this.el.removeClass('blur');
			this.el.addClass('focus');
		},
		onChange: function(fn) {
			this.input.on('propertychange', fn);
		}
	};
	$.fn.foxTextArea = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxTextArea');
			if (!data) el.data('foxTextArea', (data = new FoxTextArea(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);

/* foxTextAreaEx */
(function($) {
	//
	// FoxTextAreaEx类
	//
	var FoxTextAreaEx = function(el) {
		this.el = $(el);
		this.input = this.el.find('.textarea');
		this.input.bind('focus', $.proxy(this.focus, this));
		this.input.bind('blur', $.proxy(this.blur, this));
	};
	FoxTextAreaEx.prototype = {
		//
		// 清除所有事件和清除该空间对象
		//
		remove: function() {
			this.input.unbind();
			this.el.data('foxTextAreaEx', '');
		},
		//
		// 获取输入项
		//
		getValue: function(){
			return this.input.html();
		},
		//
		//	设置输入项
		//
		setValue: function(data){
			this.input.html(data);
		},
		blur: function() {
			this.el.removeClass('focus');
			this.el.addClass('blur');
		},
		focus: function() {
			this.el.removeClass('blur');
			this.el.addClass('focus');
		},
		bind: function(name, fn) {
			this.input.bind(name, fn);
		},
		unbind: function(name, fn) {
			this.input.unbind(name, fn);
		}
	};
	$.fn.foxTextAreaEx = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxTextAreaEx');
			if (!data) el.data('foxTextAreaEx', (data = new FoxTextAreaEx(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);

/* foxEditor */
(function($) {
	//
	// FoxEditor
	//
	var FoxEditor = function(el) {
		this.el = $(el);
		this.input = this.el.find('input');
		this.input.bind('focus', $.proxy(this.focus, this));
		this.input.bind('blur', $.proxy(this.blur, this));
		this.defaultValue = '';
	};
	FoxEditor.prototype = {
		//
		// 清除所有事件和清除该空间对象
		//
		remove: function() {
			this.input.unbind();
			this.el.data('foxEditor', '');
		},
		setDefaultValue: function(value) {
			this.defaultValue = value;
		},
		//
		// 获取输入项
		//
		getValue: function(){
			if(this.getState() === this.unChangeState) return '';
			else return this.input.val();
		},

		//
		// 控件的状态：为更改、更改过
		//
		unChangeState: 'unChange',	// 未更改过
		hasChangeState: 'change',	// 更改过
		setState: function(state){
			this.state = state;
		},
		getState: function(){
			return this.state;
		},

		on: function(name, fn) {
			this.input.on(name, fn);
		},
		//
		// 设置更改值时的运行函数 
		//
		onChange: function(fn){
			this.input.on('propertychange', fn);
		},
		//
		// 设置聚焦时的运行函数 
		//
		onFocus: function(fn){
			this.input.on('focus', fn);
		},
		//
		// 设置失去焦点时的运行函数 
		//
		onBlur: function(fn){
			this.input.on('blur', fn);
		},
		//
		//	设置输入项
		//
		setValue: function(data){
			this.input.val(data);
		},
		blur: function() {
			this.el.removeClass('dark focus');
			this.el.addClass('blur');
			if(this.getValue() === '') {
				this.setState(this.unChangeState);
				this.setValue(this.defaultValue);
				this.darken();
			}
		},
		setFocus: function() {
			this.input.focus();
		},
		focus: function(ev) {
			this.el.removeClass('dark blur');
			this.el.addClass('focus');
			if(this.getState() === this.unChangeState) {
				this.setValue('');
				var input = this.input[0];
				if (input && input.createTextRange) {
					var range = input.createTextRange();
					range.select();
				}
			}
			this.setState(this.hasChangeState);
		},
		darken: function() {
			//this.el.removeClass('focus');
			//this.el.addClass('blur');
			this.el.addClass('dark');
		},
		unDarken: function() {
			//this.el.removeClass('focus');
			//this.el.addClass('blur');
			this.el.removeClass('dark');
		}
	};
	$.fn.foxEditor = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxEditor');
			if (!data) el.data('foxEditor', (data = new FoxEditor(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);

/* foxMailAddrEditor */
(function($) {
	//
	// FoxMailAddrEditor
	//
	var FoxMailAddrEditor = function(el) {
		this.el = $(el);
		this.input = this.el.find('input');
		this.input.on('focus', $.proxy(this.focus, this));
		this.input.on('blur', $.proxy(this.blur, this));
	};
	FoxMailAddrEditor.prototype = {
		// 获取输入项
		//
		getValue: function(){
			return this.el.find('input').val();
		},

		//
		// 设置更改值时的运行函数 
		//
		onBlur: function(fn){
			this.input.on('blur', fn);
		},
		//
		// 设置更改值时的运行函数 
		//
		onFocus: function(fn){
			this.input.on('focus', fn);
		},
		//
		//	设置输入项
		//
		setValue: function(data){
			this.el.find('input').val(data);
		},
		blur: function() {
			this.el.removeClass('focus');
			this.el.addClass('blur');
		},
		setFocus: function() {
			this.input.focus();
		},
		focus: function() {
			this.el.removeClass('blur');
			this.el.addClass('focus');
		}
	};
	$.fn.foxMailAddrEditor = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxMailAddrEditor');
			if (!data) el.data('foxMailAddrEditor', (data = new FoxMailAddrEditor(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);


/* foxListSelector */
(function($) {
	//
	// FoxListSelector
	//
	var FoxListSelector = function(el) {
		this.el = $(el);
		this.el.bind('click', $.proxy(this.toggleDropdown, this));
		this.el.delegate('li', 'click', $.proxy(this.select, this));
		$(document).bind('click', $.proxy(this.pullup, this));
		this.isDisable = false;
		this.isDropdown = false;
		this.selectIndex = -1;
	};
	FoxListSelector.prototype = {
		remove: function() {
			this.el.unbind();
			$(document).unbind('click', $.proxy(this.pullup, this));
			this.pullup();
			this.el.data('foxListSelector', '');
		},
		//
		// 获取输入项
		//
		getValue: function(){
			var value = '';
			if(this.isDisable)
				return value;
			this.el.find('li').each(function(){
				var el = $(this);
				if (el.hasClass('select'))
					value = el.attr('val');
			});
			return value;
		},
		getIndex: function(){
			return this.selectIndex;
		},
		getListLength: function() {
			return this.el.find('li').length;
		},
		//
		// 更新下拉选项
		//
		updateList: function(items) {
			this.el.find('li').remove();
			var ul = this.el.find('ul');
			for (var i = 0; i < items.length; i++) {
				var li = '<li val=\''+items[i]+'\'><span>' + items[i] + '</span><div class="select-icon hide"></div><div class="clear"></div></li>';
				ul.append(li);
			};
		},
		disable: function() {
			this.isDisable = true;
		},
		enable: function() {
			this.isDisable = false;
		},
		select: function(e) {
			if(typeof e == 'object') {
				var el = $(e.target);
				var li = el.is('li') ? el : el.parents('li');
				
				var lis = this.el.find('li');
				lis.each(function(){
					$(this).removeClass('select');
					$(this).find('.select-icon').addClass('hide');
				});
				li.addClass('select');
				li.find('.select-icon').removeClass('hide');
				this.selectIndex = lis.index(li);		
			}
			if (typeof e == 'number') {
				var lis = this.el.find('li');
				if (e < 0 || e >= lis.length) return;
				for (var i = 0; i < lis.length; i++) {
					$(lis[i]).removeClass('select');
					$(lis[i]).find('.select-icon').addClass('hide');
					if (e === i) {
						$(lis[i]).addClass('select');
						$(lis[i]).find('.select-icon').removeClass('hide');
					}
				}
				this.selectIndex = e;
			}
		},
		//
		// 展示和隐藏菜单
		//
		/*detectValidArea: function(e) {
			var bx1 = this.el.offset().left;
			var by1 = this.el.offset().top;
			var bx3 = this.el.offset().left+this.el.width();
			var by3 = this.el.offset().top+this.el.height();
			
			var list = this.el.find('.listContainer');
			var lx1 = list.offset().left;
			var ly1 = list.offset().top;
			var lx3 = list.offset().left+list.width();
			var ly3 = list.offset().top+list.height();

			var left = Math.min(bx1,bx3, lx1, lx3);
			var right = Math.max(bx1,bx3, lx1, lx3);
			var top = Math.min(by1,by3, ly1, ly3);
			var bottom = Math.max(by1,by3, ly1, ly3);

			var mouseX = e.pageX;
			var mouseY = e.pageY;
			if(mouseX < left || mouseX > right) this.unHover();
			if(mouseY < top || mouseY > bottom) this.unHover();
		},*/
		onDropdown: function(fn) {
			this.fnDropdown = fn;
		},
		dropdown: function(e) {
			if(this.isDisable) return;
			if(this.fnDropdown) this.fnDropdown();
			this.el.addClass('hover');
			this.el.removeClass('blur');
			this.el.addClass('focus');
			e.stopPropagation();
			this.isDropdown = true;
		},
		pullup: function(e) {
			if(this.isDisable) return;
			this.el.removeClass('hover');
			this.el.removeClass('focus');
			this.el.addClass('blur');
			this.isDropdown = false;
		},
		toggleDropdown: function(e) {
			if (this.isDropdown) this.pullup(e);
			else this.dropdown(e);
		},
	};
	$.fn.foxListSelector = function(options) {
		var ret = undefined;
		this.each(function() {
			var el = $(this);
			var data = el.data('foxListSelector');
			if (!data) el.data('foxListSelector', (data = new FoxListSelector(this, options)));
			ret = data;
		});
		return ret;
	}
})(window.jQuery);