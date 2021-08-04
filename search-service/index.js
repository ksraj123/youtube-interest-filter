import express from 'express';

const app = express();

app.get("/search", (req, res) => {
    res.status(200).json({"success": `search-service listening on port ${5000}`})
});

app.listen(5000, () => {
    console.log(`search-service listening on port ${5000}`);
})
