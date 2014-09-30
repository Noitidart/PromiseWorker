const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'PromiseWorker',
	suffix: '@jetpack',
	path: 'chrome://promiseworker/content/',
	aData: 0,
};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');
var PromiseWorker;
importPromiseWorker();

function importPromiseWorker() {
	if (Services.appinfo.version <= 32) {
		Services.wm.getMostRecentWindow(null).alert('lo ver: resource://gre/modules/osfile/_PromiseWorker.jsm');
		PromiseWorker = Cu.import('resource://gre/modules/osfile/_PromiseWorker.jsm').PromiseWorker;
	} else {
		Services.wm.getMostRecentWindow(null).alert('hi ver: resource://gre/modules/PromiseWorker.jsm');
		PromiseWorker = Cu.import('resource://gre/modules/PromiseWorker.jsm').BasePromiseWorker;
	}
}

var myWorker = null;
function loadAndSetupWorker() {
	if (!myWorker) {
		myWorker = new PromiseWorker(self.path + 'myWorker.js');
	}
	
	var promise = myWorker.post('ask', ['do you see this message?']);
	promise.then(
		function(aVal) {
			Services.wm.getMostRecentWindow(null).alert('promise success, aVal:' + aVal);
		},
		function(aReason) {
			Services.wm.getMostRecentWindow(null).alert('promise rejected, aReason:' + aReason);
		}
	);
}

function install() {}

function uninstall() {}

function startup() {
	loadAndSetupWorker(); //must do after startup
}
 
function shutdown(aReason) {
	if (aReason == APP_SHUTDOWN) return;
}
