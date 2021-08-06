const { getResults } = require('./googleApiSearch');
const { sequelize, Video } = require('./models');

const getEarliestVideo = async () => {
    const earliestVideo = await Video.findAll({
        limit: 1,
        order: [['published_at', 'ASC']]
    });
    return earliestVideo[0];
}

const getLatestVideo = async () => {
    const latestVideo = await Video.findAll({
        limit: 1,
        order: [['published_at', 'DESC']]
    });
    return latestVideo;
}

const bulkInsertToDb = async (data) => {
    try {
        await Video.bulkCreate(data)
        console.log(`Sucessfully Inserted ${data.length} records to DB`);
    } catch(err) {
        console.log(err)
    }
}

const seedDb = async () => {
    const earliestVideo = await getEarliestVideo();
    const publishedBefore = new Date(earliestVideo.published_at);
    publishedBefore.setSeconds(publishedBefore.getSeconds() - 1);
    const findings = await getResults({publishedBefore: publishedBefore.toISOString()});
    await bulkInsertToDb(findings);
}

const getNumEntriesDB = async () => {
    return await Video.count({});
};

const readyDb = async () => {
    await sequelize.sync();
}

module.exports = {
    getEarliestVideo,
    getNumEntriesDB,
    bulkInsertToDb,
    getLatestVideo,
    readyDb,
    seedDb,
}
