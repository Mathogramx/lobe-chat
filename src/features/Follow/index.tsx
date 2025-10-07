'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const Follow = memo(() => {
  return <Flexbox gap={8} horizontal></Flexbox>;
});

Follow.displayName = 'Follow';

export default Follow;
