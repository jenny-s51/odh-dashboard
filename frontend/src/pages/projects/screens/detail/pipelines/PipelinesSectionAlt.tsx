import * as React from 'react';
import { ButtonVariant } from '@patternfly/react-core';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import {
  CreatePipelineServerButton,
  PipelineServerTimedOut,
  usePipelinesAPI,
} from '~/concepts/pipelines/context';
import ImportPipelineButton from '~/concepts/pipelines/content/import/ImportPipelineButton';
import PipelinesList from '~/pages/projects/screens/detail/pipelines/PipelinesList';
import PipelineServerActions from '~/concepts/pipelines/content/pipelinesDetails/pipeline/PipelineServerActions';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import emptyStateImg from '~/images/empty-state-pipelines.svg';
import { useAccessReview } from '~/api';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import DetailsSectionAlt from '~/pages/projects/screens/detail/DetailsSectionAlt';

const PipelinesSectionAlt: React.FC = () => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const {
    apiAvailable,
    pipelinesServer: { initializing, installed, timedOut },
  } = usePipelinesAPI();

  const [isPipelinesEmpty, setIsPipelinesEmpty] = React.useState(false);
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  return (
    <>
      <DetailsSectionAlt
        id={ProjectSectionID.PIPELINES}
        title={ProjectSectionTitles[ProjectSectionID.PIPELINES]}
        actions={[
          <ImportPipelineButton
            isDisabled={!installed}
            key={`action-${ProjectSectionID.PIPELINES}`}
            variant="secondary"
          />,
          <PipelineServerActions
            key={`action-${ProjectSectionID.PIPELINES}-1`}
            isDisabled={!initializing && !installed}
            variant="kebab"
          />,
        ]}
        isLoading={(!apiAvailable && installed) || initializing}
        isEmpty={!installed}
        emptyState={
          <EmptyDetailsList
            title="Start by configuring a pipeline server"
            description="Standardize and automate machine learning workflows to enable you to further enhance and deploy your data science models."
            icon={() => <img style={{ height: '320px' }} src={emptyStateImg} alt="Workbenches" />}
            actions={
              rbacLoaded && allowCreate ? (
                <CreatePipelineServerButton variant={ButtonVariant.primary} />
              ) : null
            }
          />
        }
        showDivider={isPipelinesEmpty}
      >
        {timedOut ? (
          <PipelineServerTimedOut />
        ) : (
          <>{installed ? <PipelinesList setIsPipelinesEmpty={setIsPipelinesEmpty} /> : null}</>
        )}
      </DetailsSectionAlt>
    </>
  );
};

export default PipelinesSectionAlt;
