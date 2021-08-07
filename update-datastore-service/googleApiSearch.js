const axios = require('axios')
const queryString = require('query-string');

const API_KEYS = process.env.GOOGLE_API_KEYS.split(' ')
    .map(encoded => Buffer.from(encoded, 'base64')
        .toString('ascii'));

let currentKeyIndex = 0;
let retries = API_KEYS.length;

const params = {
    q: 'cricket',
    type: 'video',
    order: 'date',
    maxResults: 50,
    part: 'snippet',
    relevanceLanguage: 'en',
};

const getResults = async (paramUpdates) => {
    const callParams= {...paramUpdates, ...params, key: API_KEYS[currentKeyIndex]};
    try {
        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/search?' + queryString.stringify(callParams))
        retries = API_KEYS.length;
        const findings = response.data.items.map((item) => {
            const link = 'https://www.youtube.com/watch?v=' + item.id.videoId;
            const id = item.id.videoId;
            return {
                id: id,
                link: link,
                kind: item.id.kind,
                title: item.snippet.title,
                channel_id: item.snippet.channelId,
                published_at: item.snippet.publishedAt,
                description: item.snippet.description,
                channel_title: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.default.url
            }
        });
        return findings;
    } catch (err) {
        if (retries > 0) {
            if (JSON.stringify(err?.response?.data?.error).indexOf('quotaExceeded') !== -1) {
                console.error('Error: quota execeeded for API key, trying with different key');
                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                retries--;
                return await getResults(paramUpdates);
            }
        } else {
            console.error('Error: Call to Google API failed.');
            console.error(err.response.data);
        }
    }
}

module.exports = {
    getResults
}