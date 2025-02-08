# Users

The users API (essentially authentication) consists of the following endpoints:

- [`/register.json` - Register a new user](#register)
- [`/login.json` - Login and get a session](#login)
- [`/logout.json` - Delete a session](#logout)

There is no "API Key" system. Instead, just login with your username and
password and use the session id.

## `/register.json` - Register a new user {#register}

### Request format

```json
{
  "username": "string",
  "password": "string"
}
```

### Response format

```json
{
  "username": "string",
  "created": "string"
}
```

### Possible errors

- `User already exists`
- `Invalid username` - Username must match the rules
  [described below](#username-rules)

### Example

Create a user named `joe` with the password `supersecure`

```bash
curl '%URL%/register.json' \
  -d '{"username": "joe", "password": "supersecure"}' \
  -H "Content-Type: application/json"
```

```json
{
  "username": "joe",
  "created": "2025-02-07T19:38:03.864-05:00[America/New_York]"
}
```

## `/login.json` - Login and get a session {#login}

### Request format

```json
{
  "username": "string",
  "password": "string"
}
```

### Response format

```json
{
  "username": "string",
  "id": "string", // The session id
  "created": "string"
}
```

### Possible errors

- `User does not exist`
- `Invalid password`

### Example

Login with a user named `joe` with the password `supersecure`

```bash
curl '%URL%/login.json' \
  -d '{"username": "joe", "password": "supersecure"}' \
  -H "Content-Type: application/json"
```

```json
{
  "id": "a9n20n5ise8vrsv",
  "username": "joe",
  "created": "2025-02-07T19:41:52.92-05:00[America/New_York]"
}
```

## `/logout.json` - Delete a session {#logout}

> Note: Requires a vaild session (either in `?s=session` or in the session
> cookie)

### Request format

```
{}
```

### Response format

```json
{
  "success": true
}
```

### Possible errors

- `No session` - You are not logged in.

### Example

Logout/delete the session id `a9n20n5ise8vrsv`

```bash
curl '%URL%/logout.json?s=a9n20n5ise8vrsv' \
  -X POST
```

```json
{ "success": true }
```

## Username Rules {#username-rules}

A username can only contain letters and numbers (it must match this regex
`[a-zA-Z0-9_]{3,40}`). It also must be between 3 and 40 characters.
