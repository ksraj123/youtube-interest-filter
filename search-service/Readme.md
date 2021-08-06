# Search Service

Nginx routes requests on `/api/search` endpoint to the dashboard service and removes `/api`.

`GET` request on `/api/search`

expected params and values

`q` - string - search term
`pgSize` - numeric string - number of elements in a page
`page` - numeric string - page number

Sample Request - `/api/search?q=Kohli&pgSize=10&page=2`

Interaction with elastic search directly through Kibana dev tools

    GET video/_search
    {
        "query": {
            "multi_match": {
            "query": "Kohli Virat",
            "fields": [
                "title^3", 
                "description"
                ]
            }
        }
    }

We use multi match search provided by Elastic which ensures that the works `Virat Kohli` if present in any of the entries in the title and description field in any order, it will considered relavent to our search. Also it supports fuzzy search and could give relavent results even for mis spelled words. We have given importance (^3) to title over description of ranking different search results, the search results are sorted according to decreasing order of relavence.
