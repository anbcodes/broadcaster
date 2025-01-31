Always use svelte 5 runes instead of old svelte 4 syntax. Below is an example:
```
let count = 0; // old
let count = $state(0); // new (correct)
```
