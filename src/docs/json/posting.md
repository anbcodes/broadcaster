# Posting

The main functionality of The Broadcaster is posting. A post is just a markdown
string with a list of people who can and can't see it (see
[Permissions](#permissions) for more information).

The Posting API is split into the following endpoints:

- [`/u/[user].json` - Get a user's posts](#get)
- [`/u/[user]/p/add.json` - Create a post](#create)
- [`/u/[user]/p/[post]/edit.json` - Edit a post](#edit)
- `/u/[user]/p/[post]/remove.json` - Remove a post (unimplemented)

## `/u/[user].json` - Get a user's posts {#get}

> Note: Remember to include your session id if you want to see private posts.

### Request format

No parameters.

### Response format

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

None.

### Example

Get `joe`'s posts.

```bash
curl '%URL%/u/joe.json'
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
        "content": "Hi everyone!",
        "created": "2025-02-07T20:02:41.377-05:00[America/New_York]",
        "updated": "2025-02-07T20:02:41.377-05:00[America/New_York]",
        "include": ["everyone"],
        "exclude": []
    }
]
```

## `/u/[user]/p/add.json` - Create a post {#create}

### Request format

```json
{
    "content": "string",
    "include": "string[]",
    "exclude": "string[]"
}
```

### Response format

```json
{
    "id": "number",
    "username": "string",
    "content": "string",
    "include": "string[]",
    "exclude": "string[]",
    "created": "string",
    "updated": "string"
}
```

### Possible errors

- `Not logged in`

### Example

`joe` posts "Hi everyone!" to "everyone".

```bash
curl '%URL%/u/joe/p/add.json?s=i5feho1gg6f3dfo' \
  -d '{"content": "Hi everyone!", "include": ["everyone"]}' \
  -H "Content-Type: application/json"
```

```json
{
    "id": 25,
    "username": "joe",
    "content": "Hi everyone!",
    "created": "2025-02-07T20:02:41.377-05:00[America/New_York]",
    "updated": "2025-02-07T20:02:41.377-05:00[America/New_York]",
    "include": ["everyone"],
    "exclude": []
}
```

## `/u/[user]/p/[post]/edit.json` - Edit a post {#edit}

The edit API is identical to the post API except for the URL.

### Request format

```json
{
    "content": "[string]", // Optional
    "include": "[string[]]", // Optional
    "exclude": "[string[]]" // Optional
}
```

### Response format

```json
{
    "id": "number",
    "username": "string",
    "content": "string",
    "include": "string[]",
    "exclude": "string[]",
    "created": "string",
    "updated": "string"
}
```

### Possible errors

- `Not logged in`

### Example

`joe` updates post '25' to say 'Bye everyone!'.

```bash
curl '%URL%/u/joe/p/25/edit.json?s=i5feho1gg6f3dfo' \
  -d '{"content": "Bye everyone!"}' \
  -H "Content-Type: application/json"
```

```json
{
    "id": 25,
    "username": "joe",
    "content": "Bye everyone!",
    "created": "2025-02-07T20:02:41.377-05:00[America/New_York]",
    "updated": "2025-02-07T20:11:52.183-05:00[America/New_York]",
    "include": ["everyone"],
    "exclude": []
}
```

## Permissions {#permissions}

The include and exclude lists have the following format

- `everyone` means include/exclude everyone.
- `@user` means include/exclude a specific user.
- `#group` means include/exclude a group.

If a user is included (directly, or indirectly through a group), your post will
show up on their feed. If you specify `everyone`, it will be public, but won't
show up on everyone's feeds.

### Examples

- `include: [], exclude: []` - The post is private.
- `include: [everyone], exclude: []` - The post is public.
- `include: [@joe, @bob], exclude: []` - The post will only be visible to joe
  and bob.
- `include: [#mikes_friends], exclude: [@bob]` - The post will be visible to
  everyone in the group #mikes_friends, except bob.
- `include: [everyone], exclude: [@bob]` - The post will be visible to everyone
  but bob (Note: since the post is public, bob can just logout and view it).
