
const chromium = require('chrome-aws-lambda');
//Start the browser and create a browser instance

const url = 'https://rds-empleos.hn/plazas/';

module.exports = {
    onPreBuild: async () => {
        const browser = await chromium.puppeteer.launch({
            executablePath: await chromium.executablePath,
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless,
        });
        const page = await browser.newPage();

        await page.goto(url);
        const screenshot = await page.screenshot({ encoding: 'binary' });

        await browser.close();

    },
}