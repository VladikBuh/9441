import React from 'react';

import {NavigationProvider} from './NavigationContext';
import {AppShell} from './AppShell';

export function AppNavigator() {
  return (
    <NavigationProvider>
      <AppShell />
    </NavigationProvider>
  );
}
