import * as React from 'react';
import {
  Flex,
  FlexItem,
  Label,
  Spinner,
  Text,
  TextVariants,
  Timestamp,
  Tooltip,
} from '@patternfly/react-core';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { KnownLabels, ProjectKind } from '~/k8sTypes';
import useProjectTableRowItems from '~/pages/projects/screens/projects/useProjectTableRowItems';
import useProjectNotebookStates from '~/pages/projects/notebook/useProjectNotebookStates';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import projectIcon from '~/images/UI_icon-Red_Hat-Folder-RGB.svg';
import { getProjectOwner } from '~/pages/projects/utils';
import { useAppSelector } from '~/redux/hooks';
import Status from '~/components/Status';
import NotebookNamesTable from '~/pages/projects/screens/detail/notebooks/NotebookNamesTable';
import NotebookStatusTable from '~/pages/projects/screens/detail/notebooks/NotebookStatusTable';
import ProjectLink from './ProjectLink';

import './ProjectTableRow.scss';

type ProjectTableRowProps = {
  obj: ProjectKind;
  isRefreshing: boolean;
  setEditData: (data: ProjectKind) => void;
  setDeleteData: (data: ProjectKind) => void;
  rowIndex?: number;
};
const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  obj: project,
  isRefreshing,
  setEditData,
  setDeleteData,
  rowIndex,
}) => {
  const [notebookStates, loaded] = useProjectNotebookStates(project.metadata.name);
  const owner = getProjectOwner(project);
  const alternateUI = useAppSelector((state) => state.alternateUI);

  const item = useProjectTableRowItems(project, isRefreshing, setEditData, setDeleteData);
  return (
    <Tr {...(rowIndex && rowIndex % 2 === 0 && { isStriped: true })}>
      <Td dataLabel="Name">
        <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
          {project.metadata.labels?.[KnownLabels.DASHBOARD_RESOURCE] && (
            <FlexItem style={{ display: 'flex' }}>
              <Tooltip content="Data Science">
                {alternateUI ? (
                  <img style={{ height: '24px' }} src={projectIcon} alt="prioject" />
                ) : (
                  <Label isCompact color="green">
                    DS
                  </Label>
                )}
              </Tooltip>
            </FlexItem>
          )}
          <FlexItem>
            <ResourceNameTooltip resource={project}>
              <ProjectLink project={project} />
            </ResourceNameTooltip>
          </FlexItem>
        </Flex>
        {owner && <Text component={TextVariants.small}>{owner}</Text>}
      </Td>
      <Td dataLabel="Status">
        <Status status={project.status?.phase || 'unknown'} />
      </Td>
      <Td dataLabel="Created">
        {project.metadata.creationTimestamp ? (
          <Timestamp date={new Date(project.metadata.creationTimestamp)} />
        ) : (
          'Unknown'
        )}
      </Td>
      <Td
        dataLabel="Name"
        className={notebookStates?.length ? 'odh-project-table__workbench-column' : undefined}
      >
        {loaded ? (
          <NotebookNamesTable notebookStates={notebookStates} project={project.metadata.name} />
        ) : (
          <Spinner size="sm" />
        )}
      </Td>
      <Td dataLabel="Status" className="odh-project-table__workbench-column">
        {loaded ? (
          <NotebookStatusTable notebookStates={notebookStates} project={project.metadata.name} />
        ) : (
          <Spinner size="sm" />
        )}
      </Td>
      <Td isActionCell>
        <ActionsColumn items={item} />
      </Td>
    </Tr>
  );
};

export default ProjectTableRow;
