/*
 * FoxUI的基础单元
 */
(function(){
	if(window.FoxUI) return;
	function FoxUI(){}

	FoxUI.prototype.add = function(name, o) {
		if(this[name]) return;
		this[name] = o['_construct'];
		
		for(var i in o) {
			this[name].prototype[i] = o[i];
		}
	};
	
	window.FoxUI = new FoxUI();
})();