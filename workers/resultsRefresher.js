const workers = require('worker_threads');
const resultsService = require('../services/results');

// See https://nodejs.org/api/worker_threads.html#worker_threads_worker_threads

/**
 * Creates a worker for this file.
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

const run = () => {
    const refreshFrequencySeconds = workers.workerData.refreshFrequency || 60;
    setInterval(async () => {
        console.log("Running...")
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