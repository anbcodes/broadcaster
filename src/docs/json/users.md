# Users

The users API (essentially authentication) consists of the following endpoints:

- [`/createuser.json` - Register a new user](#createuser)
- [`/login.json` - Login and get a session](#login)
- [`/logout.json` - Delete a session](#logout)

There is no "API Key" system. Instead, just login with your username and password and use the session id.

## `/createuser.json` - Register a new user {#createuser}

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
  "hash": "string",
  "created": "string"
}
```

### Possible errors

- `User already exists`
- `Invalid username` - Username must match the rules [described below](#username-rules)

### Example

Create a user named `joe` with the password `supersecure`

```js
const response = await fetch("%URL%/createuser.json", {
  method: "POST",
  body: JSON.stringify({
    username: "joe",
    password: "supersecure",
  }),
});
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

```js
const response = await fetch("%URL%/login.json", {
  method: "POST",
  body: JSON.stringify({
    username: "joe",
    password: "supersecure",
  }),
});

console.log("Your session is: ", response.id);
```

## `/logout.json` - Delete a session {#logout}

> Note: Requires a vaild session (either in `?s=session` or in the session cookie)

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

Logout/delete the session id `sipibxelb9gwf0y`

```js
const response = await fetch("%URL%/logout.json?s=sipibxelb9gwf0y", {
  method: "POST",
});

console.log("Response: ", response.success || response.error);
```

## Username Rules {#username-rules}

A username can only contain letters and numbers (it must match this regex `[a-zA-Z0-9_]{3,40}`). It also must be between 3 and 40 characters.
