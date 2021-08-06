import express from 'express';
import { validQueryParams } from './middleware/validateQuery.js';
import { paramModel, defaultParams } from './model/paramModel.js';
import { client, checkConnection, createIndexMapping } from './elasticserach.js';

const app = express();

app.get("/dashboard", validQueryParams(paramModel), async (req, res) => {
    const { sortBy, order } = req.query;
    if (await checkConnection(3)) {
        // const sort = {};
        const sortBy = req.query.sortBy || defaultParams.sortBy;
        const order = req.query.order || defaultParams.order;
        const size = req.query.pgSize || 100;
        const page = req.query.page || 0;
        // sort[sortOn] = { order: order || defaultParams.order }
        const search = await client.search({
            index: 'video',
            size: size,
            from: page * size,
            sort: [`${sortBy}:${order}`]
        })
        res.status(200).json({ "success": search.body.hits.hits });
    } else {
        res.status(500).json({ error: "could not connect to elastic search" });
    }
});

app.listen(5000, () => {
    console.log(`dashboard-service listening on port ${5000}`);
});

const setup = async () => {
    await checkConnection(10);
    await createIndexMapping();
}

setup();
