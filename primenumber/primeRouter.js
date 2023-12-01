// Your router file
const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const controller = require('./primeController'); // Adjust the path based on your project structure

const router = Router();

router.get(
    '/calculate/:initialValue', // Updated route to accept initialValue from URL
    [
        check('initialValue', 'Invalid initial value').isInt(),
    ],
    (req, res) => controller.calculatePrime(req, res)
);

module.exports = router;
