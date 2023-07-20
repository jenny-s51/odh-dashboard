import * as React from 'react';
import { Td, Tbody, Tr, ExpandableRowContent } from '@patternfly/react-table';
import {
  Button,
  EmptyState,
  EmptyStateVariant,
  Spinner,
  Title, EmptyStateActions, EmptyStateHeader, EmptyStateFooter,
} from '@patternfly/react-core';
import { Link, useNavigate } from 'react-router-dom';
import { PipelineKF, PipelineRunKF } from '~/concepts/pipelines/kfTypes';
import IndentSection from '~/pages/projects/components/IndentSection';
import { FetchState } from '~/utilities/useFetchState';
import { usePipelinesAPI } from '~/concepts/pipelines/context';
import { TABLE_CONTENT_LIMIT } from '~/concepts/pipelines/const';
import { RenderContentList, combineRunsByColumn } from './expandedRowRenderUtils';

type PipelinesTableExpandedRowProps = {
  isExpanded: boolean;
  runsFetchState: FetchState<PipelineRunKF[]>;
  pipeline: PipelineKF;
};

const PipelinesTableExpandedRow: React.FC<PipelinesTableExpandedRowProps> = ({
  isExpanded,
  runsFetchState,
  pipeline,
}) => {
  const navigate = useNavigate();
  const { namespace } = usePipelinesAPI();
  const [runs, loaded] = runsFetchState;

  if (!loaded) {
    return (
      <Tbody>
        <Tr isExpanded={isExpanded}>
          <Td colSpan={6}>
            <ExpandableRowContent>
              <Spinner size="sm" /> Loading runs...
            </ExpandableRowContent>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  if (runs.length === 0) {
    return (
      <Tbody>
        <Tr isExpanded={isExpanded}>
          <Td />
          <Td colSpan={6}>
            <ExpandableRowContent>
              <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateHeader titleText="No pipeline runs" headingLevel="h3" /><EmptyStateFooter>
                <EmptyStateActions>
                  <Button
                    variant="link"
                    onClick={() =>
                      navigate(`/pipelines/${namespace}/pipelineRun/create`, {
                        state: { lastPipeline: pipeline },
                      })
                    }
                  >
                    Create run
                  </Button>
                </EmptyStateActions>
              </EmptyStateFooter></EmptyState>
            </ExpandableRowContent>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  const renderContentByColumn = combineRunsByColumn(runs, TABLE_CONTENT_LIMIT);

  return (
    <Tbody isExpanded={isExpanded}>
      <Tr isExpanded={isExpanded}>
        <Td />
        <Td colSpan={2}>
          <ExpandableRowContent>
            <IndentSection>
              <RenderContentList
                firstItem={
                  <Title headingLevel="h3" size="md">
                    Runs
                  </Title>
                }
                items={[
                  ...renderContentByColumn.names,
                  runs.length > TABLE_CONTENT_LIMIT && (
                    <Link to={`/pipelineRuns/${namespace}`}>View all runs</Link>
                  ),
                ]}
              />
            </IndentSection>
          </ExpandableRowContent>
        </Td>
        <Td>
          <ExpandableRowContent>
            <RenderContentList items={renderContentByColumn.statuses} />
          </ExpandableRowContent>
        </Td>
        <Td>
          <ExpandableRowContent>
            <RenderContentList items={renderContentByColumn.durations} />
          </ExpandableRowContent>
        </Td>
        <Td>
          <ExpandableRowContent>
            <RenderContentList items={renderContentByColumn.createDates} />
          </ExpandableRowContent>
        </Td>
        <Td isActionCell />
      </Tr>
    </Tbody>
  );
};

export default PipelinesTableExpandedRow;
