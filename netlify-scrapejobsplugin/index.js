
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
        let browserInstance = browser.startBrowser();
        const getJobs = await scraperController(browserInstance);
        (await browserInstance).close();
        const JobsById = await adminClient.query(q.Paginate(q.Match(q.Index("jobs_sort_by_first_desc"))));
        const ids = [];

        let filteredData;
        if (JobsById.data.length) {
            filteredData = getJobs.filter((job) => !JobsById.data.some((jobByID) => job.JobID === jobByID[0]));
        }

        //fdfd
        // response.data.map((job) => {
        //     ids.push(job[0]);
        // })
        console.log("Filtered data", filteredData);
        console.log("filtered data size", filteredData.length);

    },
}