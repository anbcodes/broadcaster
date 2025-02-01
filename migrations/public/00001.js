/** @satisfies {import('../migrate.js').Migration} */
export const migration = {
  run: async ({sql}) => {
    await sql`
        ALTER TABLE public.posts ADD COLUMN include text;
        ALTER TABLE public.posts ADD COLUMN exclude text;
    `;
    const current = await sql`SELECT * FROM public.posts;`;
    for (const row of current.rows) {
        let include = [];
        let exclude = [];
        for (const rule of row.viewableto.split(',')) {
            if (rule.startsWith('!')) {
                exclude.push(rule.slice(1));
            } else {
                include.push(rule);
            }
        }

        include = include.filter(v => v !== 'none').map(v => v === 'all' ? 'everyone' : v.replace('u:', '@').replace('g:', '#'));

        await sql`
            UPDATE public.posts SET include = ${include}, exclude = ${exclude} WHERE id = ${row.id};
        `;
    }

    await sql`
        ALTER TABLE public.posts DROP COLUMN viewableto;
    `;
  },
};
