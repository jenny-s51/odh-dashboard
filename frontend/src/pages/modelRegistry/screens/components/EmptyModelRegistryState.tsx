import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';

type EmptyModelRegistryStateType = {
  testid?: string;
  title: string;
  description: string;
  primaryActionText?: string;
  primaryActionOnClick?: () => void;
  secondaryActionText?: string;
  secondaryActionOnClick?: () => void;
};

const EmptyModelRegistryState: React.FC<EmptyModelRegistryStateType> = ({
  testid,
  title,
  description,
  primaryActionText,
  secondaryActionText,
  primaryActionOnClick,
  secondaryActionOnClick,
}) => (
  <EmptyState   icon={PlusCircleIcon}  titleText={title} variant={EmptyStateVariant.sm} data-testid={testid}>
    <EmptyStateBody>{description}</EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateActions>
        {primaryActionText && (
          <Button
            data-testid="empty-model-registry-primary-action"
            variant={ButtonVariant.primary}
            onClick={primaryActionOnClick}
          >
            {primaryActionText}
          </Button>
        )}
      </EmptyStateActions>
      <EmptyStateActions>
        {secondaryActionText && (
          <Button
            data-testid="empty-model-registry-secondary-action"
            variant="link"
            onClick={secondaryActionOnClick}
          >
            {secondaryActionText}
          </Button>
        )}
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);

export default EmptyModelRegistryState;
