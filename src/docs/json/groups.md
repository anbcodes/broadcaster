# Groups

A group is a collection of users. It is a short way to specify a bunch of users.

One important thing to remember about groups is that they are **not** per-user.
Any user can reference any group.

The groups API is split into the following endpoints:

- [`/creategroup.json` - Create a new group](#create)
- [`/u/[user]/g.json` - Get the groups a user is in](#get-user)
- [`/g/[group]/members/add.json` - Add a member](#add-member)
- [`/g/[group]/members/remove.json` - Remove a member](#remove-member)
- [`/g/[group]/members.json` - List the members](#members)
- [`/g/[group]/delete.json` - Remove a group](#delete)

## `/creategroup.json` - Create a new group {#create}

Requires login.

### Request format

```json
{
    "name": "string"
}
```

### Response format

```json
{
    "name": "string",
    "owner": "string"
}
```

### Possible errors

- `Group already exists`
- `Not logged in`
- `Failed to add user to group` - Failed to add the owner into the group.

### Example

`joe` creates a new group called "joes_friends".

```bash
curl '%URL%/creategroup.json?s=i5feho1gg6f3dfo' \
  -d '{"name": "joes_friends"}' \
  -H "Content-Type: application/json"
```

```json
{ "name": "joes_friends", "owner": "joe" }
```

## `/u/[user]/g.json` - Get a user's groups {#get-user}

> Requires login.

### Request format

No parameters.

### Response format

```json
[
  {
    "name": "string",
    "owner": "string",
  },
  ...
]
```

### Possible errors

- `Not logged in`

### Example

Get `joe`'s groups.

```bash
curl '%URL%/u/joe/g.json?s=i5feho1gg6f3dfo'
```

```json
[{ "name": "joes_friends", "owner": "joe" }]
```

## `/g/[group]/members/add.json` - Add a member {#add-member}

Requires login.

### Request format

```json
{
    "username": "string"
}
```

### Response format

```json
{
    "groupname": "string",
    "username": "string"
}
```

### Possible errors

- `Group does not exist` - A group with that name does not exist.
- `Not owner` - You are not the owner.
- `User does not exist` - The user you attempted to add doesn't exist.
- `User already in group` - The user you attempted to add is already in the
  group.

### Example

`joe` adds "bob" to the group "joes_friends"

```bash
curl '%URL%/g/joes_friends/members/add.json?s=i5feho1gg6f3dfo' \
  -d '{"username": "bob"}' \
  -H "Content-Type: application/json"
```

```json
{ "groupname": "joes_friends", "username": "bob" }
```

## `/g/[group]/members/remove.json` - Remove a member {#remove-member}

Requires login.

### Request format

```json
{
    "username": "string"
}
```

### Response format

```json
{
    "groupname": "string",
    "username": "string"
}
```

### Possible errors

- `Group does not exist` - A group with that name does not exist.
- `Not owner` - You are not the owner.
- `User does not exist` - The user you attempted to add doesn't exist.
- `User is not in group` - The user you attempted to add is already in the
  group.

### Example

`joe` removes "bob" from the group "joes_friends"

```bash
curl '%URL%/g/joes_friends/members/remove.json?s=i5feho1gg6f3dfo' \
  -d '{"username": "bob"}' \
  -H "Content-Type: application/json"
```

```json
{ "groupname": "joes_friends", "username": "bob" }
```

## `/g/[group]/members.json` - List the members {#members}

Requires login. Only the owner of the group can list the members.

### Request format

No parameters.

### Response format

```json
{
    "groupname": "string",
    "username": "string"
}
```

### Possible errors

- `Group does not exist` - A group with that name does not exist.
- `Not owner` - You are not the owner.

### Example

`joe` adds "bob" to the group "joes_friends"

```bash
curl '%URL%/g/joes_friends/members.json?s=i5feho1gg6f3dfo'
```

```json
["joe", "bob"]
```

## `/g/[group]/delete.json` - Delete the group {#delete}

Requires login.

### Request format

No parameters.

### Response format

```json
{
    "name": "string",
    "owner": "string"
}
```

### Possible errors

- `Group does not exist` - A group with that name does not exist.
- `Not owner` - You are not the owner.

### Example

`joe` deletes the group "joes_friends".

```bash
curl '%URL%/g/joes_friends/delete.json?s=i5feho1gg6f3dfo' \
  -X POST
```

```json
{ "name": "joes_friends", "owner": "joe" }
```
