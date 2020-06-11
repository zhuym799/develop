FoxUI.add('TextArea', {
	// 该类的构造函数
	_construct: function(config) {
		this.id = config.id;
		this.defaultVisible = config.defaultVisible;
		this.content = config.content;
		this.record = config.record;
		this.doSave = config.doSave;
	},

	_source: "<div class='fox_text_area'>\
			<div class='input_area'>\
				<div class='input_area_top_blur'>\
					<div class='input_area_top_left_blur'></div>\
					<div class='input_area_top_right_blur'></div>\
					<div class='clear'></div>\
				</div>\
				<div class='input_area_left_blur'>\
					<div class='input_area_right_blur'>\
						<textarea></textarea>\
					</div>\
				</div>\
				<div class='input_area_bottom_blur'>\
					<div class='input_area_bottom_left_blur'></div>\
					<div class='input_area_bottom_right_blur'></div>\
					<div class='clear'></div>\
				</div>\
			</div>\
			<div class='toolbar'>\
				<div class='cancel_button cancel_button_normal'>取消</div>\
				<div class='save_button save_button_disable'>保存</div>\
				<div class='clear'></div>\
			</div>\
		</div>",

	_initBehavior: function() {
		var that = this;

		that.root.find('.cancel_button').on('click', function() {
			that.hide();
		});

		that.root.find('.save_button').on('click', function() {
			that.doSave();
		});

		that.root.find('textarea').on('blur',function(){
			that._blur();
		});

		that.root.find('textarea').on('focus',function(){
			that._focus();
		});

		that.root.find('textarea').on('propertychange', function(){
			var btn = that.root.find('.save_button');
			if($(this).val() === '') {
				btn.removeClass('save_button_normal');
				btn.addClass('save_button_disable');
			} else {
				btn.removeClass('save_button_disable');
				btn.addClass('save_button_normal');
			}
		});
	},

	_focus: function() {
		var el = this.root.find('.input_area_top_blur');
		el.removeClass('input_area_top_blur');
		el.addClass('input_area_top_focus');

		el = this.root.find('.input_area_top_left_blur');
		el.removeClass('input_area_top_left_blur');
		el.addClass('input_area_top_left_focus');

		el = this.root.find('.input_area_top_right_blur');
		el.removeClass('input_area_top_right_blur');
		el.addClass('input_area_top_right_focus');

		el = this.root.find('.input_area_left_blur');
		el.removeClass('input_area_left_blur');
		el.addClass('input_area_left_focus');

		el = this.root.find('.input_area_right_blur');
		el.removeClass('input_area_right_blur');
		el.addClass('input_area_right_focus');

		el = this.root.find('.input_area_bottom_blur');
		el.removeClass('input_area_bottom_blur');
		el.addClass('input_area_bottom_focus');

		el = this.root.find('.input_area_bottom_left_blur');
		el.removeClass('input_area_bottom_left_blur');
		el.addClass('input_area_bottom_left_focus');

		el = this.root.find('.input_area_bottom_right_blur');
		el.removeClass('input_area_bottom_right_blur');
		el.addClass('input_area_bottom_right_focus');
	},

	_blur: function() {
		var el = this.root.find('.input_area_top_focus');
		el.removeClass('input_area_top_focus');
		el.addClass('input_area_top_blur');

		el = this.root.find('.input_area_top_left_focus');
		el.removeClass('input_area_top_left_focus');
		el.addClass('input_area_top_left_blur');

		el = this.root.find('.input_area_top_right_focus');
		el.removeClass('input_area_top_right_focus');
		el.addClass('input_area_top_right_blur');

		el = this.root.find('.input_area_left_focus');
		el.removeClass('input_area_left_focus');
		el.addClass('input_area_left_blur');

		el = this.root.find('.input_area_right_focus');
		el.removeClass('input_area_right_focus');
		el.addClass('input_area_right_blur');

		el = this.root.find('.input_area_bottom_focus');
		el.removeClass('input_area_bottom_focus');
		el.addClass('input_area_bottom_blur');

		el = this.root.find('.input_area_bottom_left_focus');
		el.removeClass('input_area_bottom_left_focus');
		el.addClass('input_area_bottom_left_blur');

		el = this.root.find('.input_area_bottom_right_focus');
		el.removeClass('input_area_bottom_right_focus');
		el.addClass('input_area_bottom_right_blur');
	},

	_init: function() {
		this.root = $(this._source);
		this.root.attr('id', this.id);
		if(this.content) {
			this.root.find('textarea').val(this.content);
			var btn = this.root.find('.save_button');
			btn.removeClass('save_button_disable');
			btn.addClass('save_button_normal');
		}
		if(!this.defaultVisible)
			this.root.css('display', 'none');
		this._initBehavior();
	},

	show: function(callback) {
		var that = this;
		that.root.animate({
			height: 'show'
		}, 300, 'swing', callback);
	},

	hide: function(callback) {
		var that = this;
		that.root.animate({
			height: 'hide'
		}, 300, 'swing', callback);
	},

	getContent: function() {
		return this.root.find('textarea').val();
	},

	render: function() {
		this._init();
		$('#'+this.id).replaceWith(this.root);
	}
});