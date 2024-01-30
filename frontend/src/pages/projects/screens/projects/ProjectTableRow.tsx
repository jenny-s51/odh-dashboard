import * as React from 'react';
import {
  Flex,
  FlexItem,
  Label,
  Text,
  TextVariants,
  Timestamp,
  Tooltip,
} from '@patternfly/react-core';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { KnownLabels, ProjectKind } from '~/k8sTypes';
import useProjectTableRowItems from '~/pages/projects/screens/projects/useProjectTableRowItems';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import projectIcon from '~/images/UI_icon-Red_Hat-Folder-RGB.svg';
import { getProjectOwner } from '~/pages/projects/utils';
import { useAppSelector } from '~/redux/hooks';
import ProjectLink from './ProjectLink';
import NotebooksColumn from './NotebooksColumn';

import './ProjectTableRow.scss';

type ProjectTableRowProps = {
  obj: ProjectKind;
  isRefreshing: boolean;
  setEditData: (data: ProjectKind) => void;
  setDeleteData: (data: ProjectKind) => void;
};
const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  obj: project,
  isRefreshing,
  setEditData,
  setDeleteData,
}) => {
  const owner = getProjectOwner(project);
  const alternateUI = useAppSelector((state) => state.alternateUI);

  const item = useProjectTableRowItems(project, isRefreshing, setEditData, setDeleteData);
  return (
    <Tr className="odh-project-table__row">
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
      <Td dataLabel="Created">
        {project.metadata.creationTimestamp ? (
          <Timestamp date={new Date(project.metadata.creationTimestamp)} />
        ) : (
          'Unknown'
        )}
      </Td>
      <NotebooksColumn projectName={project.metadata.name} />
      <Td isActionCell>
        <ActionsColumn items={item} />
      </Td>
    </Tr>
  );
};

export default ProjectTableRow;
