const scraperObject = {
    url: 'https://rds-empleos.hn/plazas/',
    async scraper(browser) {
        //open a new page
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        let scrapedData = [];
        async function scrapeCurrentPage() {
            // Wait for the required DOM to be rendered
            await page.waitForSelector('.inner-content');

            // Get the link to all the required books
            let urls = await page.$$eval('ul.listService > li', links => {
                // Extract the links from the data
                links = links.map(el => el.querySelector('.listWrpService h3 > a').href)
                return links;

            });

            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage();
                await newPage.goto(link);
                dataObj['JobTitle'] = await newPage.$eval('div.col-md-8 h3.pull-left', node => node.innerText.trim());
                dataObj['JobCompany'] = await newPage.$eval('.col-md-8 p', node => node.innerText.trim());
                dataObj['JobEmail'] = await newPage.$eval('.jobdetail > p', node => node.innerText.trim());
                dataObj['JobCity'] = await newPage.$eval('ul.featureInfo li:nth-child(1)', node => node.innerText.trim().replace('Distrito Central, FM', 'Tegucigalpa'));
                //dataObj['JobDepartment'] = await select(newPage).getElement('ul.featureInfo li:first-of-type');
                dataObj['JobDate'] = await newPage.$eval('ul.featureInfo li:nth-child(2)', node => node.innerText.trim());
                dataObj['JobID'] = link.substring(link.lastIndexOf('/') + 1);
                dataObj['JobUrl'] = link;
                resolve(dataObj);
                await newPage.close();
            });

            for (link in urls) {
                let currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
            }
            // When all the data on this page is done, click the next button and start the scraping of the next page
            // You are going to check if this button exist first, so you know if there really is a next page.
            let nextButtonExist = false;
            try {
                const nextButton = await page.$eval('ul.pagination li.active + li > a', a => a.textContent);
                nextButtonExist = true;
                if (scrapedData.length === 10) {
                    nextButtonExist = false;
                }
            }
            catch (err) {
                nextButtonExist = false;
            }

            if (nextButtonExist) {
                const nextButton = await page.$eval('ul.pagination li.active + li > a', a => a.href);
                await page.goto(nextButton);
                return scrapeCurrentPage(); // Call this function recursively
            }
            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        console.log("give me data", data);
        return data;
    }
}

module.exports = scraperObject;