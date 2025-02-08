# Feed

The feed is a list of all the posts a user can see. It is a combination of posts
from the user's friends and posts from the user's groups. The feed is sorted by
the time the post was created.

The Feed API only has one route: `GET /index.json`

## `GET /index.json` - Gets the feed.

This requires you to be logged in.

### Request Format

No parameters.

### Response Format

The response is a list of posts.

```json
[
  {
    "id": "number",
    "username": "string",
    "content": "string",
    "include": "string[]",
    "exclude": "string[]",
    "created": "string",
    "updated": "string"
  },
  ...
]
```

### Possible errors

- `Not logged in`

### Example

Get joe's posts.

```bash
curl '%URL%/index.json?s=i5feho1gg6f3dfo'
```

```json
[
    {
        "id": 26,
        "username": "joe",
        "content": "Hello World!",
        "created": "2025-02-07T20:03:20.705-05:00[America/New_York]",
        "updated": "2025-02-07T20:03:20.705-05:00[America/New_York]",
        "include": ["everyone"],
        "exclude": []
    },
    {
        "id": 25,
        "username": "joe",
        "content": "Bye everyone!",
        "created": "2025-02-07T20:02:41.377-05:00[America/New_York]",
        "updated": "2025-02-07T20:11:52.183-05:00[America/New_York]",
        "include": ["everyone"],
        "exclude": []
    }
]
```
