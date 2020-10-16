
const chromium = require('chrome-aws-lambda');
//Start the browser and create a browser instance
const faunadb = require('faunadb');

const axios = require('axios');

const facebook_token = process.env.FACEBOOK_LONG_LIVE_PAGE_ACCESS_TOKEN;
const facebook_page_id = process.env.FACEBOOK_PAGE_ID;

const url = 'https://rds-empleos.hn/plazas/';

const message = `PUESTO: ASESOR DE NEGOCIOS EN MERCADOS\n\n
                 para aplicar contactar este correo pre@sa.com\n\n
                 Lugar: tegucigalpa
                `

q = faunadb.query;

// Once required, we need a new instance with our secret
var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

module.exports = {
    onPreBuild: async () => {
        let axioso = "none";
        // axios 
        const post = await axios.post(`https://graph.facebook.com/${facebook_page_id}/photos`, {
            url: "https://images.unsplash.com/photo-1602526432604-029a709e131c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3NTEwMn0",
            message: message,
            access_token: facebook_token
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