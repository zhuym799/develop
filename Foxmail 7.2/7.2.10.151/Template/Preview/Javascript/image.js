$(document).ready(function() {
	RegisterEvent();
	InitPage();
});

function InitPage() {
	SetImageSize();
}

function RegisterEvent() {
	$(window).resize(function() {
		SetImageSize();
	});

	$('.imgBox img').bind('mouseenter', function() {
		SetImageCursor();		
	});

	$('.imgBox img').each(function(){
		this.onload = function(){
			SetImageSize();
		}
	});

	$('.imgBox img').bind('click', function() {
		var img = $(this);
		if (img.hasClass('zoomin')) {
			SetImageRealSize();
			SetImageCursor();
			UpdateScrollbar();	
		} else if (img.hasClass('zoomout')) {
			img.css('width', 'auto');
			img.css('height', 'auto');
			img.css('max-width', '100%');
			img.css('max-height', '100%');	
			SetImageCursor();
			UpdateScrollbar();	
		}
	});
}

function UpdateScrollbar() {
	window.external.UpdateScrollbar({});
}

function SetImageSize() {
	var img = $('.imgBox img');
	var clientHeight = $(window).height();
	var imgHeight = img.height();
	if (imgHeight == 0) return;

	if (imgHeight < clientHeight) {
		var topOffset = (clientHeight - imgHeight) / 2;
		img.css('top', topOffset + 'px');
	} else {
		img.css('top', '0px');
		img.css('height', clientHeight + 'px');
		img.css('height', 'auto');
	}	
}

function SetImageCursor() {
	function DoSetImageCursor(imgRealWidth, imgRealHeight) {
		var img = $('.imgBox img');
		var client = $(window);
		var imgCurWidth = img.width();
		var imgCurHeight = img.height();
		var clientWidth = client.width();
		var clientHeight = client.height();

		if ((imgCurWidth > clientWidth) || (imgCurHeight > clientHeight)) {
			img.addClass('zoomout');
			img.removeClass('zoomin');	
		} else if ((imgCurWidth < imgRealWidth) || (imgCurHeight < imgRealHeight)){
			img.removeClass('zoomout');
			img.addClass('zoomin');	
		} else {
			img.removeClass('zoomout');
			img.removeClass('zoomin');		
		}
	}
	var url = $('.imgBox img').attr('src');
	GetImageOriginSize(url, DoSetImageCursor);
}

function SetImageRealSize() {
	function DoSetImageRealSize(imgRealWidth, imgRealHeight) {
		var img = $('.imgBox img');
		img.css('width', imgRealWidth + 'px');
		img.css('height', imgRealHeight + 'px');
		img.css('max-width', 'none');
		img.css('max-height', 'none');
	}
	var url = $('.imgBox img').attr('src');
	GetImageOriginSize(url, DoSetImageRealSize);
}

function GetImageOriginSize(url, callback) {
	var img = new Image();
	img.src = url;
	if (img.complete) {
		callback(img.width, img.height);
	} else {
		img.onload = function() {
			callback(img.width, img.height);
			img.onload = null;
		};
	};
}