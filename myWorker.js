importScripts('resource://gre/modules/workers/require.js');
//var PromiseWorker = require('resource://gre/modules/workers/PromiseWorker.js');
var PromiseWorker = require('chrome://promiseworker/content/modules/workers/PromiseWorker.js');

var worker = new PromiseWorker.AbstractWorker();
	worker.dispatch = function(method, args = []) {
	return self[method](...args);
};
worker.postMessage = function(result, ...transfers) {
	self.postMessage(result, ...transfers);
};
worker.close = function() {
	self.close();
};

self.addEventListener("message", msg => worker.handleMessage(msg));

var user32 = ctypes.open('user32.dll');

var msgBox = user32.declare("MessageBoxW",
                         ctypes.winapi_abi,
                         ctypes.int32_t,
                         ctypes.int32_t,
                         ctypes.jschar.ptr,
                         ctypes.jschar.ptr,
                         ctypes.int32_t);

function ask(msg) {
	var MB_OK = 0;
	var MB_YESNO = 4;
	var IDYES = 6;
	var IDNO = 7;
	var IDCANCEL = 2;

	var ret = msgBox(0, msg, "Asking Question", MB_YESNO);
	return ret;
}

//self.addEventListener("message", msg => self.handleMessage(msg));