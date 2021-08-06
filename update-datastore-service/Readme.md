# Google Youtube API Considerations

- The Youtube API retuns results in a paginated form, the number of responses in a page could be set with `maxResults` property but it could be only between `0` and `50`.

- The results could be ordered with the `order` property which could take in the following values, `date`, `rating`, `relavence`, `title`, `videoCount`, `viewCount`. The `date` option given search results in reverse cronological order i.e. newest resutls first.

The application gets videos from a default date it its first call to Google API but only upto 50 videos are retrieved in the first call, if there are less videos in the DB than `SEED_COUNT` env var which is the least number videos that should be present in the DB then it fetches videos before the earliest video currently in DB until the seed count is met. Fetching latest videos would resume only after meeting the seed count.

Please refer to root Readme for other information.
