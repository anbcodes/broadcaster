# Getting Started (JSON)

Everything can be accessed through the JSON API. You can often just add `.json`
to the end of the web url (for the home page use `/index.json`).

## Basic Flow

Below is a basic example of logging in and adding a post.

```js
const response = await fetch("%URL%/login.json", {
  method: "POST",
  body: JSON.stringify({
    username: "%USER%",
    password: "[your password]",
  }),
});

const session = (await response.json()).session;

await fetch(`%URL%/u/%USER%/p/new.json?s=${session}`, { content: "hello" });
```

This uses the login api endpoint and the p/new.json api endpoint to add the
post. One thing to notice is that the session is a query parameter. In all
requests, it can be a query parameter `s` or a cookie named `session`.

That's it. The API isn't too complex.
