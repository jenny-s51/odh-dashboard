import * as React from 'react';
import { Tr } from '@patternfly/react-table';
import { Table } from '~/components/table';
import { NotebookState } from '~/pages/projects/notebook/types';
import NotebookStatusToggle from '~/pages/projects/notebook/NotebookStatusToggle';
import { NotebookImageAvailability } from '~/pages/projects/screens/detail/notebooks/const';
import useNotebookImage from '~/pages/projects/screens/detail/notebooks/useNotebookImage';

type NotebookStateRowProps = {
  enablePipelines: boolean;
  notebookState: NotebookState;
};

const NotebookStateRow: React.FC<NotebookStateRowProps> = ({ notebookState, enablePipelines }) => {
  const [notebookImage] = useNotebookImage(notebookState.notebook);

  return (
    <NotebookStatusToggle
      notebookState={notebookState}
      doListen={false}
      enablePipelines={enablePipelines}
      isDisabled={
        notebookImage?.imageAvailability === NotebookImageAvailability.DELETED &&
        !notebookState.isRunning
      }
    />
  );
};

type NotebookStateTableProps = {
  enablePipelines: boolean;
  notebookStates: NotebookState[];
};

const NotebookStateTable: React.FC<NotebookStateTableProps> = ({
  notebookStates,
  enablePipelines,
}) => (
  <Table
    isStriped
    variant="compact"
    data={notebookStates}
    disableRowRenderSupport
    rowRenderer={(obj, i) => (
      <Tr {...(i % 2 !== 0 && { isStriped: true })}>
        <NotebookStateRow notebookState={obj} enablePipelines={enablePipelines} />
      </Tr>
    )}
  />
);

export default NotebookStateTable;
