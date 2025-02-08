<script>
  import { enhance } from "$app/forms";
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

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];
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
      <form
        method="POST"
        action="/changetheme"
        use:enhance={(e) =>
          ({ update }) => {
            let theme = e.formData.get("theme");
            if (typeof theme !== "string") return;
            document.documentElement.setAttribute("data-theme", theme);
            update();
          }}
      >
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn m-1">
            Theme: {data.theme}
          </div>
          <ul
            tabindex="-1"
            class="dropdown-content menu flex-nowrap w-[240px] bg-base-100 rounded-box z-[1] p-2 shadow max-h-[300px] overflow-y-scroll"
          >
            {#each themes as theme}
              <li>
                <button
                  data-theme={theme}
                  class="btn m-2"
                  type="submit"
                  name="theme"
                  value={theme}
                >
                  {theme}
                  <span class="flex h-full p-1 shrink-0 gap-1">
                    <span class="bg-primary rounded-badge w-2"></span>
                    <span class="bg-secondary rounded-badge w-2"></span>
                    <span class="bg-accent rounded-badge w-2"></span>
                    <span class="bg-neutral rounded-badge w-2"></span>
                  </span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </form>
    </div>
    <main class="max-w-[800px] mx-auto p-5">
      {@render children()}
    </main>
  </div>
</div>
