importScripts('resource://gre/modules/workers/require.js');
//var PromiseWorker = require('resource://gre/modules/workers/PromiseWorker.js');
var PromiseWorker = require('chrome://promiseworker/content/modules/workers/PromiseWorker.js');

var worker = new PromiseWorker.AbstractWorker();
worker.dispatch = function(method, args = []) {
  return self[method](...args);
},
worker.postMessage = function(...args) {
  self.postMessage(...args);
};
worker.close = function() {
  self.close();
};
worker.log = function(...args) {
  dump("Worker: " + args.join(" ") + "\n");
};
self.addEventListener("message", msg => worker.handleMessage(msg));

function sendWorkerArrBuf(firstArg, aBuf) {
	console.info('from worker, PRE send back aBuf.byteLength:', aBuf.byteLength);
	console.info('firstArg:', firstArg);
	
	setTimeout(function() {
		console.info('from worker, POST send back aBuf.byteLength:', aBuf.byteLength);
	}, 1000);
	
	return new PromiseWorker.Meta(aBuf, {transfers: [aBuf]});
	
}

//self.addEventListener("message", msg => self.handleMessage(msg));