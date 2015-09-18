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

/////// end boilerplayte

function getBackMultiArrBufs() {
	
	var aImgData1 = new ImageData(10, 10);
	var aImgData2 = new ImageData(10, 10);
	
	return new PromiseWorker.Meta([
			aImgData1.data.buffer,
			aImgData2.data.buffer
		], {
			transfers: [aImgData1.data.buffer, aImgData2.data.buffer]
		}
	);
	
}

//self.addEventListener("message", msg => self.handleMessage(msg));
