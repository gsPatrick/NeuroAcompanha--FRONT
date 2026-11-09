'use client';

import { useEffect } from 'react';
import Framework7 from 'framework7/lite-bundle';
import Framework7React, { App, View } from 'framework7-react';
import { framework7Params } from '@/core/framework7/framework7.config';
import { installHaptics } from '@/utils/haptics';

Framework7.use(Framework7React);

export default function AppShellClient({ children }) {
  // Vibração curta em todo toque em algo interativo (um único ouvinte para o app inteiro).
  useEffect(() => installHaptics(), []);

  return (
    <App {...framework7Params}>
      <View main>{children}</View>
    </App>
  );
}
