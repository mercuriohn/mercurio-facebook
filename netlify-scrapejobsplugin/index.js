const browser = require("./src/browser");
//Start the browser and create a browser instance
const browserInstance = browser.startBrowser();
const url = 'https://rds-empleos.hn/plazas/';

module.exports = {
    onInit: async () => {
        let page = await browserInstance.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(this.url);
        await page.close();
    },
}