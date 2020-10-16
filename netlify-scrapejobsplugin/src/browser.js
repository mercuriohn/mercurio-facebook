const chromium = require('chrome-aws-lambda');


async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        const executablePath = await chromium.executablePath
        browser = await chromium.puppeteer.launch({
            args: await chromium.args,
            executablePath: executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
            headless: true,
        })
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};