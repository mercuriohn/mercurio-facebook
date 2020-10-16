
const chromium = require('chrome-aws-lambda')
//Start the browser and create a browser instance
const faunadb = require('faunadb')

const FB = require('fb');

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
        const data = [{
            id: 1,
            company: "mercurio",
            email: "fun@fun.com",
            city: "tegucigalpa",
            date: "22.22.20",
            ur: "https/url",
            published: false
        }, {
            id: 2,
            company: "mercurio2",
            email: "fun@fun.com",
            city: "tegucigalpa",
            date: "22.22.20",
            ur: "https/url",
            published: false
        }]


        console.log("Function `todo-create` invoked")

        data.map(async (job) => {
            const jobItem = {
                data: {
                    id: job.id,
                    company: job.company,
                    email: job.email,
                    city: job.city,
                    date: job.date,
                    ur: job.ur,
                    published: job.published
                }
            }
            try {
                //const response = await adminClient.query(q.Create(q.Ref("classes/jobs"), jobItem))
                console.log("job response", response);
            } catch (err) {
                console.log(err)
            }
        })

        console.log("job created");

        // facebook feed 
        FB.setAccessToken('EAAE8cHi7s9oBAO0MiBlVx6B5hmnAhZCVBbZBlu6uIJIhdrZBjZC0DD8OayuDmx9SroMhU8xp9dKisHleAkmlQZAq9tqLfCzG3p00jP0y7sFwKEMmXZCVYFwys03o6uxfKL0iseZBvSsqWbLJAfka269wxMMXcHbqDffYEZARiCf37XnKVrJbJ3TBrnuZC0ZAycseAZD');
        FB.api(
            '/mercuriohonduras/feed',
            'POST',
            { "message": "Testing with api from netlify" },
            function (response) {
                console.log(response);
            }
        );



    },
}