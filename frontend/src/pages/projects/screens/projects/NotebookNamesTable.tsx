import * as React from 'react';
import { Td, Tr } from '@patternfly/react-table';
import { Table } from '~/components/table';
import { NotebookState } from '~/pages/projects/notebook/types';
import { getNotebookDisplayName } from '~/pages/projects/utils';
import NotebookRouteLink from '~/pages/projects/notebook/NotebookRouteLink';

type NotebookNamesTableProps = {
  notebookStates: NotebookState[];
};

const NotebookNamesTable: React.FC<NotebookNamesTableProps> = ({ notebookStates }) => (
  <Table
    isStriped
    variant="compact"
    data={notebookStates}
    disableRowRenderSupport
    rowRenderer={(obj, i) => (
      <Tr {...(i % 2 !== 0 && { isStriped: true })}>
        <Td>
          <NotebookRouteLink
            label={getNotebookDisplayName(obj.notebook)}
            notebook={obj.notebook}
            isRunning={obj.isRunning}
          />
        </Td>
      </Tr>
    )}
  />
);

export default NotebookNamesTable;
