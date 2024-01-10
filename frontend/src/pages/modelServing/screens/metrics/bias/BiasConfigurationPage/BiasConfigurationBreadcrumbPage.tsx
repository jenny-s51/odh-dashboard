import * as React from 'react';
import { useOutletContext } from 'react-router-dom';
import { getInferenceServiceDisplayName } from '~/pages/modelServing/screens/global/utils';
import { GlobalModelMetricsOutletContextProps } from '~/pages/modelServing/screens/metrics/GlobalModelMetricsWrapper';
import { useModelBiasData } from '~/concepts/trustyai/context/useModelBiasData';
import BiasConfigurationPage from './BiasConfigurationPage';

const BiasConfigurationBreadcrumbPage: React.FC = () => {
  const { model, projectName } = useOutletContext<GlobalModelMetricsOutletContextProps>();
  const { biasMetricConfigs, refresh } = useModelBiasData();

  const modelDisplayName = getInferenceServiceDisplayName(model);
  return (
    <BiasConfigurationPage
      breadcrumbItems={[
        { label: 'Model serving', link: '/modelServing' },
        {
          label: modelDisplayName,
          link: `/modelServing/${projectName}/metrics/${model.metadata.name}`,
        },
        { label: 'Metric configuration', isActive: true },
      ]}
      biasMetricConfigs={biasMetricConfigs}
      refresh={refresh}
      loaded={true}
      loadError={true}
      inferenceService={model}
    />
  );
};

export default BiasConfigurationBreadcrumbPage;
