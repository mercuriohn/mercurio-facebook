
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
//Start the browser and create a browser instance

const url = 'https://rds-empleos.hn/plazas/';

module.exports = {
    onPreBuild: async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
        const page = await browser.newPage();

        await page.goto(url);
        const screenshot = await page.screenshot({ encoding: 'binary' });

        await browser.close();

    },
}