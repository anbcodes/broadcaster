<script>
  import "../../app.css";
  let { children, data } = $props();

  let loggedInLinks = {
    Groups: "/u/" + data.user + "/groups",
    Logout: "/logout",
  };

  let loggedOutLinks = {
    Login: "/login",
    Register: "/register",
  };

  let links = Object.entries({
    Home: "/",
    ...(data.user ? loggedInLinks : loggedOutLinks),
    Help: "/docs",
  });
</script>

<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-side z-20">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <div class="flex flex-col py-4 max-w-[500px] w-full h-screen bg-base-100">
      {#each links as [name, href]}
        <a {href} onclick={() => document.getElementById("my-drawer")?.click()}>
          <div class="btn btn-ghost !text-left justify-start w-full">
            {name}
          </div>
        </a>
      {/each}
    </div>
  </div>

  <div class="drawer-content">
    <div class="flex p-2 gap-4">
      {#each links as [name, href]}
        <div class="hidden md:block">
          <a {href} class="link">{name}</a>
        </div>
      {/each}
      <label for="my-drawer" class="btn btn-circle drawer-button md:hidden"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </label>
      <div class="flex-grow"></div>
      <form method="POST" action="/changetheme">
        <button class="btn btn-sm">Theme: {data.theme}</button>
      </form>
    </div>
    <main class="max-w-[800px] mx-auto p-5">
      {@render children()}
    </main>
  </div>
</div>
