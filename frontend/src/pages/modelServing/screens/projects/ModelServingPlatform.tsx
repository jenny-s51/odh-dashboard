import * as React from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Alert, Button, Card, Flex, Label, Popover, StackItem } from '@patternfly/react-core';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import DetailsSection from '~/pages/projects/screens/detail/DetailsSection';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import {
  getSortedTemplates,
  getTemplateEnabled,
  getTemplateEnabledForPlatform,
} from '~/pages/modelServing/customServingRuntimes/utils';
import { ServingRuntimePlatform } from '~/types';
import ModelServingPlatformSelect from '~/pages/modelServing/screens/projects/ModelServingPlatformSelect';
import { getProjectModelServingPlatform } from '~/pages/modelServing/screens/projects/utils';
import { ProjectsContext } from '~/concepts/projects/ProjectsContext';
import KServeInferenceServiceTable from '~/pages/modelServing/screens/projects/KServeSection/KServeInferenceServiceTable';
import useServingPlatformStatuses from '~/pages/modelServing/useServingPlatformStatuses';
import ManageServingRuntimeModal from './ServingRuntimeModal/ManageServingRuntimeModal';
import ModelMeshServingRuntimeTable from './ModelMeshSection/ServingRuntimeTable';
import ModelServingPlatformButtonAction from './ModelServingPlatformButtonAction';
import ManageKServeModal from './kServeModal/ManageKServeModal';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';
import EmptySingleModelServingCard from './EmptySingleModelServingCard';
import { useAccessReview } from '~/api';
import EmptyMultiModelServingCard from './EmptyMultiModelServingCard';

const ModelServingPlatform: React.FC = () => {
  const [platformSelected, setPlatformSelected] = React.useState<
    ServingRuntimePlatform | undefined
  >(undefined);

  const servingPlatformStatuses = useServingPlatformStatuses();

  const kServeEnabled = servingPlatformStatuses.kServe.enabled;
  const modelMeshEnabled = servingPlatformStatuses.modelMesh.enabled;

  const {
    servingRuntimes: {
      data: servingRuntimes,
      loaded: servingRuntimesLoaded,
      error: servingRuntimeError,
      refresh: refreshServingRuntime,
    },
    servingRuntimeTemplates: { data: templates, loaded: templatesLoaded, error: templateError },
    servingRuntimeTemplateOrder: { data: templateOrder },
    servingRuntimeTemplateDisablement: { data: templateDisablement },
    dataConnections: { data: dataConnections },
    serverSecrets: { refresh: refreshTokens },
    inferenceServices: { refresh: refreshInferenceServices },
    currentProject,
  } = React.useContext(ProjectDetailsContext);

  const { refresh: refreshAllProjects } = React.useContext(ProjectsContext);

  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  const templatesSorted = getSortedTemplates(templates, templateOrder);
  const templatesEnabled = templatesSorted.filter((template) =>
    getTemplateEnabled(template, templateDisablement),
  );

  const emptyTemplates = templatesEnabled.length === 0;
  const emptyModelServer = servingRuntimes.length === 0;

  const { platform: currentProjectServingPlatform, error: platformError } =
    getProjectModelServingPlatform(currentProject, servingPlatformStatuses);

  const shouldShowPlatformSelection =
    ((kServeEnabled && modelMeshEnabled) || (!kServeEnabled && !modelMeshEnabled)) &&
    !currentProjectServingPlatform;

  const isProjectModelMesh = currentProjectServingPlatform === ServingRuntimePlatform.MULTI;

  const onSubmit = (submit: boolean) => {
    setPlatformSelected(undefined);
    if (submit) {
      refreshAllProjects();
      refreshServingRuntime();
      refreshInferenceServices();
      setTimeout(refreshTokens, 500); // need a timeout to wait for tokens creation
    }
  };

  let icon;

  icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--md)',
        verticalAlign: 'sub',
        width: '32px',
      }}
      src="../images/UI_icon-Red_Hat-Server-RGB.svg"
      alt="Server icon"
    />
  );

  return (
    <>
      <DetailsSection
        icon={icon}
        id={ProjectSectionID.MODEL_SERVER}
        title={ProjectSectionTitles[ProjectSectionID.MODEL_SERVER]}
        description={
          'Select the type of model serving platform to be used when deploying models in this project.'
        }
        popover={
          !(!shouldShowPlatformSelection && emptyModelServer) ? (
            <Popover
              headerContent={'About model serving'}
              bodyContent={
                'Deploy a trained data science model to serve intelligent applications with an endpoint that allows apps to send requests to the model.'
              }
            >
              <DashboardPopupIconButton
                icon={
                  <OutlinedQuestionCircleIcon
                    style={{ marginLeft: 'var(--pf-v5-global--spacer--md)' }}
                  />
                }
                aria-label="More info"
              />
            </Popover>
          ) : undefined
        }
        actions={
          shouldShowPlatformSelection || platformError
            ? undefined
            : shouldShowPlatformSelection
            ? [
                <ModelServingPlatformButtonAction
                  isProjectModelMesh={isProjectModelMesh}
                  emptyTemplates={emptyTemplates}
                  onClick={() => {
                    setPlatformSelected(
                      isProjectModelMesh
                        ? ServingRuntimePlatform.MULTI
                        : ServingRuntimePlatform.SINGLE,
                    );
                  }}
                  key="serving-runtime-actions"
                />,
              ]
            : undefined
        }
        isLoading={!servingRuntimesLoaded && !templatesLoaded}
        isEmpty={!shouldShowPlatformSelection && emptyModelServer}
        loadError={platformError || servingRuntimeError || templateError}
        emptyState={
          <div className="odh-project-overview__components">
            <EmptySingleModelServingCard allowCreate={rbacLoaded && allowCreate} />
            <EmptyMultiModelServingCard allowCreate={rbacLoaded && allowCreate} />
          </div>
          // <Flex>
          //   <Card isPlain>
          //     <EmptyDetailsList
          //       title={'Single model serving platform'}
          //       description={
          //         'Each model is deployed from its own model server. Choose this option when you have a small number of large models to deploy.\n'
          //       }
          //       actions={[
          //         <Button
          //           key={`action-${ProjectSectionID.WORKBENCHES}`}
          //           onClick={() => {
          //             setPlatformSelected(ServingRuntimePlatform.SINGLE);
          //           }}
          //           variant="secondary"
          //           size="lg"
          //         >
          //           Create pipeline
          //         </Button>,
          //       ]}
          //     />
          //   </Card>
          //   <Card isPlain>
          //     <EmptyDetailsList
          //       title={'Multi-model serving platform'}
          //       description={
          //         'Multiple models can be deployed from a single model server. Choose this option when you have a large number of small models to deploy that can share server resources.'
          //       }
          //       actions={[
          //         <Button
          //           key={`action-${ProjectSectionID.WORKBENCHES}`}
          //           onClick={() => {
          //             setPlatformSelected(ServingRuntimePlatform.MULTI);
          //           }}
          //           variant="secondary"
          //           size="lg"
          //         >
          //           Add model server
          //         </Button>,
          //       ]}
          //     />
          //   </Card>
          // </Flex>
        }
        labels={
          currentProjectServingPlatform && [
            <Label key="serving-platform-label">
              {isProjectModelMesh ? 'Multi-model serving enabled' : 'Single-model serving enabled'}
            </Label>,
          ]
        }
      >
        {shouldShowPlatformSelection ? (
          <ModelServingPlatformSelect
            onSelect={(selectedPlatform) => {
              setPlatformSelected(selectedPlatform);
            }}
            emptyTemplates={emptyTemplates}
            emptyPlatforms={!modelMeshEnabled && !kServeEnabled}
          />
        ) : isProjectModelMesh ? (
          <ModelMeshServingRuntimeTable />
        ) : (
          <KServeInferenceServiceTable />
        )}
      </DetailsSection>

      {!shouldShowPlatformSelection && emptyModelServer && (
        <StackItem>
          <Alert
            variant="warning"
            isInline
            title="The model serving type can be changed until the first model is deployed from the project. After that, you will need to create a new project in order to use a different model serving type."
          />
        </StackItem>
      )}
      {/* <ManageServingRuntimeModal
        isOpen={platformSelected === ServingRuntimePlatform.MULTI}
        currentProject={currentProject}
        servingRuntimeTemplates={templatesEnabled.filter((template) =>
          getTemplateEnabledForPlatform(template, ServingRuntimePlatform.MULTI),
        )}
        onClose={(submit: boolean) => {
          onSubmit(submit);
        }}
      />
      <ManageKServeModal
        isOpen={platformSelected === ServingRuntimePlatform.SINGLE}
        projectContext={{
          currentProject,
          dataConnections,
        }}
        servingRuntimeTemplates={templatesEnabled.filter((template) =>
          getTemplateEnabledForPlatform(template, ServingRuntimePlatform.SINGLE),
        )}
        onClose={(submit: boolean) => {
          onSubmit(submit);
        }}
      /> */}
    </>
  );
};

export default ModelServingPlatform;
