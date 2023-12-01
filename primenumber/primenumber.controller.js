
const { PrimeService } = require('./primenumber.service'); // Assuming you have a PrimeService
const { DataSource } = require('typeorm');
const { InjectDataSource } = require('@nestjs/typeorm');

class PrimeController {
    constructor(PrimeService, DataSource) {
        this.primeService = PrimeService;
        this.dataSource =  DataSource;
    }

    @Sse('/calculate')
    ssePrimes(@Query('count') count) {
        return new Observable(subscriber => {
            this.primeService.calculatePrimes(count, (progress) => {
                subscriber.next({ data: { result: progress } });
            }).then(async (result) => {
                const insertHistoryQuery = `
                    INSERT INTO history ("initialValue", "result", "duration")
                    VALUES ($1, $2, $3)`;
                subscriber.next({ data: { result } });
                await this.dataSource.query(insertHistoryQuery, [result.values, result.duration, count]);
                subscriber.complete();
            }).catch((error) => {
                subscriber.error({ data: { error: error.message } });
            });
        });
    }

    @Post('cancel/:id')
    cancelCalculation(@Param('id') id) {
        this.primeService.cancelCalculation(id);
    }

    @Get('/history')
    async getPrimesHistory(@Res() res, @Req() req) {
        const query = 'SELECT * FROM history';
        const history = await this.dataSource.query(query, []);
        res.send(history);
    }
}

module.exports = PrimeController;
