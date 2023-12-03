// const pool = require('../database');
// const { performance } = require('perf_hooks');
//
// function isPrime(num) {
//     if (num <= 1) return false;
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//         if (num % i === 0) return false;
//     }
//     return true;
// }
//
// class CalculationController {
//     constructor() {}
//
//     async calculatePrime(req, res) {
//         try {
//             const initialValue = parseInt(req.params.initialValue); // Extracting from URL
//
//             // Початок обчислень
//             const startTime = performance.now();
//
//             // Отримання кількості простих чисел до initialValue
//             let primeCount = 0;
//             for (let i = 2; i <= initialValue; i++) {
//                 if (isPrime(i)) {
//                     primeCount++;
//                 }
//             }
//
//             // Кінець обчислень
//             const endTime = performance.now();
//             const duration = endTime - startTime;
//
//             // Запис у базу даних
//             const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
//             const queryParams = [initialValue, duration, primeCount];
//
//             console.log('SQL Query:', insertQuery);
//             console.log('Query Parameters:', queryParams);
//
//             await pool.query(insertQuery, queryParams);
//
//
//
//
//             // Відправка результату у відповідь запиту
//             if (initialValue < 1) {
//                 return res.status(400).json({ error: 'Invalid initial value' });
//             }
//             res.json({ result: primeCount, duration });
//         } catch (err) {
//             console.log(err.toString())
//             res.json({ detail: err})
//         }
//     }
// }
// module.exports = new CalculationController();

// const pool = require('../database');
// const { performance } = require('perf_hooks');
//
// function isPrime(num) {
//     if (num <= 1) return false;
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//         if (num % i === 0) return false;
//     }
//     return true;
// }
//
// class CalculationController {
//     constructor() {}
//
//     async sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
//
//     async calculatePrime(req, res) {
//         try {
//             const initialValue = parseInt(req.body.initialValue);
//             // Extracting from URL
//
//             // Початок обчислень
//             const startTime = performance.now();
//
//             // Отримання кількості простих чисел до initialValue
//             let primeCount = 0;
//             for (let i = 2; i <= initialValue; i++) {
//                 if (isPrime(i)) {
//                     primeCount++;
//                 }
//                 // Затримка у 100 мілісекунд між ітераціями
//                 await this.sleep(100);
//             }
//
//             // Кінець обчислень
//             const endTime = performance.now();
//             const duration = endTime - startTime;
//
//             // Запис у базу даних
//             const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
//             const queryParams = [initialValue, duration, primeCount];
//
//             console.log('SQL Query:', insertQuery);
//             console.log('Query Parameters:', queryParams);
//
//             await pool.query(insertQuery, queryParams);
//
//             // Відправка результату у відповідь запиту
//             if (initialValue < 1) {
//                 return res.status(400).json({ error: 'Invalid initial value' });
//             }
//             res.json({ result: primeCount});
//         } catch (err) {
//             console.log(err.toString());
//             res.json({ detail: err });
//         }
//     }
// }
//
// module.exports = new CalculationController();
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const pool = require('../database');
// const { performance } = require('perf_hooks');
//
// function isPrime(num) {
//     if (num <= 1) return false;
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//         if (num % i === 0) return false;
//     }
//     return true;
// }
//
// class CalculationController {
//     constructor() {
//         this.cancelFlags = new Map();
//     }
//
//     async sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
//     // async calculatePrime(req, res) {
//     //     try {
//     //         const initialValue = parseInt(req.body.initialValue);
//     //         this.cancelFlags.set(initialValue, false); // Reset cancel flag for this calculation
//     //         // Початок обчислень
//     //         const startTime = performance.now();
//     //         // Отримання кількості простих чисел до initialValue
//     //         let primeCount = 0;
//     //         for (let i = 2; i <= initialValue; i++) {
//     //             if (this.cancelFlags.get(initialValue)) {
//     //                 // Check if cancellation is requested
//     //                 console.log('Server: Cancellation requested. Stopping calculation.');
//     //                 break;
//     //             }
//     //             if (isPrime(i)) {
//     //                 primeCount++;
//     //             }
//     //             // Затримка у 100 мілісекунд між ітераціями
//     //             await this.sleep(100);
//     //             if (this.cancelFlags.get(initialValue)) {
//     //                 // If cancellation is requested, do not insert into the database
//     //                 break;
//     //             }
//     //         }
//     //         // Кінець обчислень
//     //         const endTime = performance.now();
//     //         const duration = endTime - startTime;
//     //         console.log('Before database insertion. Cancellation Flag:', this.cancelFlags.get(initialValue));
//     //         // Запис у базу даних (if not canceled)
//     //         if (!this.cancelFlags.get(initialValue)) {
//     //             const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
//     //             const queryParams = [initialValue, duration, primeCount];
//     //             console.log('SQL Query:', insertQuery);
//     //             console.log('Query Parameters:', queryParams);
//     //             await pool.query(insertQuery, queryParams);
//     //         }
//     //         // Відправка результату у відповідь запиту
//     //         if (initialValue < 1) {
//     //             return res.status(400).json({ error: 'Invalid initial value' });
//     //         }
//     //         res.json({ result: primeCount });
//     //     } catch (err) {
//     //         console.log(err.toString());
//     //         res.json({ detail: err });
//     //     }
//     // }
//
//     async calculatePrime(req, res) {
//         try {
//             const initialValue = parseInt(req.body.initialValue);
//             const cancelFlag = `cancelFlag_${initialValue}`;
//             this.cancelFlags.set(cancelFlag, false); // Reset cancel flag for this calculation
//
//             // Початок обчислень
//             const startTime = performance.now();
//             // Отримання кількості простих чисел до initialValue
//             let primeCount = 0;
//
//             for (let i = 2; i <= initialValue; i++) {
//                 if (this.cancelFlags.get(cancelFlag)) {
//                     // Check if cancellation is requested
//                     console.log('Server: Cancellation requested. Stopping calculation.');
//                     break;
//                 }
//                 if (isPrime(i)) {
//                     primeCount++;
//                 }
//                 // Затримка у 100 мілісекунд між ітераціями
//                 await this.sleep(100);
//                 if (this.cancelFlags.get(cancelFlag)) {
//                     // If cancellation is requested, do not insert into the database
//                     break;
//                 }
//             }
//
//             // Кінець обчислень
//             const endTime = performance.now();
//             const duration = endTime - startTime;
//             console.log('Before database insertion. Cancellation Flag:', this.cancelFlags.get(cancelFlag));
//
//             // Запис у базу даних (if not canceled)
//             if (!this.cancelFlags.get(cancelFlag)) {
//                 const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
//                 const queryParams = [initialValue, duration, primeCount];
//                 console.log('SQL Query:', insertQuery);
//                 console.log('Query Parameters:', queryParams);
//                 await pool.query(insertQuery, queryParams);
//             }
//
//             // Відправка результату у відповідь запиту
//             if (initialValue < 1) {
//                 return res.status(400).json({ error: 'Invalid initial value' });
//             }
//
//             res.json({ result: primeCount });
//         } catch (err) {
//             console.log(err.toString());
//             res.json({ detail: err });
//         }
//     }
//
//     cancelCalculation(initialValue) {
//         this.cancelFlags.set(initialValue, true);
//     }
//
// }
//
// module.exports = new CalculationController();


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// const pool = require('../database');
// const { performance } = require('perf_hooks');
// const { AbortController } = require('abort-controller');
//
// function isPrime(num) {
//     if (num <= 1) return false;
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//         if (num % i === 0) return false;
//     }
//     return true;
// }
//
// class CalculationController {
//     constructor() {}
//
//     async sleep(ms, signal) {
//         return new Promise((resolve, reject) => {
//             const timeoutId = setTimeout(() => {
//                 if (signal.aborted) {
//                     reject(new Error('Calculation aborted'));
//                 } else {
//                     resolve();
//                 }
//             }, ms);
//
//             signal.addEventListener('abort', () => {
//                 clearTimeout(timeoutId);
//                 reject(new Error('Calculation aborted'));
//             });
//         });
//     }
//
//     async calculatePrime(req, res) {
//         const abortController = new AbortController();
//
//         try {
//             const initialValue = parseInt(req.body.initialValue);
//
//             // Extracting from URL
//
//             // Початок обчислень
//             const startTime = performance.now();
//
//             // Отримання кількості простих чисел до initialValue
//             let primeCount = 0;
//             for (let i = 2; i <= initialValue; i++) {
//                 if (isPrime(i)) {
//                     primeCount++;
//                 }
//
//                 // Затримка у 100 мілісекунд між ітераціями
//                 await this.sleep(100, abortController.signal);
//             }
//
//             // Кінець обчислень
//             const endTime = performance.now();
//             const duration = endTime - startTime;
//
//             // Запис у базу даних
//             const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
//             const queryParams = [initialValue, duration, primeCount];
//
//             console.log('SQL Query:', insertQuery);
//             console.log('Query Parameters:', queryParams);
//
//             await pool.query(insertQuery, queryParams);
//
//             // Відправка результату у відповідь запиту
//             if (initialValue < 1) {
//                 return res.status(400).json({ error: 'Invalid initial value' });
//             }
//             res.json({ result: primeCount });
//         } catch (err) {
//             console.log(err.toString());
//             res.json({ detail: err.toString() });
//         } finally {
//             abortController.abort(); // Забезпечує аборт, якщо обчислення завершено або виникла помилка
//         }
//     }
// }
//
// module.exports = new CalculationController();
// calculation-controller.js

// const { performance } = require('perf_hooks');
// const { Worker } = require('worker_threads');
// const pool = require('../database');
// const {resolve} = require("path");
//
// class CalculationController {
//     cancelFlags;
//     constructor() {
//         this.cancelFlags = new Map();
//     }
//
//     async sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
//
//     async calculatePrime(req, res) {
//         try {
//             const initialValue = parseInt(req.body.initialValue);
//             const cancelFlag = `cancelFlag_${initialValue}`;
//             this.cancelFlags.set(cancelFlag, false);
//
//             const startTime = performance.now();
//
//             const worker = new Worker(resolve(__dirname, 'primeWorker.js'));
//             let progress = 0;
//
//             worker.on('message', (message) => {
//                 if (message.progress) {
//                     progress = message.progress;
//                     console.log(`Progress: ${progress.toFixed(2)}%`);
//                 } else if (message.result) {
//                     const primeCount = message.result;
//                     const endTime = performance.now();
//                     const duration = endTime - startTime;
//
//                     if (!this.cancelFlags.get(cancelFlag)) {
//                         const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
//                         const queryParams = [initialValue, duration, primeCount];
//                         console.log('SQL Query:', insertQuery);
//                         console.log('Query Parameters:', queryParams);
//                         pool.query(insertQuery, queryParams).then(() => {
//                             console.log('Data inserted into the database.');
//                         }).catch((error) => {
//                             console.error('Error inserting into the database:', error);
//                         });
//                     }
//
//                     res.json({ result: primeCount });
//                 }
//             });
//
//             worker.postMessage({ initialValue });
//
//             // Затримка у 100 мілісекунд між ітераціями
//
//
//             worker.terminate(); // Завершуємо worker після завершення обчислень або в разі відміни
//
//            // console.log('Worker terminated.');
//         } catch (err) {
//             console.log(err.toString());
//             res.json({ detail: err });
//         }
//     }
//
//
// cancelCalculation(initialValue) {
//         const cancelFlag = `cancelFlag_${initialValue}`;
//         this.cancelFlags.set(cancelFlag, true);
//     }
// }
//
// module.exports = new CalculationController();
