
const chromium = require('chrome-aws-lambda')
//Start the browser and create a browser instance
const faunadb = require('faunadb')

const url = 'https://rds-empleos.hn/plazas/';

q = faunadb.query;

// Once required, we need a new instance with our secret
var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

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

        const jobItem = {
            data: {
                id: 1,
                company: "mercurio",
                email: "fun@fun.com",
                city: "tegucigalpa",
                date: "22.22.20",
                ur: "https/url",
                published: false
            }
        }

        console.log("Function `todo-create` invoked")

        try {
            const response = await client.query(q.Create(q.Ref("classes/jobs"), jobItem))
            console.log("job created");
        } catch (err) {
            alert(err); // TypeError: failed to fetch
        }


    },
}