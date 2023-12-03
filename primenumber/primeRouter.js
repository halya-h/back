const { Router } = require('express');
const { check } = require('express-validator');
const PrimeController = require('./primenumber.controller'); // Adjust the path based on your project structure

const router = Router();
const primeController = new PrimeController(); // Instantiate the controller

router.post(
    '/calculate',
    [
        check('initialValue', 'Invalid initial value').isInt(),
    ],
    (req, res) => primeController.calculatePrime(req, res)
);

module.exports = router;
// router.post('/cancel', (req, res) => {
//     const { initialValue } = req.body;
//     controller.cancelCalculation(initialValue);
//     res.json({ message: 'Calculation cancelled' });
// });


