
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

        let jobItems = [];

        if (getJobs.length) {
            //query all jobs sorted by id desc
            const JobsById = await adminClient.query(q.Paginate(q.Match(q.Index("jobs_sort_by_first_desc"))));
            //filter those job that are not in the database 
            const filteredData = getJobs.filter((job) => !JobsById.data.some((jobByID) => job.JobID === jobByID[0]));
            console.log("filtered data size", filteredData.length);
            //prepare the data
            filteredData.map((data) => {
                const jobItem = {
                    data: {
                        id: data.JobID,
                        timestamp: new Date().getTime(),
                        title: data.JobTitle,
                        company: data.JobCompany,
                        email: data.JobEmail,
                        city: data.JobCity,
                        date: data.JobDate,
                        link: data.JobUrl,
                        facebookPost: false,
                        postedAt: null
                    }
                }

                jobItems.push(jobItem);

            })

        }
        console.log("job items", jobItems);
        jobItems.forEach((job, index) => {
            console.log("create job", index);
            await createJob(index);
        })

        const createJob = async (index) => {
            try {
                const response = await adminClient.query(q.Create(q.Ref("classes/jobs"), jobItems[index]))
                console.log("job created...", response);
            } catch (err) {
                console.log(err)
            }
        }

        console.log("scrape process finished...");

    },
}