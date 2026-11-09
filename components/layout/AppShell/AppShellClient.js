'use client';

import Framework7 from 'framework7/lite-bundle';
import Framework7React, { App, View } from 'framework7-react';
import { framework7Params } from '@/core/framework7/framework7.config';

Framework7.use(Framework7React);

export default function AppShellClient({ children }) {
  return (
    <App {...framework7Params}>
      <View main>{children}</View>
    </App>
  );
}
