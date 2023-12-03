import { parentPort, workerData } from 'worker_threads';
let cancelled = false;


parentPort.on('message', (message) => {
    if (message === 'cancel') {
        cancelled = true;
    }
});
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function primeCalculation (n) {
    const startTime = Date.now();
    if (n > 10000) {
        throw new Error('The number is too large. Maximum allowed is 10000.');
    }
    let primeCount = 0;

    for (let i = 2; i <= n; i++) {
        if (cancelled) {
            const duration = Date.now() - startTime; // duration cancellation
            parentPort.postMessage({type: 'cancelled', duration});
            return {value: null, duration};
        }
        if (isPrime(i)) {
            primeCount++;
        }
        sleep(100);
        const progress = (i / n) * 100;
        parentPort.postMessage({ type: 'progress', index: i, value: primeCount, percents: progress });
    }
    const duration = Date.now() - startTime;
    return { value: primeCount, duration };
}
try {
    const { value, duration } = primeCalculation(workerData.n);
    parentPort.postMessage({ type: 'result', value, percents: 100, duration });
} catch (error) {
    parentPort.postMessage({ type: 'error', error: error.message });
}

// onmessage = async function (e) {
//     try {
//         const { initialValue } = e.data;
//         let primeCount = 0;
//
//         for (let i = 2; i <= initialValue; i++) {
//             if (isPrime(i)) {
//                 primeCount++;
//                 await sleep(100);
//             }
//             postMessage({ progress: (i / initialValue) * 100 });
//         }
//
//         postMessage({ result: primeCount });
//     } catch (error) {
//         postMessage({ error: error.toString() });
//     }
// };