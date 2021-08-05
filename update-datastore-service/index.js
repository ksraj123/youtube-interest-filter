const axios = require('axios')
const queryString = require('query-string');

const { sequelize, Video } = require('./models');

const main = async () => {
    await sequelize.sync();
    getSearchResults();
}

main();

const params = {
    q: 'cricket',
    part: 'snippet',
    maxResults: 10,
    key: 'AIzaSyB9TP1im_u6NJfRwkeYyvRlujkjmClBWEI',
    type: 'video',
    relevanceLanguage: 'en',
    order: 'date' // Resources are sorted in reverse chronological order based on the date they were created
};

const getSearchResults = () => {
    axios.get('https://www.googleapis.com/youtube/v3/search?' + queryString.stringify(params))
        .then((response) => {
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
            Video.bulkCreate(findings)
            .then(() => console.log(User.findAll()))
            .catch(function (err) {
                console.log(err);
            })
        })
        .catch(function (err) {
            console.log(err);
        })
}
