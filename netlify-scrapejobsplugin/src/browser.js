const chromium = require('chrome-aws-lambda');

async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await chromium.puppeteer.launch({
            executablePath: await chromium.executablePath,
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless,
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};