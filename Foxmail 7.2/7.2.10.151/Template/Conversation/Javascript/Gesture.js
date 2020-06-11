
function AdjustGestrueCanvasSize() {
    var canvas = document.getElementById('gestureCanvas');
    var context = canvas.getContext('2d');
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;

    var ratio = devicePixelRatio / backingStoreRatio;
    var oldWidth = $(window).innerWidth();
    var oldHeight = $(window).innerHeight();
    var canvas = document.getElementById('gestureCanvas');
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    // now scale the context to counter
    // the fact that we've manually scaled
    // our canvas element
    canvas.getContext('2d').scale(ratio, ratio);
}

function AdjustGestrueCanvasPos() {
    var bodyTop = document.body.scrollTop + 'px';
    var bodyLeft = document.body.scrollLeft + 'px';
    var canvas = document.getElementById('gestureCanvas');
    canvas.style.top = bodyTop;
    canvas.style.left = bodyLeft;
}

function AdjustGestrueCanvas() {
    AdjustGestrueCanvasSize();
    AdjustGestrueCanvasPos();
}

var isInvalidGesture = false;
var supportGesture = false;

function D2J_EnableGesture(enabled) {
    supportGesture = enabled;
    HideGesture();
}

function D2J_SetGestureHint(strHint, fontSize) {
    if (supportGesture && strHint.length > 0) {
        ShowGestureHint(strHint, fontSize);
    } else {
        HideGestureHint();
    }
}

function ShowGestureHint(strHint, fontSize) {
    var divHint = document.getElementById('gestureHint');
    divHint.innerText = strHint;
    divHint.style.fontSize = fontSize + 'pt';
    divHint.style.display = '';
}

function HideGestureHint() {
    var divHint = document.getElementById('gestureHint');
    divHint.style.display = 'none';
}

function HideGestureCanvas() {
    var canvas = document.getElementById('gestureCanvas');
    canvas.style.display = 'none';
}

function ShowGestureCanvas() {
    var canvas = document.getElementById('gestureCanvas');
    canvas.style.display = '';
}

function HideGesture() {
    HideGestureHint();
    HideGestureCanvas();
}

function BindGestureEvents() {
    var isGesture = false;
    var isMouseDown = false;
    var mouseDownX = 0;
    var mouseDownY = 0;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var canvas = document.getElementById('gestureCanvas');
    var context = canvas.getContext('2d');
    var divHint = document.getElementById('gestureHint');
    var points = [];
    var timer;

    var drawLine = function(ev) {
        context.strokeStyle = '#0080FF';
        context.moveTo(mouseDownX, mouseDownY);
        context.lineTo(ev.clientX, ev.clientY);
        context.lineWidth = 3;
        context.stroke();
    };
    
    var invalidGesture = function() {
        HideGestureHint();
        isInvalidGesture = true;
        points = [];
    }
    
    var checkMouseUpOutside = function(ev) {
        if (isMouseDown && ev.buttons != 2) {
            isMouseDown = false;
            isGesture = false;
            invalidGesture();
            HideGesture();
        }
    }

    document.addEventListener('scroll', function(ev) {
        AdjustGestrueCanvasPos();
    }, true);
    
    document.addEventListener('mouseenter', function(ev) {
        if (isMouseDown && isGesture && !isInvalidGesture) {
            invalidGesture();
            points = [];
            mouseDownX = ev.clientX;
            mouseDownY = ev.clientY;
            checkMouseUpOutside(ev);
        }
    });

    document.addEventListener('mouseleave', function(ev) {
        if (isMouseDown && isGesture && !isInvalidGesture) {
            invalidGesture();
            drawLine(ev);
            points = [];
            context.closePath();
        }
    });

    document.addEventListener('mousedown', function(ev) {
        if (ev.button == 2 && supportGesture) {
            isMouseDown = true;
            mouseDownX = ev.clientX;
            mouseDownY = ev.clientY;
            lastMouseX = mouseDownX;
            lastMouseY = mouseDownY;
            points = [];
            points.push(mouseDownX);
            points.push(mouseDownY);
            context.beginPath();
        }
    });
    
    document.addEventListener('mousemove', function(ev) {
        if (supportGesture && !isGesture && isMouseDown && ((mouseDownX != ev.clientX) || (mouseDownY != ev.clientY))) {
            isGesture = true;
            isInvalidGesture = false;
            AdjustGestrueCanvas();
            ShowGestureCanvas();
        }
        checkMouseUpOutside(ev);
        if (supportGesture && isMouseDown && isGesture && !isInvalidGesture) {
            if ((mouseDownX != ev.clientX) || (mouseDownY != ev.clientY)) {
                drawLine(ev);
                mouseDownX = ev.clientX;
                mouseDownY = ev.clientY;
                var dx = mouseDownX - lastMouseX;
                var dy = mouseDownY - lastMouseY;
                const DISTANCE_THRESHOLD = 15 * 15;
                if (dx * dx + dy * dy >= DISTANCE_THRESHOLD) {
                    points.push(mouseDownX);
                    points.push(mouseDownY);
                    lastMouseX = mouseDownX;
                    lastMouseY = mouseDownY;
                    J2D_GetGestureHint(points);
                }
                divHint.style.left = (ev.clientX + document.body.scrollLeft) + 'px';
                divHint.style.top = (ev.clientY + document.body.scrollTop) + 'px';
            }
        }
    }, true);

    document.addEventListener('mouseup', function(ev) {
        isMouseDown = false;
        HideGesture();
        if (isGesture) {
            mouseDownX = 0;
            mouseDownY = 0;
            lastMouseX = 0;
            lastMouseY = 0;
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.restore();
            if (!isInvalidGesture && points.length >= 8) {
                J2D_GestureAction(points);
                invalidGesture();
            }
            timer = window.setTimeout(function() { isGesture = false; }, 10);
        }
        points = []
    }, true);

    document.addEventListener('contextmenu', function(ev) {
        if (isGesture) {
            isGesture = false;
            window.clearTimeout(timer);
            ev.preventDefault();
            ev.stopPropagation();
        }
    }, true);
}

$(document).ready(function() {
    AdjustGestrueCanvas();
    if (window.J2D_GestureAction && window.J2D_GetGestureHint) {
        BindGestureEvents();
    }
});

$(window).resize(function() {
    AdjustGestrueCanvas();
});
