/* 
	FoxWBScrollbar 
	Usage:
	var scrollbar = createFoxWBScrollbar({
		id: 'xxx',
		Parent: 'horzScrollbar',
		HS: true,
		HSTarget: $('#horzTarget'),
		VS: false
	});
	scrollbar.update();
*/
var g_FoxWBScrollbarHandler = [];
function SetFoxWBHorzScrollerHover(obj){
	obj.removeClass('foxwb_scroller_normal');
	obj.addClass('foxwb_scroller_hover');
	obj.removeClass('foxwb_scroller_down');
}
function SetFoxWBHorzScrollerDown(obj){
	obj.removeClass('foxwb_scroller_normal');
	obj.removeClass('foxwb_scroller_hover');
	obj.addClass('foxwb_scroller_down');
}
function SetFoxWBHorzScrollerNormal(obj){
	obj.addClass('foxwb_scroller_normal');
	obj.removeClass('foxwb_scroller_hover');
	obj.removeClass('foxwb_scroller_down');
}
function SetFoxWBVertScrollerHover(obj){
	obj.removeClass('foxwb_scroller_normal');
	obj.addClass('foxwb_scroller_hover');
	obj.removeClass('foxwb_scroller_down');
}
function SetFoxWBVertScrollerDown(obj){
	obj.removeClass('foxwb_scroller_normal');
	obj.removeClass('foxwb_scroller_hover');
	obj.addClass('foxwb_scroller_down');
}
function SetFoxWBVertScrollerNormal(obj){
	obj.addClass('foxwb_scroller_normal');
	obj.removeClass('foxwb_scroller_hover');
	obj.removeClass('foxwb_scroller_down');
}
//setup scrollbar 
function setupFoxWBScrollbar(options){
	//
}
//init scrollbar event
function initFoxWBScrollbar(){
	$(document).delegate('.foxwb_scroller', 'selectstart', function(e){
		e.stopPropagation();
		return false;
	});
	$(document).delegate('.foxwb_scrollbar', 'selectstart', function(e){
		e.stopPropagation();
		return false;
	});

	var bDragStart = false;
	var curKey = null;
	//模拟hover
	$(document).delegate('.foxwb_horz_scroller', 'mouseenter', function(e){
		var obj = $(this);
		var scrollbar = obj.parent();
		var key = getFoxWBScrollbarKey(scrollbar.attr('id'));
		var handler = g_FoxWBScrollbarHandler[key];
		if (handler){
			if (!handler.scrollbar.bScrolling){
				SetFoxWBHorzScrollerHover(obj);
			}
		}
	});
	$(document).delegate('.foxwb_horz_scroller', 'mouseleave', function(e){
		var obj = $(this);
		var scrollbar = obj.parent();
		var key = getFoxWBScrollbarKey(scrollbar.attr('id'));
		var handler = g_FoxWBScrollbarHandler[key];
		if (handler){
			if (!handler.scrollbar.bScrolling){
				SetFoxWBHorzScrollerNormal(obj);
			}
		}
	});
	$(document).delegate('.foxwb_vert_scroller', 'mouseenter', function(e){
		var obj = $(this);
		var scrollbar = obj.parent();
		var key = getFoxWBScrollbarKey(scrollbar.attr('id'));
		var handler = g_FoxWBScrollbarHandler[key];
		if (handler){
			if (!handler.scrollbar.bScrolling){
				SetFoxWBVertScrollerHover(obj);
			}
		}
	});
	$(document).delegate('.foxwb_vert_scroller', 'mouseleave', function(e){
		var obj = $(this);
		var scrollbar = obj.parent();
		var key = getFoxWBScrollbarKey(scrollbar.attr('id'));
		var handler = g_FoxWBScrollbarHandler[key];
		if (handler){
			if (!handler.scrollbar.bScrolling){
				SetFoxWBVertScrollerNormal(obj);
			}
		}
	});
	//
	$(document).delegate('.foxwb_scroller', 'mousedown', function(e){
		if (e.which == 1){
			document.selection.empty();
			$(document).focus();//设置焦点
			setFoxWBCapture();
			bDragStart = true;
			var obj = $(this);
			var scrollbar = obj.parent();
			var key = getFoxWBScrollbarKey(scrollbar.attr('id'));
			curKey = key;
			var handler = g_FoxWBScrollbarHandler[key];
			if (handler){
				handler.scrollbar.onMouseDown(e);
			}
			e.stopPropagation();
		}
	});
	$(document).delegate('.foxwb_scrollbar', 'mousedown', function(e){
		if (e.which == 1){
			var scrollbar = $(this);
			var key = getFoxWBScrollbarKey(scrollbar.attr('id'));
			curKey = key;
			var handler = g_FoxWBScrollbarHandler[key];
			if (handler){
				handler.scrollbar.onClickDown(e);
			}
			e.stopPropagation();
		}
	});
	$(document).delegate('html', 'mouseup', function(e){
		if (bDragStart){
			if (e.which == 1){
				if (curKey){
					var handler = g_FoxWBScrollbarHandler[curKey];
					if (handler){
						handler.scrollbar.onMouseUp(e);
						curKey = null;
					}
					bDragStart = false;
					releaseFoxWBCapture();
				}
			}
		}
	});
	$(document).delegate('html', 'mousemove', function(e){
		if (bDragStart){
			if (curKey){
				var handler = g_FoxWBScrollbarHandler[curKey];
				if (handler){
					bDragStart = handler.scrollbar.onMouseMove(e);
				}
				if (!bDragStart){
					//fix
					bDragStart = false;
					releaseFoxWBCapture();
				}
			}
		}
	});
}

function releaseAllFoxWBScrollbar(){
	try{
		for (var key in g_FoxWBScrollbarHandler){
			var obj = g_FoxWBScrollbarHandler[key];
			if (obj.scrollbar){
				obj.scrollbar.Release();
			}
			delete g_FoxWBScrollbarHandler[key];
		}
		g_FoxWBScrollbarHandler = null;
		g_FoxWBScrollbarHandler = [];
	}catch(e){
		g_FoxWBScrollbarHandler = null;
		g_FoxWBScrollbarHandler = [];
	}
}
function getFoxWBScrollbar(id){
	var key = getFoxWBScrollbarKey(id);
	var obj = g_FoxWBScrollbarHandler[key];
	if (obj){
		return obj.scrollbar;
	}else{
		return null;
	}
}
function FoxWBScrollEvent(scrollbar){
	if (scrollbar.bScrolling == false){
		if (scrollbar.bHasHorzScrollbar){
			var left = getScrollLeft(scrollbar.HorzScrollbarTarget, scrollbar.bHorzIFrame);
			var documentWidth = getDocumentWidth(scrollbar.HorzScrollbarTarget, scrollbar.bHorzIFrame);
			left = getOffsetFromScroll(left, documentWidth, scrollbar.nHorzTotalWidth, scrollbar.nHorzScrollerWidth, scrollbar.nHorzFrameWidth);
			if (left < 0) left = 0;
			if (left >= (scrollbar.nHorzFrameWidth - scrollbar.nHorzScrollerWidth)) left = scrollbar.nHorzFrameWidth - scrollbar.nHorzScrollerWidth;
			scrollbar.HorzScroller.css('left', left+'px');
			if (scrollbar.HorzScrollDelegate){
				scrollbar.HorzScrollDelegate();
			}
		}
		if (scrollbar.bHasVertScrollbar){
			var top = getScrollTop(scrollbar.VertScrollbarTarget, scrollbar.bVertIFrame);
			top = Math.round(top * (scrollbar.nVertFrameHeight / scrollbar.nVertTotalHeight));
			if (top < 0) top = 0;
			if (top >= (scrollbar.nVertFrameHeight - scrollbar.nVertScrollerHeight)) top = scrollbar.nVertFrameHeight - scrollbar.nVertScrollerHeight;
			scrollbar.VertScroller.css('top', top+'px');
			if (scrollbar.VertScrollDelegate){
				scrollbar.VertScrollDelegate();
			}
		}
	}
}
function createFoxWBScrollbar(options){
	var scrollbar = new FoxWBScrollbar(options);
	var key = getFoxWBScrollbarKey(options.id);
	g_FoxWBScrollbarHandler[key] = {
		id: options.id,
		scrollbar: scrollbar
	};
	//
	return scrollbar;
}
function FoxWBScrollbar(options){
	this.nPreOffsetX = 0;
	this.nPreOffsetY = 0;
	this.Parent = null;
	this.bScrolling = false;
	//Horz
	this.bHorzIFrame = false;
	this.nHorzFrameWidth = 0;
	this.nHorzScrollerWidth = 0;
	this.nHorzTotalWidth = 0;
	this.bHasHorzScrollbar = false;;
	this.HorzScrollbar = null;
	this.HorzScroller = null;
	this.HorzScrollbarTarget = null;
	this.bHorzFixed = false;
	this.nFixHorzX = 0;
	this.nFixHorzY = 0;
	this.nFixHorzWidth = 0;
	this.nFixHorzHeight = 0;
	this.HorzScrollDelegate = null;
	//Vert
	this.bVertIFrame = false;
	this.nVertFrameHeight = 0; 
	this.nVertScrollerHeight = 0;
	this.nVertTotalHeight = 0;
	this.bHasVertScrollbar = false;
	this.VertScrollbar = null;
	this.VertScroller = null;
	this.VertScrollbarTarget = null;
	this.VertScrollDelegate = null;
	this.nFixVertHeight = 0;

	this.Parent = $('#'+options.Parent);
	this.sID = options.id;
	if (options.HS == true){
		this.bHasHorzScrollbar = true;
		this.HorzScrollbar = createHorzScrollbar(options.id, options.Parent);
		this.HorzScroller = $('#foxwb_horz_scroller_'+options.id);
		this.HorzScrollbarTarget = options.HSTarget;
		var domTagName = this.HorzScrollbarTarget[0].tagName;
		domTagName = domTagName.toUpperCase();
		this.bHorzIFrame = (domTagName === 'IFRAME');
		this.HorzScrollHandler(options.HorzScrollHandler);
		if (options.horzOffset){
			this.setHorzOffset(options.horzOffset.x, 
				options.horzOffset.y,
				options.horzOffset.width,
				options.horzOffset.height);
		}
		SetFoxWBHorzScrollerNormal(this.HorzScroller);
	}
	if (options.VS == true){
		this.bHasVertScrollbar = true;
		this.VertScrollbar = createVertScrollbar(options.id, options.Parent);
		this.VertScroller = $('#foxwb_vert_scroller_'+options.id);
		this.VertScrollbarTarget = options.VSTarget;
		var domTagName = this.VertScrollbarTarget[0].tagName;
		domTagName = domTagName.toUpperCase();
		this.bVertIFrame = (domTagName === 'IFRAME');
		this.VertScrollHandler(options.VertScrollHandler);
		SetFoxWBVertScrollerNormal(this.VertScroller);
	}
}
FoxWBScrollbar.prototype.getID = function(){
	return this.sID;
}
FoxWBScrollbar.prototype.Release = function(){
	if (this.bHasHorzScrollbar){
		if (this.bHorzIFrame){
			$(this.HorzScrollbarTarget[0].contentWindow).unbind('scroll');
			$(this.HorzScrollbarTarget[0].contentWindow.document.body).unbind('scroll');
		}else{
			this.HorzScrollbarTarget.unbind('scroll');
		}
	}
	if (this.bHasVertScrollbar){
		if (this.bVertIFrame){
			$(this.VertScrollbarTarget[0].contentWindow).unbind('scroll');
			$(this.HorzScrollbarTarget[0].contentWindow.document.body).unbind('scroll');
		}else{
			this.VertScrollbarTarget.unbind('scroll');
		}
	}
}
FoxWBScrollbar.prototype.HorzScrollHandler = function(delegate){
	this.HorzScrollDelegate = delegate;
	var scrollbar = this;
	var timer = 0;
	var scrollEvent = function(){
		// if (timer){
		// 	clearTimeout(timer);
		// 	timer = 0;
		// }
		// timer = setTimeout(function(){
			FoxWBScrollEvent(scrollbar);
		// }, 10);
	}
	if (this.bHorzIFrame){
		try{
			$(this.HorzScrollbarTarget[0].contentWindow).unbind('scroll');
			$(this.HorzScrollbarTarget[0].contentWindow).bind('scroll', scrollEvent);
			$(this.HorzScrollbarTarget[0].contentWindow.document.body).unbind('scroll');
			$(this.HorzScrollbarTarget[0].contentWindow.document.body).bind('scroll', scrollEvent);
		}catch(e){
		}
	}else{
		this.HorzScrollbarTarget.unbind('scroll');
		this.HorzScrollbarTarget.bind('scroll', scrollEvent);
	}
}
FoxWBScrollbar.prototype.VertScrollHandler = function(delegate){
	this.VertScrollDelegate = delegate;
	var scrollbar = this;
	var timer = 0;
	var scrollEvent = function(){
		// if (timer){
		// 	clearTimeout(timer);
		// 	timer = 0;
		// }
		// timer = setTimeout(function(){
			FoxWBScrollEvent(scrollbar);
		// }, 10);
	}
	if (this.bVertIFrame){
		$(this.VertScrollbarTarget[0].contentWindow).unbind('scroll');
		$(this.VertScrollbarTarget[0].contentWindow).bind('scroll', scrollEvent);
		$(this.VertScrollbarTarget[0].contentWindow.document.body).unbind('scroll');
		$(this.VertScrollbarTarget[0].contentWindow.document.body).bind('scroll', scrollEvent);
	}else{
		this.VertScrollbarTarget.unbind('scroll');
		this.VertScrollbarTarget.bind('scroll', scrollEvent);
	}
}
FoxWBScrollbar.prototype.horzVisible = function(){
	if (this.bHasHorzScrollbar){
		return !this.HorzScrollbar.hasClass('foxwb_scrollbar_hide');
	}
	return false;
}
FoxWBScrollbar.prototype.vertVisible = function(){
	if (this.bHasVertScrollbar){
		return !this.VertScrollbar.hasClass('foxwb_scrollbar_hide');
	}
	return false;
}
FoxWBScrollbar.prototype.showHorzScrollbar = function(bShow){
	if (this.bScrolling) return;
	if (this.bHasHorzScrollbar){
		if (bShow){
			this.HorzScrollbar.removeClass('foxwb_scrollbar_hide');
		}else{
			this.HorzScrollbar.addClass('foxwb_scrollbar_hide');
		}
	}
}
FoxWBScrollbar.prototype.showVertScrollbar = function(bShow){
	if (this.bScrolling) return;
	if (this.bHasVertScrollbar){
		if (bShow){
			this.VertScrollbar.removeClass('foxwb_scrollbar_hide');
		}else{
			this.VertScrollbar.addClass('foxwb_scrollbar_hide');
		}
	}
}
FoxWBScrollbar.prototype.vertScrollerTotalHeight = function(){
	return this.nVertTotalHeight;
}
FoxWBScrollbar.prototype.vertScrollerHeight = function(){
	return this.nVertScrollerHeight;
}
FoxWBScrollbar.prototype.vertScrollTop = function(){
	return getScrollTop(this.VertScrollbarTarget, this.bVertIFrame);
}
FoxWBScrollbar.prototype.horzFixed = function(){
	return this.bHorzFixed;
}
FoxWBScrollbar.prototype.fixedHorzScrollbar = function(bFixed){
	if (this.bHasHorzScrollbar){
		this.bHorzFixed = bFixed;
		if (bFixed){
			if (!this.HorzScrollbar.hasClass('foxwb_horz_scrollbar_fixed')){
				this.HorzScrollbar.addClass('foxwb_horz_scrollbar_fixed');
			}
		}
		else{
			if (this.HorzScrollbar.hasClass('foxwb_horz_scrollbar_fixed')){
				this.HorzScrollbar.removeClass('foxwb_horz_scrollbar_fixed');
			}
		}
			/*
			// fixed IE6 expression
			var browser = navigator.appName; 
			var b_version = navigator.appVersion; 
			var version = b_version.split(";"); 
			var trim_Version = version[1].replace(/[ ]/g, "");
			if (browser === "Microsoft Internet Explorer" && trim_Version === "MSIE6.0") {
				var dom = m_HorzScrollbar[0];
				dom.style.removeExpression('top');  
			}*/
	}
};
//scrolling
FoxWBScrollbar.prototype.onClickDown = function(e){
	if (this.bHasVertScrollbar){
		var offsetY = e.offsetY - (this.nVertScrollerHeight / 2);
		this.scrollVertUI(offsetY);
	}
	if (this.bHasHorzScrollbar){
		var offsetX = e.offsetX - (this.nHorzScrollerWidth / 2);
		this.scrollHorzUI(offsetX);
	}
};
FoxWBScrollbar.prototype.getZoom = function(){
	var target = null;
	if (this.bHorzIFrame){	
		if (this.bHasHorzScrollbar){
			target = this.HorzScrollbarTarget[0];
		}
	}	
	else if (this.bVertIFrame){
		if (this.bHasVertScrollbar){
			target = this.VertScrollbarTarget[0];
		}
	}
	if (target){
		if (target.contentWindow){
			if (target.contentWindow.document){
				var body = target.contentWindow.document.body;
				if (body){
					if (body.style.zoom){
						return body.style.zoom;
					}
				}
			}
		}
	}
	return 1;
}
FoxWBScrollbar.prototype.scrollHorzUI = function(x){
	if (this.bHasHorzScrollbar){
		var left = x;
		if (left < 0) left = 0;
		if (left > (this.nHorzFrameWidth - this.nHorzScrollerWidth)) left = (this.nHorzFrameWidth - this.nHorzScrollerWidth);
		this.HorzScroller.css('left', left+'px');
		var documentWidth = getDocumentWidth(this.HorzScrollbarTarget, this.bHorzIFrame);
		var zoom = this.getZoom();
		var offset = getOffsetFromUI(left, documentWidth, this.nHorzTotalWidth / zoom, this.nHorzScrollerWidth, this.nHorzFrameWidth);
		setScrollLeft(this.HorzScrollbarTarget, offset, this.bHorzIFrame);
	}
};
FoxWBScrollbar.prototype.scrollVertUI = function(y){
	if (this.bHasVertScrollbar){
		var top = y;
		if (top < 0) top = 0;
		if (top >= (this.nVertFrameHeight - this.nVertScrollerHeight)) top = (this.nVertFrameHeight - this.nVertScrollerHeight);
		this.VertScroller.css('top', top+'px');
		//计算窗口偏移
		var documentHeight = getDocumentHeight(this.VertScrollbarTarget, this.bVertIFrame);
		var offset = getOffsetFromUI(top, documentHeight, this.nVertTotalHeight, this.nVertScrollerHeight, this.nVertFrameHeight);
		setScrollTop(this.VertScrollbarTarget, offset, this.bVertIFrame);
	}
};
FoxWBScrollbar.prototype.scrollVert = function(y){
	if (this.bHasVertScrollbar){
		//计算窗口偏移
		var top = y;
		var documentHeight = getDocumentHeight(this.VertScrollbarTarget, this.bVertIFrame);
		top = getOffsetFromScroll(top, documentHeight, this.nVertTotalHeight, this.nVertScrollerHeight, this.nVertFrameHeight);
		if (top < 0) top = 0;
		if (top >= (this.nVertFrameHeight - this.nVertScrollerHeight)) top = this.nVertFrameHeight - this.nVertScrollerHeight;
		this.VertScroller.css('top', top+'px');
		this.scrollVertUI(top);
	}
};
FoxWBScrollbar.prototype.setVertHeight = function(height){
	this.nFixVertHeight = height;
}
FoxWBScrollbar.prototype.setHorzOffset = function(x, y, w, h){
	this.nFixHorzX = x;
	this.nFixHorzY = y;
	this.nFixHorzWidth = w;
	this.nFixHorzHeight = h;
	if (this.bHasHorzScrollbar){
		this.HorzScrollbar.css('bottom', y+'px');
		this.HorzScrollbar.css('left', x+'px');
	}
};
FoxWBScrollbar.prototype.getVertWidth = function(){
	return 16;
};
FoxWBScrollbar.prototype.parent = function(){
	return this.Parent;
}
FoxWBScrollbar.prototype.onMouseDown = function(e){
	this.bScrolling = true;
	this.nPreOffsetX = e.screenX;
	this.nPreOffsetY = e.screenY;
	if (this.bHasHorzScrollbar){
		SetFoxWBHorzScrollerDown(this.HorzScroller);
	}
	if(this.bHasVertScrollbar){
		SetFoxWBVertScrollerDown(this.VertScroller);
	}
}
FoxWBScrollbar.prototype.onMouseUp = function(e){
	this.bScrolling = false;
	if (this.bHasHorzScrollbar){
		var obj = document.elementFromPoint(e.offsetX, e.offsetY);
		if ($(obj).hasClass('foxwb_horz_scroller') || $(obj).hasClass('foxwb_horz_scroller_part')){
			SetFoxWBHorzScrollerHover(this.HorzScroller);
		}else{
			SetFoxWBHorzScrollerNormal(this.HorzScroller);
		}
	}
	if(this.bHasVertScrollbar){
		var obj = document.elementFromPoint(e.offsetX, e.offsetY);
		if ($(obj).hasClass('foxwb_vert_scroller') || $(obj).hasClass('foxwb_vert_scroller_part')){
			SetFoxWBVertScrollerHover(this.VertScroller);
		}else{
			SetFoxWBVertScrollerNormal(this.VertScroller);
		}
	}
}
FoxWBScrollbar.prototype.onMouseMove = function(e){
	var date1 = new Date();
	if (e.which != 1){
		this.bScrolling = false;
		return false;
	}
	if (this.bHasHorzScrollbar){
		var offsetX = (e.screenX - this.nPreOffsetX);
		var left = parseInt(this.HorzScroller.css('left'));
		left += offsetX;
		if (left < 0) left = 0;
		if (left > (this.nHorzFrameWidth - this.nHorzScrollerWidth)) left = (this.nHorzFrameWidth - this.nHorzScrollerWidth);
		this.HorzScroller.css('left', left+'px');
		var documentWidth = getDocumentWidth(this.HorzScrollbarTarget, this.bHorzIFrame);
		var zoom = this.getZoom();
		var offset = getOffsetFromUI(left, documentWidth, this.nHorzTotalWidth / zoom, this.nHorzScrollerWidth, this.nHorzFrameWidth);
		setScrollLeft(this.HorzScrollbarTarget, offset, this.bHorzIFrame);
		this.nPreOffsetX += offsetX;
	}
	if (this.bHasVertScrollbar){
		var offsetY = (e.screenY - this.nPreOffsetY);
		if (offsetY == 0) return true;
		var top = parseInt(this.VertScroller.css('top'));
		//计算滚动条新的位置
		top = top + offsetY;
		if (top < 0) top = 0;
		if (top >= (this.nVertFrameHeight - this.nVertScrollerHeight)) top = (this.nVertFrameHeight - this.nVertScrollerHeight);
		this.VertScroller.css('top', top+'px');
		//计算窗口偏移
		var documentHeight = getDocumentHeight(this.VertScrollbarTarget, this.bVertIFrame);
		var offset = getOffsetFromUI(top, documentHeight, this.nVertTotalHeight, this.nVertScrollerHeight, this.nVertFrameHeight);
		setScrollTop(this.VertScrollbarTarget, offset, this.bVertIFrame);
		this.nPreOffsetY += offsetY;
		if (this.VertScrollDelegate){
			this.VertScrollDelegate();
		}
	}
	var date2 = new Date();
	//doAddDebugMsg('scroll time: '+(date2.getTime()-date1.getTime()));
	return true;
}
FoxWBScrollbar.prototype.update = function(){
	try{
		if (this.bHasHorzScrollbar){
			this.nHorzTotalWidth = getScrollWidth(this.HorzScrollbarTarget, this.bHorzIFrame);
			if (this.bHorzFixed){
				this.nHorzFrameWidth = document.documentElement.clientWidth || document.body.clientWidth;
				this.nHorzFrameWidth = this.nHorzFrameWidth + this.nFixHorzWidth;
			}else{
				this.nHorzFrameWidth = this.HorzScrollbar.parent().outerWidth(false) + this.nFixHorzWidth;
			}
			var documentWidth = getDocumentWidth(this.HorzScrollbarTarget, this.bHorzIFrame);
			this.nHorzScrollerWidth = Math.round(documentWidth * this.nHorzFrameWidth / this.nHorzTotalWidth);
			//判断是否需要滚动条
			if (this.nHorzFrameWidth >= this.nHorzTotalWidth) {
				this.HorzScrollbar.addClass('foxwb_scrollbar_hide');
				this.HorzScrollbar.css('width', '0px');
				return;
			} else this.HorzScrollbar.removeClass('foxwb_scrollbar_hide');
			//设置滚动条
			this.HorzScrollbar.css('width', this.nHorzFrameWidth+'px');
			var curScrollLeft = parseInt(this.HorzScroller.css("left"));
			if (curScrollLeft+this.nHorzScrollerWidth > this.nHorzFrameWidth) {
				curScrollLeft = this.nHorzFrameWidth - this.nHorzScrollerWidth;
				this.HorzScroller.css('left', curScrollLeft+'px');
			}
			this.HorzScroller.css('width', this.nHorzScrollerWidth+'px');
			//校正滚动条位置
			/*var left = getScrollLeft(this.HorzScrollbarTarget, this.bHorzIFrame);
			var offset = getOffsetFromScroll(left, documentWidth, this.nHorzTotalWidth, this.nHorzScrollerWidth, this.nHorzFrameWidth);
			if(offset < 0) offset = 0;
			if (offset >= (this.nHorzFrameWidth - this.nHorzScrollerWidth)) offset = this.nHorzFrameWidth - this.nHorzScrollerWidth;
			this.HorzScroller.css('top', offset+'px');*/
		}
		if (this.bHasVertScrollbar){
			//更新滚动条参数
			this.nVertTotalHeight = getScrollHeight(this.VertScrollbarTarget, this.bVertIFrame);
			this.nVertFrameHeight = this.VertScrollbar.parent().outerHeight(false);
			var documentHeight = getDocumentHeight(this.VertScrollbarTarget, this.bVertIFrame);
			this.nVertScrollerHeight = Math.round(documentHeight * this.nVertFrameHeight / this.nVertTotalHeight);
			if (this.nVertScrollerHeight < 25) this.nVertScrollerHeight = 25;
			//
			if (this.nVertFrameHeight >= this.nVertTotalHeight) {
				this.nVertScrollerHeight = 0;
				//m_VertScrollbar.addClass('foxwb_scrollbar_hide');
				//m_VertScrollbar.css('height', '0px');
				//return;
			} else this.VertScrollbar.removeClass('foxwb_scrollbar_hide');
			//设置滚动条
			this.VertScrollbar.css('height', this.nVertFrameHeight+'px');
			var curScrollTop = parseInt(this.VertScroller.css("top"));
			if (curScrollTop+this.nVertScrollerHeight > this.nVertFrameHeight) {
				curScrollTop = this.nVertFrameHeight - this.nVertScrollerHeight;
				this.VertScroller.css('top', curScrollTop+'px');
			}
			this.VertScroller.css('height', this.nVertScrollerHeight+'px');
			//校正滚动条位置
			var top = getScrollTop(this.VertScrollbarTarget, this.bVertIFrame);
			var offset = getOffsetFromScroll(top, documentHeight, this.nVertTotalHeight, this.nVertScrollerHeight, this.nVertFrameHeight);
			if(offset < 0) offset = 0;
			if (offset >= (this.nVertFrameHeight - this.nVertScrollerHeight)) offset = this.nVertFrameHeight - this.nVertScrollerHeight;
			this.VertScroller.css('top', offset+'px');
		}
	}catch(e){
		//Todo fixme getScrollWidth - iframe.contentWindow 
		//WriteLog('updateScrollbar', e.message)
	}
}

//Private Function
function getScrollLeft(target, bIFrame){
	if (bIFrame){
		if (target[0]){
			var contentWindow = target[0].contentWindow;
			if (contentWindow){
				var bodyLeft = $(contentWindow.document.body).scrollLeft();
				var clientLeft = $(contentWindow).scrollLeft();
				return Math.max(bodyLeft, clientLeft);
			}
		}
		return 0;
	}else{
		return target.scrollLeft();
	}
}
function getScrollTop(target, bIFrame){
	if (bIFrame){
		if (target[0]){
			var contentWindow = target[0].contentWindow;
			if (contentWindow){
				return $(contentWindow.document.body).scrollTop();
			}
		}
		return 0;
	}else{
		return target.scrollTop();
	}
}
function setScrollLeft(target, offset, bIFrame){
	if (bIFrame){
		//var documentWidth = target[0].contentWindow.document.documentElement.scrollWidth;
		//var bodyWidth = target[0].contentWindow.document.body.scrollWidth;
		$(target[0].contentWindow).scrollLeft(offset);
	}else{
		target.scrollLeft(offset);
	}
}
function setScrollTop(target, offset, bIFrame){
	if (bIFrame){
		$(target[0].contentWindow).scrollTop(offset);
		//$(target[0].contentWindow.document.body).scrollTop(offset);
	}else{
		target.scrollTop(offset);
	}
}
function getOffsetFromScroll(offset, documentSize, totalSize, scrollerSize, scrollbarSize){
	return Math.round(offset * (scrollbarSize - scrollerSize) / (totalSize - documentSize));
}
function getOffsetFromUI(offset, documentSize, totalSize, scrollerSize, scrollbarSize){
	return Math.round(offset * (totalSize - documentSize) / (scrollbarSize - scrollerSize));
}
function getDocumentWidth(target, bIframe){
	if (bIframe){
		return target[0].contentWindow.document.documentElement.clientWidth || target[0].contentWindow.document.body.clientWidth;
	}else{
		return 0;
	}
}
function getScrollWidth(target, bIframe){
	var counter = 0;
	var maxCounter = 100;
	if (bIframe){
		if (target[0]){
			var contentWindow = target[0].contentWindow;
			if (contentWindow){	
				if (contentWindow.document){
					var doc = contentWindow.document;
					var body = contentWindow.document.body;
					if (body){
						var width = doc.documentElement.scrollWidth;
						while (width != doc.documentElement.scrollWidth){
							width = doc.documentElement.scrollWidth;
							if (counter > maxCounter) break;
							else counter ++;
						}
						counter = 0;
						var bodyWidth = body.scrollWidth;
						while (bodyWidth != body.scrollWidth){
							bodyWidth = body.scrollWidth;
							if (counter > maxCounter) break;
							else counter ++;
						}
						width = Math.max(width, bodyWidth);
						var weight = 1;
						if (body.style.zoom){
							weight = body.style.zoom;
						}
						return width * weight;
					}
				}	
			}
		}
		return 0;
	}else{
		var width = target[0].scrollWidth;
		while (width != target[0].scrollWidth){
			width = target[0].scrollWidth;
			if (counter > maxCounter) break;
			else counter ++;
		}
		return width; 
	}
}
function getScrollHeight(target, bIframe){
	var counter = 0;
	var maxCounter = 100;
	if (bIframe){
		if (target[0]){
			var contentWindow = target[0].contentWindow;
			if (contentWindow){
				if (contentWindow.document){
					var doc = contentWindow.document;
					var body = doc.body;
					if (body){
						var weight = 1;
						if (body.style.zoom){
							weight = body.style.zoom;
						}
						var height = doc.documentElement.scrollHeight;
						while (height != doc.documentElement.scrollHeight){
							height = doc.documentElement.scrollHeight;
							if (counter > maxCounter) break;
							else counter ++;
						}
						counter = 0;
						var bodyHeight = body.scrollHeight;
						while (bodyHeight != body.scrollHeight){
							bodyHeight = body.scrollHeight;
							if (counter > maxCounter) break;
							else counter ++;
						}
						height = Math.max(bodyHeight, height);
						return height * weight;
					}
				}
			}
		}
		return 0;
	}else{
		var height = target[0].scrollHeight;
		while (height != target[0].scrollHeight){
			height = target[0].scrollHeight;
			if (counter > maxCounter) break;
			else counter ++;
		}
		return height;
	}
}
function getDocumentHeight(target, bIframe){
	if (bIframe){
		return target[0].contentWindow.document.documentElement.clientHeight || target[0].contentWindow.document.body.clientHeight;
	}else{
		return target.outerHeight(false);
	}
}
function getFoxWBScrollbarKey(id){
	return 'foxwb_scrollbar_'+id;
}
function setFoxWBCapture(){
	document.body.setCapture();
}
function releaseFoxWBCapture(){
	document.body.releaseCapture();
}
function createHorzScrollbar(id, parentID){
	//var scrollbarHTML = '<div id="' + id + '" class="foxwb_scrollbar foxwb_horz_scrollbar"><div id="' + id + '_horz_scroller" class="foxwb_scroller //foxwb_horz_scroller"><div class="foxwb_horz_scroller_part foxwb_horz_scroller_left"></div><div class="foxwb_horz_scroller_part //foxwb_horz_scroller_right"></div></div></div>';
	var scrollbarHTML = '<div id="'+id+'" class="foxwb_scrollbar foxwb_horz_scrollbar"><div id="foxwb_horz_scroller_'+id+'" class="foxwb_scroller foxwb_horz_scroller"><div class="foxwb_horz_scroller_part foxwb_horz_scroller_middle"></div><div class="foxwb_horz_scroller_part foxwb_horz_scroller_p1"></div><div class="foxwb_horz_scroller_part foxwb_horz_scroller_p2"></div></div><div class="foxwb_horz_scroller_part foxwb_horz_scroller_handle"></div></div>';
	var parent = document.getElementById(parentID);
	parent.insertAdjacentHTML('beforeEnd', scrollbarHTML);
	return $('#'+id);
}
function createVertScrollbar(id, parentID){
	//var scrollbarHTML = '<div id="' + id + '" class="foxwb_scrollbar foxwb_vert_scrollbar"><div id="' + id + '_vert_scroller" class="foxwb_scroller foxwb_vert_scroller"><div class="foxwb_vert_scroller_part foxwb_vert_scroller_middle"><div class="foxwb_vert_scroller_part foxwb_vert_scroller_top"></div></div><div class="foxwb_vert_scroller_part foxwb_vert_scroller_bottom"></div></div></div>';
	var scrollbarHTML = '<div id="'+id+'" class="foxwb_scrollbar foxwb_vert_scrollbar"><div id="foxwb_vert_scroller_'+id+'" class="foxwb_scroller foxwb_vert_scroller"><div class="foxwb_vert_scroller_part foxwb_vert_scroller_middle"></div><div class="foxwb_vert_scroller_part foxwb_vert_scroller_p1"></div><div class="foxwb_vert_scroller_part foxwb_vert_scroller_p2"></div><div class="foxwb_vert_scroller_part foxwb_vert_scroller_handle"></div></div></div>';
	var parent = document.getElementById(parentID);
	parent.insertAdjacentHTML('beforeEnd', scrollbarHTML);
	return $('#'+id);
}