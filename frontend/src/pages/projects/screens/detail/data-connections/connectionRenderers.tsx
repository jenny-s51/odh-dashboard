import * as React from 'react';
import { CubeIcon } from '@patternfly/react-icons';
import { DataConnectionType } from '~/pages/projects/types';
import { Flex, FlexItem } from '@patternfly/react-core';

export const DATA_CONNECTION_TYPES: { [key in DataConnectionType]: React.ReactNode } = {
  [DataConnectionType.AWS]: (
    <Flex>
      <FlexItem spacer={{ default: 'spacerSm' }}>
        <CubeIcon />
      </FlexItem>
      <FlexItem>Object storage</FlexItem>
    </Flex>
  ),
};
