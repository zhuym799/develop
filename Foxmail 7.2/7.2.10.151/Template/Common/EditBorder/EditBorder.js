
function setEditFocus(obj){
	var top = $('.edit_input_top', obj);
	var topLeft = $('.edit_input_top_left', obj);
	var topRight = $('.edit_input_top_right', obj);
	var left = $('.edit_input_left', obj);
	var right = $('.edit_input_right', obj);
	var bottom = $('.edit_input_bottom', obj);
	var bottomLeft = $('.edit_input_bottom_left', obj);
	var bottomRight = $('.edit_input_bottom_right', obj);
	top.removeClass('edit_input_top_lostfocus');
	top.addClass('edit_input_top_focus');
	topLeft.removeClass('edit_input_top_left_lostfocus');
	topLeft.addClass('edit_input_top_left_focus');
	topRight.removeClass('edit_input_top_right_lostfocus');
	topRight.addClass('edit_input_top_right_focus');
	left.removeClass('edit_input_left_lostfocus');
	left.addClass('edit_input_left_focus');
	right.removeClass('edit_input_right_lostfocus');
	right.addClass('edit_input_right_focus');
	bottom.removeClass('edit_input_bottom_lostfocus');
	bottom.addClass('edit_input_bottom_focus');
	bottomLeft.removeClass('edit_input_bottom_left_lostfocus');
	bottomLeft.addClass('edit_input_bottom_left_focus');
	bottomRight.removeClass('edit_input_bottom_right_lostfocus');
	bottomRight.addClass('edit_input_bottom_right_focus');
	obj.removeClass('edit_input_lostfocus');
	obj.addClass('edit_input_focus');
}
function setEditUnfocus(obj){
	var top = $('.edit_input_top', obj);
	var topLeft = $('.edit_input_top_left', obj);
	var topRight = $('.edit_input_top_right', obj);
	var left = $('.edit_input_left', obj);
	var right = $('.edit_input_right', obj);
	var bottom = $('.edit_input_bottom', obj);
	var bottomLeft = $('.edit_input_bottom_left', obj);
	var bottomRight = $('.edit_input_bottom_right', obj);
	top.addClass('edit_input_top_lostfocus');
	top.removeClass('edit_input_top_focus');
	topLeft.addClass('edit_input_top_left_lostfocus');
	topLeft.removeClass('edit_input_top_left_focus');
	topRight.addClass('edit_input_top_right_lostfocus');
	topRight.removeClass('edit_input_top_right_focus');
	left.addClass('edit_input_left_lostfocus');
	left.removeClass('edit_input_left_focus');
	right.addClass('edit_input_right_lostfocus');
	right.removeClass('edit_input_right_focus');
	bottom.addClass('edit_input_bottom_lostfocus');
	bottom.removeClass('edit_input_bottom_focus');
	bottomLeft.addClass('edit_input_bottom_left_lostfocus');
	bottomLeft.removeClass('edit_input_bottom_left_focus');
	bottomRight.addClass('edit_input_bottom_right_lostfocus');
	bottomRight.removeClass('edit_input_bottom_right_focus');
	obj.removeClass('edit_input_focus');
	obj.addClass('edit_input_lostfocus');
}