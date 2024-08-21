import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

const getUsdRate = async () => {
    try {
        const response = await fetch('https://api.monobank.ua/bank/currency');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const usdRate = data.find(rate => rate.currencyCodeA === 840 && rate.currencyCodeB === 980);

        return usdRate ? {
            currencyCodeA: usdRate.currencyCodeA,
            currencyCodeB: usdRate.currencyCodeB,
            rateBuy: usdRate.rateBuy,
            rateSell: usdRate.rateSell
        } : null;
    } catch (error) {
        throw new Error(error.message);
    }
};


app.get('/', async (req, res) => {
    try {
        const usdRate = await getUsdRate();
        if (usdRate) {
            res.json({
                message: 'Курс долара к гривні',
                usdRate
            });
        } else {
            res.status(404).json({ error: 'Курс долара не найден' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Помилка: ' + error.message });
    }
});


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});