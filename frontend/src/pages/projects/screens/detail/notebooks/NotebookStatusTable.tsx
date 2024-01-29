import * as React from 'react';
import { Tr } from '@patternfly/react-table';
import { Table } from '~/components/table';
import { NotebookState } from '~/pages/projects/notebook/types';
import NotebookStatusToggle from '~/pages/projects/notebook/NotebookStatusToggle';
import { NotebookImageAvailability } from '~/pages/projects/screens/detail/notebooks/const';
import useNotebookImage from '~/pages/projects/screens/detail/notebooks/useNotebookImage';
import CanEnableElyraPipelinesCheck from '~/concepts/pipelines/elyra/CanEnableElyraPipelinesCheck';

type NotebookStatusTableProps = {
  project: string;
  notebookStates: NotebookState[];
};

const NotebookStatusRow: React.FC<{
  notebookState: NotebookState;
  canEnablePipelines: boolean;
}> = ({ notebookState, canEnablePipelines }) => {
  const [notebookImage] = useNotebookImage(notebookState.notebook);

  return (
    <NotebookStatusToggle
      notebookState={notebookState}
      doListen={false}
      enablePipelines={canEnablePipelines}
      isDisabled={
        notebookImage?.imageAvailability === NotebookImageAvailability.DELETED &&
        !notebookState.isRunning
      }
    />
  );
};

const NotebookStatusTable: React.FC<NotebookStatusTableProps> = ({ notebookStates, project }) => (
  <CanEnableElyraPipelinesCheck namespace={project}>
    {(canEnablePipelines) => (
      <Table
        isStriped
        variant="compact"
        data={notebookStates}
        disableRowRenderSupport
        rowRenderer={(obj, i) => (
          <Tr {...(i % 2 !== 0 && { isStriped: true })}>
            <NotebookStatusRow notebookState={obj} canEnablePipelines={canEnablePipelines} />
          </Tr>
        )}
      />
    )}
  </CanEnableElyraPipelinesCheck>
);

export default NotebookStatusTable;
