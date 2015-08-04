const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'PromiseWorker',
	suffix: '@jetpack',
	path: 'chrome://promiseworker/content/',
	aData: 0,
};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');
Cu.import('resource://gre/modules/Promise.jsm');
var PromiseWorker;

var myWorker = null;
function loadAndSetupWorker() {
	if (!myWorker) {
		myWorker = new PromiseWorker(self.path + 'myWorker.js');
	}
	
	var arrBuf = new ArrayBuffer(8);
	console.info('from mainThread - arrBuf.byteLength pre transfer:', arrBuf.byteLength);
	
	var timeSend = new Date().getTime();
	var promise = myWorker.post('sendWorkerArrBuf', [arrBuf], null, [arrBuf]);
	
	// The reason I watch with setInterval rather then just check arrBuf.byteLength is because .post function of PromiseWorker uses Task.spawn and transfers the data asynchronously: https://dxr.mozilla.org/mozilla-central/source/toolkit/components/promiseworker/PromiseWorker.jsm#263
	var cWin = Services.wm.getMostRecentWindow('navigator:browser');
	var myInterval = cWin.setInterval(function() {
		if (arrBuf.byteLength == 0) {
			cWin.clearInterval(myInterval);
			var timeSent = new Date().getTime();
			console.info('from mainThread - it took ' + (timeSent - timeSend) + 'ms to send the arrBuf - arrBuf.byteLength post transfer:', arrBuf.byteLength);
		}
	}, 1);
	
	promise.then(
		function(aVal) {
			console.log('from mainThread - promise success, aVal:', aVal, aVal.byteLength);
			Services.wm.getMostRecentWindow(null).alert('promise success, aVal:' + aVal);
		},
		function(aReason) {
			console.log('promise rejected aReason:', aReason);
			Services.wm.getMostRecentWindow(null).alert('promise rejected, aReason:' + aReason);
		}
	);
}

function install() {}

function uninstall() {}

function startup() {
	PromiseWorker = Cu.import('chrome://promiseworker/content/modules/PromiseWorker.jsm').BasePromiseWorker;
	loadAndSetupWorker(); //must do after startup
}
 
function shutdown(aReason) {
	if (aReason == APP_SHUTDOWN) return;
	Cu.unload('chrome://content/modules/PromiseWorker.jsm');
}
