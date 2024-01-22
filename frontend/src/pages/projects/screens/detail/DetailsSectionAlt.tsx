import * as React from 'react';
import classNames from 'classnames';
import {
  Alert,
  Bullseye,
  Flex,
  FlexItem,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { ProjectSectionID } from './types';

import './DetailsSectionAlt.scss';

type DetailsSectionAltProps = {
  id: ProjectSectionID;
  actions?: React.ReactNode[];
  iconSrc: string;
  iconAlt: string;
  typeModifier?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  popover?: React.ReactNode;
  isLoading: boolean;
  loadError?: Error;
  isEmpty: boolean;
  emptyState: React.ReactNode;
  children: React.ReactNode;
  labels?: React.ReactNode[];
  showDivider?: boolean;
};

const DetailsSectionAlt: React.FC<DetailsSectionAltProps> = ({
  actions,
  iconSrc,
  iconAlt,
  typeModifier,
  children,
  emptyState,
  id,
  isEmpty,
  isLoading,
  loadError,
  title,
  badge,
  description,
  popover,
  labels,
  showDivider,
}) => {
  const renderContent = () => {
    if (loadError) {
      return (
        <Alert variant="danger" isInline title="Loading error">
          {loadError.message}
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <Bullseye style={{ minHeight: 150 }}>
          <Spinner />
        </Bullseye>
      );
    }

    if (isEmpty) {
      return emptyState;
    }

    return children;
  };

  return (
    <Stack
      hasGutter
      className={classNames({
        'odh-details-section--divide': !loadError && (isLoading || isEmpty || showDivider),
      })}
    >
      {!isEmpty ? (
        <StackItem>
          <Flex
            className={css('odh-details__header', typeModifier)}
            direction={{ default: 'column', md: 'row' }}
            gap={{ default: 'gapMd' }}
          >
            <Flex flex={{ default: 'flex_1' }}>
              <FlexItem>
                <Flex
                  direction={{ default: 'row' }}
                  gap={{ default: 'gapSm' }}
                  alignItems={{ default: 'alignItemsCenter' }}
                >
                  <div className="odh-details__header--icon">
                    <img src={iconSrc} alt={iconAlt} />
                  </div>
                  <FlexItem>
                    <Title id={`${id}-title`} headingLevel="h2" size="xl">
                      {title}
                    </Title>
                  </FlexItem>
                  <FlexItem>{badge}</FlexItem>
                  <FlexItem>{popover}</FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <TextContent>{description && <Text component="p">{description}</Text>}</TextContent>
              </FlexItem>
            </Flex>
            <Flex direction={{ default: 'column', md: 'row' }}>
              {actions && <FlexItem>{actions}</FlexItem>}
              {labels && <FlexItem align={{ default: 'alignRight' }}>{labels}</FlexItem>}
            </Flex>
          </Flex>
        </StackItem>
      ) : null}
      {renderContent()}
    </Stack>
  );
};

export default DetailsSectionAlt;
