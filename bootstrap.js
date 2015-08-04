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
/*
importPromiseWorker();
function importPromiseWorker() {
	if (Services.vc.compare(Services.appinfo.version, 33) >= 0) {
		Services.wm.getMostRecentWindow(null).alert('lo ver: resource://gre/modules/osfile/_PromiseWorker.jsm');
		PromiseWorker = Cu.import('resource://gre/modules/osfile/_PromiseWorker.jsm').PromiseWorker;
	} else if (Services.vc.compare(Services.appinfo.version, 32) == 0) {
		Services.wm.getMostRecentWindow(null).alert('lo ver: resource://gre/modules/osfile/_PromiseWorker.jsm');
		PromiseWorker = Cu.import('resource://gre/modules/osfile/_PromiseWorker.jsm').PromiseWorker;
	}
}
*/

var myWorker = null;
function loadAndSetupWorker() {
	if (!myWorker) {
		myWorker = new PromiseWorker(self.path + 'myWorker.js');
	}
	
	// Define a custom error prototype.
	function CustomError(message) {
	  this.message = message;
	}
	CustomError.fromMsg = function(msg) {
	  return new CustomError(msg.message);
	};

	// Register a constructor.
	myWorker.ExceptionHandlers["CustomError"] = CustomError.fromMsg;
	
	var promise = myWorker.post('ask', ['do you see this message?']);
	promise.then(
		function(aVal) {
			console.log('promise success, aVal:', aVal);
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
