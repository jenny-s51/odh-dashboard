import * as React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import {
  pipelineRunsPageDescription,
  pipelineRunsPageTitle,
} from '~/pages/pipelines/global/runs/const';
import PipelineCoreApplicationPage from '~/pages/pipelines/global/PipelineCoreApplicationPage';
import EnsureAPIAvailability from '~/concepts/pipelines/EnsureAPIAvailability';
import { useAppSelector } from '~/redux/hooks';
import GlobalPipelineRunsTabs from './GlobalPipelineRunsTabs';

const GlobalPipelineRuns: React.FC = () => {
  const alternateUI = useAppSelector((state) => state.alternateUI);
  return (
    <PipelineCoreApplicationPage
      title={
        alternateUI ? (
          <Flex
            spaceItems={{ default: 'spaceItemsSm' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            <FlexItem>
              <div
                style={{
                  background: 'rgba(87, 82, 209, 0.1)',
                  borderRadius: 20,
                  padding: 4,
                  width: 40,
                  height: 40,
                }}
              >
                <ArrowRightIcon style={{ width: 32, height: 32 }} />
              </div>
            </FlexItem>
            <FlexItem>{pipelineRunsPageTitle}</FlexItem>
          </Flex>
        ) : (
          pipelineRunsPageTitle
        )
      }
      description={pipelineRunsPageDescription}
      getRedirectPath={(namespace) => `/pipelineRuns/${namespace}`}
      overrideChildPadding
    >
      <EnsureAPIAvailability>
        <GlobalPipelineRunsTabs />
      </EnsureAPIAvailability>
    </PipelineCoreApplicationPage>
  );
};

export default GlobalPipelineRuns;
