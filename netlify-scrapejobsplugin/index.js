
const faunadb = require('faunadb');

const browser = require('./src/browser');

const scraperController = require('./src/pageController');

//const url = 'https://rds-empleos.hn/plazas/';

q = faunadb.query;

// Once required, we need a new instance with our secret
var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

module.exports = {
    onPreBuild: async () => {
        //Start the browser and create a browser instance
        // let browserInstance = browser.startBrowser();
        // const getJobs = await scraperController(browserInstance);
        // (await browserInstance).close();
        // console.log("the jobs data", getJobs);
        const response = await adminClient.query(q.Paginate(q.Match(q.Index("people_sort_by_first_desc"))));
        console.log("data", response.data);

    },
}