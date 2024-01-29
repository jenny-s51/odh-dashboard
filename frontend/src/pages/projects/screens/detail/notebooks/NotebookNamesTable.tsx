import * as React from 'react';
import { Tr } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import { Table } from '~/components/table';
import { NotebookState } from '~/pages/projects/notebook/types';
import { getNotebookDisplayName } from '~/pages/projects/utils';
import NotebookRouteLink from '~/pages/projects/notebook/NotebookRouteLink';

type NotebookNamesTableProps = {
  project: string;
  notebookStates: NotebookState[];
};

const NotebookNamesTable: React.FC<NotebookNamesTableProps> = ({ notebookStates, project }) => {
  const navigate = useNavigate();

  if (!notebookStates?.length) {
    return (
      <div>
        Add a Jupyter notebook to your project.{' '}
        <Button variant="link" isInline onClick={() => navigate(`/projects/${project}/spawner`)}>
          Get started.
        </Button>
      </div>
    );
  }
  return (
    <Table
      isStriped
      variant="compact"
      data={notebookStates}
      disableRowRenderSupport
      rowRenderer={(obj, i) => (
        <Tr {...(i % 2 !== 0 && { isStriped: true })}>
          <NotebookRouteLink
            label={getNotebookDisplayName(obj.notebook)}
            notebook={obj.notebook}
            isRunning={obj.isRunning}
          />
        </Tr>
      )}
    />
  );
};

export default NotebookNamesTable;
