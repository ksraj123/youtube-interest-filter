import express from 'express';

const app = express();

app.get("/results", (req, res) => {
    res.status(200).json({"success": `results-service listening on port ${5000}`})
});

app.listen(5000, () => {
    console.log(`results-service listening on port ${5000}`);
});
