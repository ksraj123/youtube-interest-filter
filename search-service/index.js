import express from 'express';
import { client, checkConnection } from './elasticserach.js';

const app = express();

app.get("/search", async (req, res) => {
    const q = req.query.q;
    const size = req.query.pgSize || 100;
    const page = req.query.page || 0;

    const search = await client.search({
        index: 'video',
        size: size,
        from: page * size,
        body: {
            query: {
                multi_match: {
                    query: q,
                    fields: ['title^3', 'description']
                }
            }
        }
    })

    const hits = search.body.hits.hits;
    res.status(200).json({ "success": search.body.hits.hits })
});

app.listen(5000, () => {
    console.log(`search-service listening on port ${5000}`);
})


const main = () => {
    checkConnection();
};

main();
