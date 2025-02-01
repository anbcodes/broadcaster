/** @satisfies {import('../migrate.js').Migration} */
export const migration = {
  run: async ({sql}) => {
    await sql`
      CREATE TABLE schema_versions (
          schema text PRIMARY KEY,
          version int NOT NULL
      );

      CREATE TABLE public.users (
          username text PRIMARY KEY,
          hash text NOT NULL,
          created text NOT NULL
      );

      CREATE TABLE public.sessions (
          id text PRIMARY KEY,
          username text references public.users(username),
          created text NOT NULL
      );

      CREATE TABLE public.groups (
          name text PRIMARY KEY,
          owner text references public.users(username)
      );

      CREATE TABLE public.group_members (
          groupname text NOT NULL,
          username text NOT NULL
      );

      CREATE TABLE public.posts (
          id serial PRIMARY KEY,
          username text references public.users(username),
          content text NOT NULL,
          viewableto text,
          created text NOT NULL,
          updated text NOT NULL
      );`;
  },
};
