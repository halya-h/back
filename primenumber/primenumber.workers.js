import { parentPort, workerData } from 'worker_threads';

let cancelled = false;

parentPort.on('message', (message) => {
    if (message === 'cancel') {
        cancelled = true;
    }
});

function sleep(milliseconds) {
    const sab = new SharedArrayBuffer(4);
    const int32 = new Int32Array(sab);
    Atomics.wait(int32, 0, 0, milliseconds);
}

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function iterativePrimes(count) {
    const startTime = Date.now();
    const primes = [];

    for (let i = 2; primes.length < count; i++) {
        if (cancelled) {
            const duration = Date.now() - startTime;
            parentPort.postMessage({ type: 'cancelled', duration });
            return { values: null, duration };
        }

        if (isPrime(i)) {
            primes.push(i);
            const progress = (primes.length / count) * 100;
            parentPort.postMessage({ type: 'progress', index: primes.length, value: i, percents: progress });
        }

        sleep(100);
    }

    const duration = Date.now() - startTime;
    return { values: primes, duration };
}

try {
    const { values, duration } = iterativePrimes(workerData.count);
    parentPort.postMessage({ type: 'result', values, percents: 100, duration });
} catch (error) {
    parentPort.postMessage({ type: 'error', error: error.message });
}
