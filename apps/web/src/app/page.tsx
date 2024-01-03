import React from 'react';

export default async function Page() {
  const data = await Promise.resolve('data');
  return <div>page: {data}</div>;
}
