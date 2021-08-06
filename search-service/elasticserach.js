import { Client } from '@elastic/elasticsearch';

const elasticUrl = `http://${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}`;

export const client = new Client({ node: elasticUrl });

let elasticConnection = false;

export const checkConnection = (retries) => {
    return new Promise(async (resolve) => {
        if (retries <= 0) {
            console.log('Error: could not connect to elastic search');
            resolve(false);
        }
        console.log("Checking connection to ElasticSearch...");
        while (!elasticConnection) {
            try {
                await client.cluster.health({});
                console.log("Successfully connected to ElasticSearch");
                elasticConnection = true;
            } catch (err) {
                const sleep = 5000;
                console.log(`Error Connecting to Elastic, Retrying in ${sleep} ms`);
                await new Promise(resolve => setTimeout(resolve, sleep));
                if (await checkConnection(retries - 1)) {
                    resolve(true)
                }
            }
        }
        resolve(true);
    });
}

export const createIndexMapping = async () => {
    const exists = await client.indices.exists({
        index: 'video'
    });
    if (exists) {
        console.log('Creating Index Mapping...');
        await client.indices.putMapping({
            index: 'video',
            body: {
                "properties": {
                    "title": {
                        "type": "text",
                        "fielddata": "true"
                    },
                    "channel_title": {
                        "type": "text",
                        "fielddata": "true",
                    },
                    "id": {
                        "type": "text",
                        "fielddata": "true"
                    },
                    "published_at": {
                        "type": "date"
                    }
                }
            }
        })
    } else {
        console.log('Index Not present');
    }
}