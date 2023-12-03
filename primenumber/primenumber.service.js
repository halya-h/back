const { Worker } = require('worker_threads');
const path = require('path');

class PrimeService {
    constructor() {
        this.workers = new Map();
        this.currentId = 0;
        this.maxWorkers = 3;
    }

    calculatePrimes(count, onProgress) {
        if (this.workers.size === this.maxWorkers) {
            return Promise.reject(new Error('The maximum number of workers has been reached.'));
        }

        return new Promise((resolve, reject) => {
            const id = this.currentId + 1;
            this.currentId++;
            const workerPath = path.resolve(__dirname, 'primenumber.workers.js');
            const worker = new Worker(workerPath, { workerData: { count } });
            this.workers.set(id, worker);

            worker.on('message', (message) => {
                if (message.type === 'progress') {
                    onProgress({ ...message, id });
                } else if (message.type === 'result') {
                    resolve({ ...message, id, primeCount: message.primeCount });
                    this.cleanUpWorker(id);
                }
            });

            worker.on('error', () => {
                this.workers.delete(id);
                reject();
            });

            worker.on('exit', (code) => {
                this.workers.delete(id);
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }

    cancelCalculation(id) {
        const worker = this.workers.get(id);
        if (worker) {
            worker.postMessage('cancel');
            this.cleanUpWorker(id);
        }
    }

    cleanUpWorker(id) {
        const worker = this.workers.get(id);
        if (worker) {
            worker.terminate();
            this.workers.delete(id);
        }
    }
}

module.exports = PrimeService;
