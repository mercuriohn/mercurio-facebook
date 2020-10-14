const browser = require("./src/browser");
//Start the browser and create a browser instance

const url = 'https://rds-empleos.hn/plazas/';

module.exports = {
    onPreBuild: async () => {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(this.url);
        await page.close();
        await browser.close();
    },
}