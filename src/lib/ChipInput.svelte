<script>
    import { onMount } from 'svelte';

    /**
     * @type {{
     *   chipOptions: string[],
     *   labelid: string,
     * } & import('svelte/elements').HTMLInputAttributes}
     */
    let { chipOptions, value = $bindable(), labelid, class: className, ...inputOptions} = $props();
    let id = Math.random().toString(36).substring(2);

    /** @type {HTMLDivElement | undefined} */
    let element = $state();
    /** @type {HTMLSpanElement | undefined} */
    let searchEl = $state();
    let search = $state("");
    $effect(() => {
        if (value.split(',').length > 1) {
            value = value.split(',').filter(v => v !== 'just you').join(',');
        } else if (value === '') {
            value = 'just you';
        }
    })
    let onKey = (e) => {
        if (e.key === "," || e.key === "Enter" || e.key === ' ') {
            const arr = value.split(',');
            arr.push(search);
            value = arr.join(',');
            search = "";
            e.preventDefault();
        } else if (e.key === "Backspace") {
            if (search === '') {
                value = value.split(",").slice(0, -1).join(",");
                e.preventDefault();
            }
        } else if (e.key.length === 1 && !e.key.match(/^[0-9a-zA-Z#@]$/)) {
            e.preventDefault();
        }
    }
    onMount(() => {
        document.getElementById(labelid)?.addEventListener('click', () => {
            searchEl?.focus();
        })
    })
    const remove = (chip) => {
        if (chip === 'just you') {
            return;
        }
        value = value.split(",").filter(v => v !== chip).join(",");
    }

    /**
     * 
     * @param {string} chip
     */
    const isValid = (chip) => {
        return chip.match(/^just you$|^everyone$|^(#|@)[0-9a-zA-Z]+$/);
    }
</script>

<input bind:value={value} type="text" list="{id}-list" class="{className} jsHidden" {...inputOptions} />
<datalist id="{id}-list">
    {#each chipOptions as option}
        <option value={option}></option>
    {/each}
</datalist>

<div class="{className} outline-none gap-1 jsShown overflow-scroll flex" bind:this={element}>
        {#each value.trim().split(",").map(v => v.trim()).filter(v=>v) as chip}
            <button
                class="btn btn-sm {chip === 'just you' ? 'no-animation' : ''} {!isValid(chip) ? 'btn-error' : ''}"
                type="button"
                onclick={() => remove(chip)}
            >{chip}
                {#if chip !== 'just you'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                {/if}
            </button>
        {/each}
        <input class="min-w-fit" aria-labelledby="{labelid}" type="search" placeholder="" list="{id}-list" bind:this={searchEl} onkeydown={onKey} bind:value={search}>
</div>