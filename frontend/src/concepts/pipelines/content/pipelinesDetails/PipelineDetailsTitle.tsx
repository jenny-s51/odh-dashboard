import React from 'react';
import { Label, Split, SplitItem } from '@patternfly/react-core';
import { PipelineRunKFv2 } from '~/concepts/pipelines/kfTypes';
import { computeRunStatus, getStorageState } from '~/concepts/pipelines/content/utils';
import PipelineRunTypeLabel from '~/concepts/pipelines/content/PipelineRunTypeLabel';

type RunJobTitleProps = {
  run: PipelineRunKFv2;
  statusIcon?: boolean;
  pipelineRunLabel?: boolean;
  archivedLabel?: boolean;
};

const PipelineDetailsTitle: React.FC<RunJobTitleProps> = ({
  run,
  statusIcon,
  pipelineRunLabel,
}) => {
  const { icon, label } = computeRunStatus(run);

  const storageState = getStorageState(run);

  return (
    <>
      <Split hasGutter>
        <SplitItem>{run.display_name}</SplitItem>
        {pipelineRunLabel && (
          <SplitItem>
            <PipelineRunTypeLabel run={run} />
          </SplitItem>
        )}
        {statusIcon && (
          <SplitItem>
            <Label icon={icon}>{label}</Label>
          </SplitItem>
        )}
        {storageState === 'ARCHIVED' && (
          <SplitItem>
            <Label>Archived</Label>
          </SplitItem>
        )}
      </Split>
    </>
  );
};
export default PipelineDetailsTitle;
