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
	
	var promise = myWorker.post('sendWorkerArrBuf', [arrBuf], null, [arrBuf]);
	
	console.info('from mainThread - arrBuf.byteLength post transfer:', arrBuf.byteLength);
	
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
