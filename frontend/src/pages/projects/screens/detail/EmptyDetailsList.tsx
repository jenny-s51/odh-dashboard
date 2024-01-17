import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';

type EmptyDetailsListProps = {
  variant?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  title?: string;
  description?: string;
  icon?: React.ComponentType;
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
};

const EmptyDetailsList: React.FC<EmptyDetailsListProps> = ({
  variant = 'full',
  title,
  description,
  icon,
  primaryActions,
  secondaryActions,
}) => (
  <EmptyState variant={variant}>
    <EmptyStateHeader
      titleText={title ? <>{title}</> : undefined}
      icon={<EmptyStateIcon icon={icon ?? PlusCircleIcon} />}
      headingLevel="h3"
    />
    <EmptyStateBody>{description}</EmptyStateBody>
    {primaryActions || secondaryActions ? (
      <EmptyStateFooter>
        {primaryActions ? <EmptyStateActions>{primaryActions}</EmptyStateActions> : null}
        {secondaryActions ? <EmptyStateActions>{secondaryActions}</EmptyStateActions> : null}
      </EmptyStateFooter>
    ) : null}
  </EmptyState>
);

export default EmptyDetailsList;
