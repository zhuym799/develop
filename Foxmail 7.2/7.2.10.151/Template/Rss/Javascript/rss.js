
function selectRssBody(){
	selectElement($('#mail_body')[0]);
}

function selectElement(element) {
    if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();       			
        range.selectNodeContents(element);
        sel.addRange(range);  
    } else if (document.selection) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.select();
    }
}

function ClearSelection()
{
	var selObj = window.getSelection();
	selObj.removeAllRanges();
}
