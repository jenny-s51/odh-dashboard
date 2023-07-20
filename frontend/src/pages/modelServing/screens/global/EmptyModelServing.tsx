import * as React from 'react';
import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateHeader, EmptyStateFooter,  } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { ModelServingContext } from '~/pages/modelServing/ModelServingContext';
import ServeModelButton from './ServeModelButton';

const EmptyModelServing: React.FC = () => {
  const navigate = useNavigate();
  const {
    servingRuntimes: { data: servingRuntimes },
  } = React.useContext(ModelServingContext);

  if (servingRuntimes.length === 0) {
    return (
      <EmptyState>
        <EmptyStateHeader titleText="No model servers" icon={<EmptyStateIcon icon={PlusCircleIcon} />} headingLevel="h2" />
        <EmptyStateBody>
          Before deploying a model, you must first configure a model server.
        </EmptyStateBody><EmptyStateFooter>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          Create server
        </Button>
      </EmptyStateFooter></EmptyState>
    );
  }

  return (
    <EmptyState>
      <EmptyStateHeader titleText="No deployed models." icon={<EmptyStateIcon icon={PlusCircleIcon} />} headingLevel="h2" />
      <EmptyStateBody>To get started, use existing model servers to serve a model.</EmptyStateBody><EmptyStateFooter>
      <ServeModelButton />
    </EmptyStateFooter></EmptyState>
  );
};

export default EmptyModelServing;
