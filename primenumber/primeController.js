const pool = require('../database');
const { performance } = require('perf_hooks');

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

class CalculationController {
    constructor() {}

    async calculatePrime(req, res) {
        try {
            const initialValue = parseInt(req.params.initialValue); // Extracting from URL

            // Початок обчислень
            const startTime = performance.now();

            // Отримання кількості простих чисел до initialValue
            let primeCount = 0;
            for (let i = 2; i <= initialValue; i++) {
                if (isPrime(i)) {
                    primeCount++;
                }
            }

            // Кінець обчислень
            const endTime = performance.now();
            const duration = endTime - startTime;

            // Запис у базу даних
            const insertQuery = 'INSERT INTO history (initialValue, duration, result) VALUES ($1, $2, $3)';
            await pool.query(insertQuery, [initialValue, duration, primeCount]);

            // Відправка результату у відповідь запиту
            res.json({ result: primeCount, duration });
        } catch (err) {
            console.log(err.toString());
            res.json({ detail: err });
        }
    }
}

module.exports = new CalculationController();

