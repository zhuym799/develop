// 横向滚动条 Html
var HorizontalBarHtml = "<div class='horizontal_scroller'><div class='scroller_sham_content'></div></div>";

function GetTargetRealWidth(target) {
	var targetEl = $(target);

	var outWidth = targetEl.outerWidth(true) - targetEl.innerWidth();
	var width = targetEl[0].scrollWidth + outWidth;
	
	return width;
}

window.InitHorizontalBar = function(target) {
	try {
		var targetEl = $(target);
		if (targetEl.length == 0) return;
		
		targetEl.css('overflow-x', 'hidden');
		var scroller = $('.horizontal_scroller');
		scroller.remove();
		
		scroller = $(HorizontalBarHtml);
		targetEl.after(scroller);
		
		scroller.find('.scroller_sham_content').css('width', GetTargetRealWidth(target) );

		targetEl.scrollLeft(0);
		scroller.unbind('scroll').on('scroll', function(ev){
			targetEl.scrollLeft(scroller.scrollLeft());
		});
		
		AdjustHorizontalBar(target);
	} catch (e) {
		console.log(e.message);
	}
}

function AdjustHorizontalBar(target) {
	try {
		var el = $(target);
		if (el.length == 0) return;

		var box = el[0].getBoundingClientRect();
		var elHeight = el.height();
		var ScreenHeight = $(window).height();
		var elT2T = box.top;
		var elT2B = elT2T - ScreenHeight;
		var elB2T = elT2T + elHeight;
		var elB2B = elB2T - ScreenHeight;

		var scroller = el.parent().find('.horizontal_scroller');
		scroller.find('.scroller_sham_content').css('width', GetTargetRealWidth(target) );
		if ((elT2B > 0) || (elB2T < 0) || ((elB2T > 0) && (elB2B < -20))) {
			scroller.removeClass('fixed_bottom');	
		} else {
			scroller.addClass('fixed_bottom');
		}
	} catch (e) {
		console.log(e.message);
	}
}