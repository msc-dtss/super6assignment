const workers = require('worker_threads');
const resultsService = require('../services/results');

// See https://nodejs.org/api/worker_threads.html#worker_threads_worker_threads

/**
 * Creates a worker for this file.
  * @param {Number} refreshFrequency Refresh frequency in seconds
  * @param {Function} onsuccess Callback to run when the worker is successful (i.e. when it manages to get new results)
  * @param {Function} onerror Callback to run when there's an error
  */
const setup = (refreshFrequency, onsuccess, onerror) => {
    const worker = new workers.Worker(__filename, {
        workerData: {
            refreshFrequency
        }
    });
    worker.on('message', onsuccess);
    worker.on('error', onerror);
    worker.on('exit', (code) => {
        onerror(new Error(`Worker stopped with exit code ${code}`));
    });
};

/**
 * Gets the latest results every `refreshFrequency` seconds (configured when instancing the Worker).
 * Run will be executed automatically when `resultsRefresher` is started as a Worker.
 * @emits message The results to be passed back to the main application
 */
const run = () => {
    const refreshFrequencySeconds = workers.workerData.refreshFrequency || 60;
    setInterval(async () => {
        const results = await resultsService.getResultsFromApi();
        workers.parentPort.postMessage(results);
    }, refreshFrequencySeconds * 1000);

};


if(!workers.isMainThread){
    run();
}

module.exports = {
    setup
}