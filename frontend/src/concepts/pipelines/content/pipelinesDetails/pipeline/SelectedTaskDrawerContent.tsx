import * as React from 'react';
import {
  DrawerContext,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Title,
} from '@patternfly/react-core';
import { PipelineTask } from '~/concepts/pipelines/topology';
import PipelineTaskDetails from './PipelineTaskDetails';

type SelectedTaskDrawerContentProps = {
  task?: PipelineTask;
  onClose: () => void;
};

const SelectedTaskDrawerContent: React.FC<SelectedTaskDrawerContentProps> = ({ task, onClose }) => {
  if (!task) {
    return null;
  }

  return (
    // TODO: Revisit below approach, either to further to look into what caused the content to not render or
    // to restructure the code
    <DrawerContext.Provider value={{ isExpanded: true }}>
      <DrawerPanelContent
        data-testid="task-drawer"
        // TODO: look into removing this inline style; PF Drawers should handle height/scrolling by default
        style={{ height: '100%', overflowY: 'auto' }}
      >
        <DrawerHead>
          <Title headingLevel="h2" size="xl" data-testid="pipeline-task-name">
            {task.name} {task.type === 'artifact' ? 'Artifact details' : ''}
          </Title>
          <DrawerActions>
            <DrawerCloseButton onClick={onClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody>
          <PipelineTaskDetails task={task} />
        </DrawerPanelBody>
      </DrawerPanelContent>
    </DrawerContext.Provider>
  );
};

export default SelectedTaskDrawerContent;
