'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}
