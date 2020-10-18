
const faunadb = require('faunadb');

const axios = require('axios');

q = faunadb.query;

// Once required, we need a new instance with our secret
var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

const imageToken = process.env.UNSPLASH_TOKEN;

const imagesQueries = ["office people", "people+working", "people at the office", "bussines", "bussines people"];


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getImages = async () => {

    const index = getRandomInt(0, imagesQueries.length - 1);

    const getQuery = imagesQueries[index];

    const imageResponse = await axios.get(`https://api.unsplash.com/search/photos/?query=${getQuery}&client_id=${imageToken}`);

    //console.log("imageResponse ", imageResponse.data.results.length);

    const images = imageResponse.data.results.map((image) => ({ id: image.id, url: image.urls.small }));

    //console.log("images response structure", images);

    return images;

}

const getJobs = async () => {
    //query all jobs sorted by id desc
    const JobsById = await adminClient.query(q.Paginate(q.Match(q.Index("jobs_sort_by_id_desc_several_fields"))));

    if (!JobsById.data.length) {
        return []
    }

    //get first 10 jobs that haven't been published on facebook 
    return JobsById.data.filter((job) => !job[6]).filter((_, index) => index < 10);
}

const jobsFactory = async () => {

    //clone the images 
    //const images = getImages().map((image) => image);

    const images = await getImages();
    const jobs = await getJobs();

    //console.log("the images", images);

    //console.log("get jobs", jobs);

    const jobsToPublish = jobs.map((job) => {
        const picture = images.shift();
        const refID = job[8].toString().split(",")[1].match(/"(.*?)"/)[1];
        const item = {
            id: job[0],
            title: job[1],
            company: job[2],
            email: job[3],
            city: job[4],
            date: job[5],
            published: job[6],
            link: job[7],
            ref: refID,
            imageUrl: picture ? picture.url : null
        }

        return item;
    })

    return jobsToPublish;
}


module.exports = {
    onEnd: async () => {

        const facebook_token = process.env.FACEBOOK_LONG_LIVE_PAGE_ACCESS_TOKEN;

        const facebook_page_id = process.env.FACEBOOK_PAGE_ID;

        const jobsUpdated = [];

        const publishedFacebookPromise = [];

        const jobs = await jobsFactory();

        const reverseJobs = jobs.reverse();

        reverseJobs.forEach(async (jobElement) => {


            const message = `PUESTO: ${jobElement.title}\n\n
            🏢 Empresa:${jobElement.company}\n\n
            ✉️ 📞 Como aplicar 👉🏼 ${jobElement.email}\n\n
            Lugar del empleo: ${jobElement.city}\n\n
            🗓 Fecha para aplicar ${jobElement.date} 🤞🏽`;

            if (jobElement.imageUrl) {
                // axios 
                const post = axios.post(`https://graph.facebook.com/${facebook_page_id}/photos`, {
                    url: jobElement.imageUrl,
                    message: message,
                    access_token: facebook_token
                })
                publishedFacebookPromise.push(post);

            } else {
                // axios 
                const post = axios.post(`https://graph.facebook.com/${facebook_page_id}/feed`, {
                    message: message,
                    access_token: facebook_token
                })
                publishedFacebookPromise.push(post);
            }

        })

        let numberOfJobsPublished = 0;

        const jobsOnFacebook = await Promise.all(publishedFacebookPromise);
        jobsOnFacebook.forEach((element, index) => {
            numberOfJobsPublished++;
            console.log("No of jobs published", index);
        });

        if (numberOfJobsPublished) console.log(`${numberOfJobsPublished} have been published`);



        if (jobsOnFacebook.length) {
            jobs.forEach(async (element) => {
                const res = await adminClient.query(q.Update(q.Ref(q.Collection('jobs'), element.ref),
                    { data: { facebookPost: true } }));
                jobsUpdated.push(res);

            });

            const updatedJobs = await Promise.all(jobsUpdated);

            let numberOfJobsUpdated = 0;

            updatedJobs.forEach((item, index) => {
                numberOfJobsUpdated++
                console.log("jobs updated", index);
            })
            console.log("number of jobs updated", numberOfJobsUpdated);
        } else {
            console.log("no jobs updated in the database");
        }




    },
}