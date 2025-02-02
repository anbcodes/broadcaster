// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session?: {
        username: string;
        id: string;
        created: string;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
