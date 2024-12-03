export const loader = () => {
  throw new Response("Not found", { status: 404 });
};

// this is used to tell Remix to call active loaders
// after a user signs in or out
export const action = () => null;
