import express from 'express';
import { Client } from '@elastic/elasticsearch';

const elasticUrl = `http://${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}`;
console.log(elasticUrl);

const client = new Client({ node: elasticUrl });

const app = express();

const checkConnection = () => {
    return new Promise(async (resolve) => {
        console.log("Checking connection to ElasticSearch...");
        let isConnected = false;
        while (!isConnected) {
            try {
                await client.cluster.health({});
                console.log("Successfully connected to ElasticSearch");
                isConnected = true;
            } catch (err) {
                const sleep = 5000;
                console.log(`Error Connecting to Elastic, Retrying in ${sleep} ms`);
                await new Promise(resolve => setTimeout(resolve, sleep));
            }
        }
        resolve(true);
    });
}

app.get("/search", (req, res) => {
    res.status(200).json({ "success": `search-service listening on port ${5000}` })
});

app.listen(5000, () => {
    console.log(`search-service listening on port ${5000}`);
})

checkConnection();
