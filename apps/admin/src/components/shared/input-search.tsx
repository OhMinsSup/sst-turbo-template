'use client';

import React from 'react';

import { Input } from '@template/ui/input';

export default function InputSearch() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
