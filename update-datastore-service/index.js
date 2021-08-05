const axios = require('axios')
const queryString = require('query-string');

const { sequelize, Video } = require('./models');

const main = async () => {
    await sequelize.sync();
    getSearchResults();
}

main();

const API_KEYS = process.env.GOOGLE_API_KEYS.split(' ')
    .map(encoded => Buffer.from(encoded, 'base64')
        .toString('ascii'));

let currentKeyIndex = 0;
let retries = API_KEYS.length;
let publishedAfter = new Date('2021-01-01 05:40:34.616 +00:00').toISOString();

const params = {
    q: 'cricket',
    part: 'snippet',
    maxResults: Number(process.env.MAX_RESULTS),
    key: API_KEYS[currentKeyIndex],
    type: 'video',
    relevanceLanguage: 'en',
    publishedAfter: publishedAfter,
    order: 'date' // Resources are sorted in reverse chronological order based on the date they were created
};

const getSearchResults = () => {
    axios.get('https://www.googleapis.com/youtube/v3/search?' + queryString.stringify(params))
        .then((response) => {
            retries = API_KEYS.length;
            const findings = response.data.items.map((item) => {
                const link = 'https://www.youtube.com/watch?v=' + item.id.videoId;
                const id = item.id.videoId;
                return {
                    id: id,
                    link: link,
                    kind: item.id.kind,
                    title: item.snippet.title,
                    channelId: item.snippet.channelId,
                    publishedAt: item.snippet.publishedAt,
                    description: item.snippet.description,
                    channelTitle: item.snippet.channelTitle,
                    thumbnail: item.snippet.thumbnails.default.url
                }
            })
        })
        .catch((err) => {
            console.log(err);
            if (retries > 0) {
                if (currentKeyIndex === API_KEYS.length - 1) {
                    currentKeyIndex = 0;
                } else {
                    currentKeyIndex++;
                    retries--;
                    getSearchResults();
                }
            }
        })
}
