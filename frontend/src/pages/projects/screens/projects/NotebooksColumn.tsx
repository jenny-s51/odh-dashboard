import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@patternfly/react-core';
import { Td } from '@patternfly/react-table';
import useProjectNotebookStates from '~/pages/projects/notebook/useProjectNotebookStates';
import NotebookNamesTable from '~/pages/projects/screens/projects/NotebookNamesTable';
import NotebookStateTable from '~/pages/projects/screens/projects/NotebookStateTable';
import CanEnableElyraPipelinesCheck from '~/concepts/pipelines/elyra/CanEnableElyraPipelinesCheck';

import './NotebooksColumn.scss';

type NotebooksColumnProps = {
  projectName: string;
};

const NotebooksColumn: React.FC<NotebooksColumnProps> = ({ projectName }) => {
  const navigate = useNavigate();
  const [notebookStates, loaded] = useProjectNotebookStates(projectName);

  if (!loaded) {
    return (
      <Td colSpan={2}>
        <Spinner size="sm" />
      </Td>
    );
  }

  if (!notebookStates.length) {
    return (
      <Td colSpan={2} style={{ fontSize: 'var(--pf-v5-global--FontSize--sm' }}>
        Add a Jupyter notebook to your project.{' '}
        <Button
          variant="link"
          isInline
          onClick={() => navigate(`/projects/${projectName}/spawner`)}
        >
          Get started.
        </Button>
      </Td>
    );
  }

  return (
    <CanEnableElyraPipelinesCheck namespace={projectName}>
      {(enablePipelines) => (
        <>
          <Td dataLabel="Name" className="odh-project-table__workbench-column">
            <NotebookNamesTable notebookStates={notebookStates} />
          </Td>
          <Td dataLabel="Status" className="odh-project-table__workbench-column">
            <NotebookStateTable notebookStates={notebookStates} enablePipelines={enablePipelines} />
          </Td>
        </>
      )}
    </CanEnableElyraPipelinesCheck>
  );
};

export default NotebooksColumn;
