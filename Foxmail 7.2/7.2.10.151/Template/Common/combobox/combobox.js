FoxUI.add('foxCombobox', {
	// 该类的构造函数
	_construct : function(config) {
		this.width = config.width;
		this.data = config.data;
		this.dropDownCall = config.dropDownCall;
		this.updateValueCall = config.updateValueCall;
	},

	_templates : {
		container: 
			"<div class='foxCombobox'>\
				<div class='input_top input_top_lostfocus'>\
					<div class='input_top_left input_top_left_lostfocus'></div>\
			 		<div class='input_top_right input_top_right_lostfocus'></div>\
			 		<div class='clear'></div>\
				</div>\
			 	<div class='input_middle_left input_middle_left_lostfocus'>\
			 		<div class='input_middle_right input_middle_right_lostfocus'>\
			 			<div class='select_button'></div>\
			 			<div class='inputContainer'>\
			 				<input id='{{>id%}}' type='text' readonly='readonly'/>\
			 			</div>\
			 			<div class='clear'></div>\
					</div>\
			 	</div>\
			 	<div class='input_bottom input_bottom_lostfocus'>\
			 		<div class='input_bottom_left input_bottom_left_lostfocus'></div>\
			 		<div class='input_bottom_right input_bottom_right_lostfocus'></div>\
			 		<div class='clear'></div>\
			 	</div>\
			 	<div class='listContainer'>\
			 		<div class='list hidden'>\
			 			<div class='list_tops'>\
			 				<div class='list_top_left_focuss'></div>\
			 				<div class='list_top_right_focuss'></div>\
			 				<div class='clear'></div>\
			 			</div>\
			 			<div class='list_middle_left_focus'>\
			 				<div class='list_middle_right_focus'>\
			 				</div>\
			 			</div>\
			 			<div class='list_bottom_focus'>\
			 				<div class='list_bottom_left_focus'></div>\
			 				<div class='list_bottom_right_focus'></div>\
			 				<div class='clear'></div>\
			 			</div>\
			 		</div>\
			 	</div>\
			 </div>",

		list: 
			"<ul>\
				{{for list}}\
					<li val='{{:#data}}'>{{:#data}}</li>\
				{{/for}}\
			</ul>"
	},

	// 取消下拉菜单
	_cancelDropdown : function() {
		var that = this;

		that.root.find(".list").addClass("hidden");
		var top = that.root.find(".input_top");
		top.removeClass("input_top_focus");
		top.addClass("input_top_lostfocus");

		var topLeft = that.root.find(".input_top_left");
		topLeft.removeClass("input_top_left_focus");
		topLeft.addClass("input_top_left_lostfocus");

		var topRight = that.root.find(".input_top_right");
		topRight.removeClass("input_top_right_focus");
		topRight.addClass("input_top_right_lostfocus");

		var middleLeft = that.root.find(".input_middle_left");
		middleLeft.removeClass("input_middle_left_focus");
		middleLeft.addClass("input_middle_left_lostfocus");

		var middleRight = that.root.find(".input_middle_right");
		middleRight.removeClass("input_middle_right_focus");
		middleRight.addClass("input_middle_right_lostfocus");

		var bottom = that.root.find(".input_bottom");
		bottom.addClass("input_bottom_lostfocus");

		var bottomLeft = that.root.find(".input_bottom_left");
		bottomLeft.addClass("input_bottom_left_lostfocus");

		var bottomRight = that.root.find(".input_bottom_Right");
		bottomRight.addClass("input_bottom_right_lostfocus");
	},

	// 弹出下拉菜单
	_dropdown : function() {
		var that = this;

		that.root.find(".list").removeClass("hidden");

		var top = that.root.find(".input_top");
		top.removeClass("input_top_lostfocus");
		top.addClass("input_top_focus");

		var topLeft = that.root.find(".input_top_left");
		topLeft.removeClass("input_top_left_lostfocus");
		topLeft.addClass("input_top_left_focus");

		var topRight = that.root.find(".input_top_right");
		topRight.removeClass("input_top_right_lostfocus");
		topRight.addClass("input_top_right_focus");

		var middleLeft = that.root.find(".input_middle_left");
		middleLeft.removeClass("input_middle_left_lostfocus");
		middleLeft.addClass("input_middle_left_focus");

		var middleRight = that.root.find(".input_middle_right");
		middleRight.removeClass("input_middle_right_lostfocus");
		middleRight.addClass("input_middle_right_focus");

		var bottom = that.root.find(".input_bottom");
		bottom.removeClass("input_bottom_lostfocus");

		var bottomLeft = that.root.find(".input_bottom_left");
		bottomLeft.removeClass("input_bottom_left_lostfocus");

		var bottomRight = that.root.find(".input_bottom_Right");
		bottomRight.removeClass("input_bottom_right_lostfocus");

		if(that.dropDownCall)
			that.dropDownCall();
	},

	// 初始化响应动作
	_initBehavior : function() {
		var that = this;

		$("html").on("click", function() {
			that._cancelDropdown();
			that.isDropdown = false;
		});

		that.root.find(".select_button").on("click", function(ev) {
			if (that.isDropdown) {
				that._cancelDropdown();
				that.isDropdown = false;
			} else {
				that._dropdown();
				that.isDropdown = true;
			}

			ev.stopPropagation();
		});

		that.root.delegate("li", "mouseover", function(){
			var el = $(this);
			that.root.find("li").each(function(){
				var el = $(this);
				el.removeClass("hover");
			});
			el.addClass("hover");
		});

		that.root.delegate("li", "click", function() {
			var el = $(this);
			that._updateValue(el.attr('val'));
			el.parents(".list").addClass("hidden");
		});
	},
	
	_updateValue: function(value) {
		this.root.find("input").attr("value", value);
		if(this.updateValueCall)
			this.updateValueCall();
	},

	_init : function() {
		// 非下拉状态
		this.isDropdown = false;
		var tmpl = $.templates(this._templates.container);
		var html = tmpl.render(this.data);
		this.root = $(html);

		tmpl = $.templates(this._templates.list);
		html = tmpl.render(this.data);

		this.root.find('.list_middle_right_focus').append(html);
		this.root.css('width', this.width);
		this.root.find('input').css('width', this.width-43);
		this._initBehavior();
	},

	// 更新下拉菜单
	updateList: function(data) {
		if(!data)
			return;
		var tmpl = $.templates(this._templates.list);
		var html = tmpl.render(data);
		this.root.find('ul').replaceWith(html);
	},

	updateValue: function(value) {
		this._updateValue(value);
	},
	getValue: function() {
		return this.root.find("input").attr("value");
	},
	render : function(id) {
		this._init();
		this.root.appendTo(id);
	}
});