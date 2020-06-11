//FoxWebBrowser
function invokeAppFunction(name, obj){
	return window.external.invokeAppFunction(name, obj);
}
var g_foxWBFunctionTable = {};
function registerJSFunction(name, callback, options){
	if (g_foxWBFunctionTable[name] != 'undefined'){
		g_foxWBFunctionTable[name] = function(params){
			return callback(params, options);
		}
	}
}
function FoxWBObject(){
	var data = {};
	this.getValue = function(key){
		return data[key];
	}
	this.setValue = function(key, value){
		data[key] = value;
	}
	this.clearValue = function(){
		data = {};
	}
}
function invokeJSFunction(){
	var totalArgNum = arguments.length;
	if (totalArgNum < 1) return;
	var invokeFunctionName = arguments[0];
	var invokeFunction = g_foxWBFunctionTable[invokeFunctionName];
	if (invokeFunction == 'undefined') return;
	var argNum = (totalArgNum - 1) / 2;
	var obj = new FoxWBObject();
	for (var i=0; i<argNum; i++){
		var key = arguments[i+1];
		var value = arguments[i+argNum+1];
		obj.setValue(key, value);
	}
	return invokeFunction(obj);
}
//