# Dashboard Service

Nginx routes requests on `/api/dashboard` endpoint to the dashboard service and removes `/api`.

`GET` request on `/api/dashboard`

expected params and values

`sortBy` - `published_at`, `title`, `id`, `channel_title`
`order` - `asc`, `desc`
`pgSize` - numeric string - number of elements in a page
`page` - numeric string - page number

Sample Request - `/api/dashboard?sortBy=published_at&order=desc`

Interaction with elastic search directly through Kibana dev tools

    GET video/_search
    {
        "size": "100",
        "sort": [
            {"id": {"order": "asc"}}
        ] 
    }

