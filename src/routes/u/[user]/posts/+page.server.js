import { fail } from '@sveltejs/kit';

export const actions ={
    default: async ({request, fetch}) => {
        const form = await request.formData();
        const content = form.get('content') ?? '';
        const viewableTo = form.get('viewableTo') ?? 'none';

        if (typeof content !== 'string' || typeof viewableTo !== 'string') {
            return fail(400, {content: '', viewableTo: '', error: 'Invalid input'});
        }

        const result = await (await fetch('./posts/add.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content, viewableTo})
        })).json();

        if (result.error) {
            return fail(400, {content, viewableTo, error: result.error});
        }

        return {success: true};
    }
}

export async function load({ params, fetch, locals }) {
	return {
        /** @type {import('$lib/db.js').Post[] | {error: string}} */
        posts: await fetch(`/u/${params.user}/posts.json`).then(r => r.json()),
        user: params.user,
        /** @type {import('$lib/db.js').Group[] | {error: string}} */
        groups: await fetch(`/u/${params.user}/groups.json`).then(r => r.json()),
        self: params.user === locals.session?.username
    };
}