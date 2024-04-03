import { PipelineNodeModel, RunStatus, WhenStatus } from '@patternfly/react-topology';
import React from 'react';

export type NodeConstructDetails = {
  id: string;
  label?: string;
  artifactType?: string;
  runAfter?: string[];
  status?: RunStatus;
};

export type StandardTaskNodeData = {
  status?: RunStatus;
  whenStatus?: WhenStatus;
  artifactType?: string;
};

export type PipelineNodeModelExpanded = PipelineNodeModel & {
  data?: StandardTaskNodeData;
};
