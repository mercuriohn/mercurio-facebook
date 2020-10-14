
const chromium = require('chrome-aws-lambda')
//Start the browser and create a browser instance

const url = 'https://rds-empleos.hn/plazas/';

module.exports = {
    onPreBuild: async () => {
        const executablePath = await chromium.executablePath
        const browser = await chromium.puppeteer.launch({
            args: await chromium.args,
            executablePath: executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
            headless: true,
          })
        const page = await browser.newPage();

        await page.goto(url);
        const screenshot = await page.screenshot({ encoding: 'binary' });

        await browser.close();

    },
}