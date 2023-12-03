const { parentPort, workerData } = require('worker_threads');
let cancelled = false;
const { performance } = require('perf_hooks');
parentPort.on('message', (message) => {
    if (message === 'cancel') {
        cancelled = true;
    }
});

function sleep(ms) {
    const sab = new SharedArrayBuffer(4);
    const int32 = new Int32Array(sab);
    Atomics.wait(int32, 0, 0, ms);
}
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function iterativePrimes(initialValue){
     const startTime = Date.now();
    //const startTime = performance.now();
    let primeCount = 0;

    for (let i = 2; i <= initialValue; i++) {
        if (cancelled) {
            const duration = Date.now() - startTime;
            parentPort.postMessage({ type: 'cancelled', duration });
            return { count: null, duration };
        }

        else if (isPrime(i)) {
            primeCount++;
            // const progress = (i / initialValue) * 100;
            // parentPort.postMessage({ type: 'progress', index: primeCount, value: i, percents: progress });
        }
        const progress = (i / initialValue) * 100;
        parentPort.postMessage({ type: 'progress', index: primeCount, value: i, percents: progress });
        sleep(100);
    }

    const duration = Date.now() - startTime;
    return {primeCount, duration };
}

try {
    const { primeCount, duration } = iterativePrimes(workerData.count);
    parentPort.postMessage({ type: 'result', primeCount, percents: 100, duration });
} catch (error) {
    parentPort.postMessage({ type: 'error', error: error.message });
}
