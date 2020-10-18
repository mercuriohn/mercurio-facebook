
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

    console.log("index ", index);

    const getQuery = imagesQueries[index];

    console.log("query", getQuery);

    const imageResponse = await axios.post(`https://api.unsplash.com/search/photos/`, {
        query: getQuery,
        client_id: imageToken,
    })

    console.log("imageResponse ", await imageResponse.length);
    console.log("image response object", await imageResponse.map((image) => ({ id: image.id, url: image.small })));
    return [];
    return imageResponse.map((image) => ({ id: image.id, url: image.small }));
}

const getJobs = async () => {
    //query all jobs sorted by id desc
    const JobsById = await adminClient.query(q.Paginate(q.Match(q.Index("jobs_sort_by_id_desc_several_fields"))));

    if (!JobsById.data.length) {
        return []
    }

    //get first 10 jobs that haven't been published on facebook 
    return getJobs.filter((job) => !job[6]).filter((_, index) => index < 11);
}

const jobsFactory = async () => {

    console.log("get images", getImages());
    const images = undefined;
    //clone the images 
    //const images = getImages().map((image) => image);

    // const jobs = getJobs.map((job) => {
    //     const item = {
    //         id: job[0],
    //         title: job[1],
    //         company: job[2],
    //         email: job[3],
    //         city: job[4],
    //         date: job[5],
    //         published: job[6],
    //         link: job[7],
    //         imageUrl: images.shift()
    //     }

    //     return item;
    // })

    // return jobs;
}


module.exports = {
    onPreBuild: async () => {

        console.log("jobs", jobsFactory());

    },
}