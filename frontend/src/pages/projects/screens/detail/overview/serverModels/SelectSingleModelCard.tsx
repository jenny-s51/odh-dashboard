import * as React from 'react';
import { CardBody, Content, Content } from '@patternfly/react-core';
import { ProjectObjectType, SectionType } from '~/concepts/design/utils';
import OverviewCard from '~/pages/projects/screens/detail/overview/components/OverviewCard';
import { ServingRuntimePlatform } from '~/types';
import AddModelFooter from './AddModelFooter';

const SelectSingleModelCard: React.FC = () => (
  <OverviewCard
    objectType={ProjectObjectType.modelServer}
    sectionType={SectionType.serving}
    title="Single-model serving platform"
    data-testid="single-serving-platform-card"
  >
    <CardBody>
      <Content>
        <Text component="small">
          Each model is deployed on its own model server. Choose this option when you want to deploy
          a large model such as a large language model (LLM).
        </Text>
      </Content>
    </CardBody>
    <AddModelFooter selectedPlatform={ServingRuntimePlatform.SINGLE} />
  </OverviewCard>
);

export default SelectSingleModelCard;
