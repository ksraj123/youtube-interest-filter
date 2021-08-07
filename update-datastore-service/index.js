const { getLatestVideo, bulkInsertToDb, readyDb, getNumEntriesDB, seedDb } = require('./db');
const { getResults } = require('./googleApiSearch');

const getPublishedAfter = async () => {
    let publishedAfter = '2021-01-01 05:40:34.616 +00:00';
    try {
        const latestVideo = await getLatestVideo();
        if (latestVideo.length === 0) {
            throw 'DB empty';
        } else {
            publishedAfter = latestVideo[0].dataValues.published_at;
        }
    } catch (err) {
        console.error(err);
    }
    return publishedAfter;
}

const updateDatastore = async () => {
    try {
        const dbEntries = await getNumEntriesDB();
        if (dbEntries !== 0 && dbEntries < Number(process.env.SEED_COUNT)) {
            return await seedDb();
        }
        const publishedAfter = new Date(await getPublishedAfter());
        publishedAfter.setSeconds(publishedAfter.getSeconds() + 1);
        const videos = await getResults({publishedAfter: publishedAfter.toISOString()});
        if (videos && videos.length) {
            await bulkInsertToDb(videos);
        }
    } catch (err) {
        console.log('Error encounterend updating the datastore.');
    }
}

const main = async () => {
    await readyDb();
    setInterval(updateDatastore, Number(process.env.UPDATE_FREQUENCY) * 1000);
}

main();
