import * as React from 'react';
import { ActionsColumn, IAction } from '@patternfly/react-table';
import { AdminViewUserData } from './types';
import { NotebookAdminContext } from './NotebookAdminContext';

type ServerStatusProps = {
  data: AdminViewUserData['actions'];
};

const NotebookActions: React.FC<ServerStatusProps> = ({ data }) => {
  const { setServerStatuses } = React.useContext(NotebookAdminContext);

  if (!data.isNotebookRunning) {
    return null;
  }

  const rowActions: IAction[] = [
    {
      title: 'Stop server',
      onClick: () => {
        setServerStatuses([data]);
      },
    },
  ];

  return <ActionsColumn id="notebook-actions" items={rowActions} />;
};

export default NotebookActions;
