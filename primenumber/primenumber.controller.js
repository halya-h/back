
const PrimeService = require('./primenumber.service');
 // Assuming you have a PrimeService
//
const pool = require("../database");

class PrimeController {
    constructor() {
        this.primeService = new PrimeService();
        this.calculatePrime = this.calculatePrime.bind(this);
        console.log('CalculationService instantiated:', this.primeService);
    }

    calculatePrime(req, res) {
        const initialValue = parseInt(req.body.initialValue);
        try {
            console.log('Inside calculatePrime:', this);
            const result = this.primeService.calculatePrimes(initialValue, (progressData) => {
                console.log(progressData);

                res.write(`event: progress\ndata: ${JSON.stringify({
                    calculationId: progressData.id,
                    percents: progressData.percents,
                    currentValue: progressData.value,
                })}\n\n`);
            });
            result.then(async (result) => {
                console.log(`Calculation ${result.id} completed. Result: ${result.primeCount}`);

                res.write(`event: complete\ndata: ${JSON.stringify({
                    calculationId: result.id,
                    result: result.primeCount,
                })}\n\n`);

                try {
                    const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
                    const queryParams = [initialValue, result.duration, result.primeCount];
                    console.log('SQL Query:', insertQuery);
                    console.log('Query Parameters:', queryParams);
                     pool.query(insertQuery, queryParams).then(() => {
                        console.log('Data inserted into the database.');
                     }).catch((error) => {
                        console.error('Error inserting into the database:', error);
                    });
                } catch (e) {
                    console.log(e);
                }

                res.end();
            }).catch((error) => {
                console.error('Calculation error:', error);

                res.write(`event: error\ndata: ${JSON.stringify({
                    error: 'Calculation error',
                })}\n\n`);

                res.end();
            });

        } catch (error) {
            console.error('Error calculating Prime:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    // calculatePrime(req, res) {
    //     const initialValue = parseInt(req.body.initialValue);
    //
    //     // Set SSE headers
    //     res.writeHead(200, {
    //         'Content-Type': 'text/event-stream',
    //         'Cache-Control': 'no-cache',
    //         'Connection': 'keep-alive'
    //     });
    //
    //     try {
    //         const result = this.primeService.calculatePrimes(initialValue, (progressData) => {
    //             res.write(`event: progress\ndata: ${JSON.stringify({
    //                 calculationId: progressData.id,
    //                 percents: progressData.percents,
    //                 currentValue: progressData.value,
    //             })}\n\n`);
    //         });
    //
    //         result.then(async (result) => {
    //             res.write(`event: complete\ndata: ${JSON.stringify({
    //                 calculationId: result.id,
    //                 result: result.values,  // Assuming 'values' is the correct property
    //             })}\n\n`);
    //
    //             // Extract duration and primeCount from the result
    //             const { count: primeCount, duration } = result;
    //
    //             try {
    //                 const insertQuery = 'INSERT INTO history (initialvalue, duration, result) VALUES ($1, $2, $3)';
    //                 const queryParams = [initialValue, duration, primeCount];
    //
    //                 // Ensure that the 'pool' is properly configured and available
    //                 pool.query(insertQuery, queryParams)
    //                     .then(() => console.log('Data inserted into the database.', primeCount, duration))
    //                     .catch((error) => console.error('Error inserting into the database:', error));
    //             } catch (e) {
    //                 console.error(e);
    //             }
    //
    //             res.end();
    //         }).catch((error) => {
    //             console.error('Calculation error:', error);
    //             res.write(`event: error\ndata: ${JSON.stringify({
    //                 error: 'Calculation error',
    //             })}\n\n`);
    //             res.end();
    //         });
    //     } catch (error) {
    //         console.error('Error calculating Prime:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

    }


module.exports = PrimeController;
// @Sse('/calculate')
// ssePrimes(@Query('count') count) {
//     return new Observable(subscriber => {
//         this.primeService.calculatePrimes(count, (progress) => {
//             subscriber.next({ data: { result: progress } });
//         }).then(async (result) => {
//             const insertHistoryQuery = `
//                 INSERT INTO history ("initialValue", "result", "duration")
//                 VALUES ($1, $2, $3)`;
//             subscriber.next({ data: { result } });
//             await this.dataSource.query(insertHistoryQuery, [result.values, result.duration, count]);
//             subscriber.complete();
//         }).catch((error) => {
//             subscriber.error({ data: { error: error.message } });
//         });
//     });
// }
//
// @Post('cancel/:id')
// cancelCalculation(@Param('id') id) {
//     this.primeService.cancelCalculation(id);
// }

// @Get('/history')
// async getPrimesHistory(@Res() res, @Req() req) {
//     const query = 'SELECT * FROM history';
//     const history = await this.dataSource.query(query, []);
//     res.send(history);
// }