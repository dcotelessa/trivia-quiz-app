import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import React, { ReactNode } from 'react';

export const createApolloWrapper = (mocks: MockedResponse[] = []) => {
  return ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
};
