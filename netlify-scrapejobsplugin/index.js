
const chromium = require('chrome-aws-lambda');
//Start the browser and create a browser instance
const faunadb = require('faunadb');

const axios = require('axios');

//const token = 'EAAE8cHi7s9oBACDXzZCbgOI9SdWcR8wCxbhZB6JIai3ZBmHJjRWVbgycMV7eiHcwZAfOY2opvz4J4QBxIci2Ilul5aEbOiRDvPMmm4TuqZBb16iOjLkXirgAioV9Ky4sh37lBnrOBjCToau9iCgUgNBaywBXHGVL81wp7lje1Hrnw6YuSkEMpcpiZCOUsUJAYZD';
const facebook_token = process.env.FACEBOOK_ACCESS_TOKEN
const url = 'https://rds-empleos.hn/plazas/';

q = faunadb.query;

// Once required, we need a new instance with our secret
var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

module.exports = {
    onPreBuild: async () => {
        let axioso = "none";
        // axios 
        const post = await axios.post('https://graph.facebook.com/1635252116764210/feed', {
            message: 'hello fans netlify',
            access_token: token
        })
        axioso = post.data;

        console.log("axios", axioso);

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

        // const jobItem = {
        //     data: {
        //         id: 1,
        //         company: "mercurio",
        //         email: "fun@fun.com",
        //         city: "tegucigalpa",
        //         date: "22.22.20",
        //         ur: "https/url",
        //         published: false
        //     }
        // }

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
                const response = await adminClient.query(q.Create(q.Ref("classes/jobs"), jobItem))
                console.log("job response", response);
            } catch (err) {
                console.log(err)
            }
        })

        console.log("job created");

    },
}