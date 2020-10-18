
const faunadb = require('faunadb');

const axios = require('axios');

q = faunadb.query;

// Once required, we need a new instance with our secret
var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

const imageToken = process.env.UNSPLASH_TOKEN;

const imagesQueries = ["office people", "people+working", "people at the office", "bussines", "jobs", "bussines people", "happy people", "people"];


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getImages = async () => {

    const index = getRandomInt(0, imagesQueries.length - 1);

    const getQuery = imagesQueries[index];

    const imageResponse = await axios.get(`https://api.unsplash.com/search/photos/?query=${getQuery}&client_id=${imageToken}`);

    console.log("imageResponse ", imageResponse.data.results.length);

    const images = imageResponse.data.results.map((image) => ({ id: image.id, url: image.urls.small }));

    console.log("images response structure", images);

    return images;
}

const getJobs = async () => {
    //query all jobs sorted by id desc
    const JobsById = await adminClient.query(q.Paginate(q.Match(q.Index("jobs_sort_by_id_desc_several_fields"))));

    if (!JobsById.data.length) {
        return []
    }

    //get first 10 jobs that haven't been published on facebook 
    return JobsById.data.filter((job) => !job[6]).filter((_, index) => index < 11);
}

const jobsFactory = async () => {

    //clone the images 
    //const images = getImages().map((image) => image);

    const images = await getImages();
    const jobs = await getJobs();

    console.log("the images", image);

    console.log("get jobs", job);

    const jobsToPublish = jobsToPublish.map((job) => {
        const item = {
            id: job[0],
            title: job[1],
            company: job[2],
            email: job[3],
            city: job[4],
            date: job[5],
            published: job[6],
            link: job[7],
            imageUrl: images.shift()
        }

        return item;
    })

    return jobs;
}


module.exports = {
    onPreBuild: async () => {

        console.log("jobs", await jobsFactory());

    },
}