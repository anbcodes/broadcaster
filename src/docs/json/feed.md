# Feed

The feed is a list of all the posts a user can see. It is a combination of posts
from the user's friends and posts from the user's groups. The feed is sorted by
the time the post was created.

The Feed API only has two routes:

- [`GET /index.json` - Gets the feed.](#get)
- [`GET /watch.json` - Returns a SSR event stream of the feed.](#watch)

## `GET /index.json` - Gets the feed. {#get}

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

## `GET /watch.json` - Watches the feed. {#watch}

This requires you to be logged in.

### Request Format

No parameters.

### Response Format

The response is a
[Server Sent Event](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
stream of posts in JSON format.

```text
id: number
event: message
data: {"id": "number", "username": "string", "content": "string", "include": "string[]", "exclude": "string[]", "created": "string", "updated": "string"}

...
```

### Possible errors

- `Not logged in`

### Example

Watch for new posts

```bash
curl '%URL%/watch.json?s=i5feho1gg6f3dfo'
```

```text
id: 1
event: message
data: {"id":34,"username":"test2","content":"test","created":"2025-02-08T13:34:42.768-05:00[America/New_York]","updated":"2025-02-08T13:34:42.768-05:00[America/New_York]","include":[],"exclude":[]}

id: 2
event: message
data: {"id":35,"username":"test2","content":"nice","created":"2025-02-08T13:34:47.089-05:00[America/New_York]","updated":"2025-02-08T13:34:47.089-05:00[America/New_York]","include":[],"exclude":[]}
```
