export const id = (name: string) => `virtual:t3-env/${name}`;
export const resolve = (id: string) => `\0${id}`;

export const env_static_private = "\0virtual:$env/static/private";
export const env_static_public = "\0virtual:$env/static/public";
