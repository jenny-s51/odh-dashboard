import * as React from 'react';
import { Bullseye, Button, Spinner, Text, Timestamp, Tooltip } from '@patternfly/react-core';
import { ActionsColumn, Tbody, Td, Tr } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';
import { KnownLabels, ProjectKind } from '~/k8sTypes';
import useProjectTableRowItems from '~/pages/projects/screens/projects/useProjectTableRowItems';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import projectIcon from '~/images/UI_icon-Red_Hat-Folder-RGB.svg';
import { getProjectOwner } from '~/pages/projects/utils';
import Status from '~/components/Status';
import NotebookTable from '~/pages/projects/screens/detail/notebooks/NotebookTable';
import useProjectNotebookStates from '~/pages/projects/notebook/useProjectNotebookStates';
import ProjectLink from './ProjectLink';

type ProjectTableRowAltProps = {
  obj: ProjectKind;
  isRefreshing: boolean;
  setEditData: (data: ProjectKind) => void;
  setDeleteData: (data: ProjectKind) => void;
  rowIndex: number;
};
const ProjectTableRowAlt: React.FC<ProjectTableRowAltProps> = ({
  obj: project,
  isRefreshing,
  setEditData,
  setDeleteData,
  rowIndex,
}) => {
  const navigate = useNavigate();
  const [notebookStates, loaded] = useProjectNotebookStates(project.metadata.name);
  const owner = getProjectOwner(project);
  const [isExpanded, setExpanded] = React.useState(true);

  const item = useProjectTableRowItems(project, isRefreshing, setEditData, setDeleteData);
  return (
    <Tbody isExpanded={isExpanded}>
      <Tr {...(rowIndex % 2 === 0 && { isStriped: true })}>
        <Td
          expand={{
            rowIndex,
            expandId: 'project-row-item',
            isExpanded,
            onToggle: () => setExpanded(!isExpanded),
          }}
        />
        <Td dataLabel="Name">
          <ResourceNameTooltip resource={project}>
            {project.metadata.labels?.[KnownLabels.DASHBOARD_RESOURCE] && (
              <Tooltip content="Data Science">
                <img
                  style={{ height: 24, position: 'relative', marginRight: 4, top: 8 }}
                  src={projectIcon}
                  alt="project"
                />
              </Tooltip>
            )}
            <ProjectLink project={project} />
          </ResourceNameTooltip>
        </Td>
        <Td dataLabel="Status">
          <Status status={project.status?.phase || 'unknown'} />
        </Td>
        <Td dataLabel="Created by">{owner && <Text>{owner}</Text>}</Td>
        <Td dataLabel="Created">
          {project.metadata.creationTimestamp ? (
            <Timestamp date={new Date(project.metadata.creationTimestamp)} />
          ) : (
            'Unknown'
          )}
        </Td>
        <Td isActionCell>
          <ActionsColumn items={item} />
        </Td>
      </Tr>
      <Tr isExpanded={isExpanded}>
        <Td
          colSpan={6}
          style={{
            paddingLeft: 78,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor:
              rowIndex % 2 === 0 ? 'var(--pf-v5-global--BackgroundColor--light-200)' : undefined,
          }}
        >
          {loaded ? (
            <>
              {notebookStates.length ? (
                <NotebookTable notebookStates={notebookStates} compact project={project} />
              ) : (
                <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  Add a Jupyter notebook to your project.{' '}
                  <Button
                    variant="link"
                    isInline
                    onClick={() => navigate(`/projects/${project.metadata.name}/spawner`)}
                  >
                    Get started.
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Bullseye style={{ minHeight: 150 }}>
              <Spinner />
            </Bullseye>
          )}
        </Td>
      </Tr>
    </Tbody>
  );
};

export default ProjectTableRowAlt;
