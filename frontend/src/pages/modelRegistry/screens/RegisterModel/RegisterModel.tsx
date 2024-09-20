import {
  ActionGroup,
  Alert,
  AlertActionCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  FormSection,
  HelperText,
  HelperTextItem,
  InputGroupItem,
  InputGroupText,
  Radio,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Content,
  TextArea,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ApplicationsPage from '~/pages/ApplicationsPage';
import useRegisterModelData from './useRegisterModelData';
import React from 'react';

const RegisterModel: React.FC = () => {
  const { modelRegistry: mrName } = useParams();
  const [
    {
      modelRegistryName,
      modelName,
      modelDescription,
      versionName,
      versionDescription,
      sourceModelFormat,
      modelLocationType,
      modelLocationEndpoint,
      modelLocationBucket,
      modelLocationRegion,
      modelLocationPath,
      modelLocationURI,
    },
    setData,
    resetData,
  ] = useRegisterModelData(mrName);
  const [loading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const [isChecked, setIsChecked] = React.useState<boolean>(true);

  React.useEffect(() => {
    console.log(window.isSwitched);
    setIsChecked(window?.isSwitched!);
  }, [isChecked]);

  enum ModelLocationType {
    ObjectStorage = 'Object storage',
    URI = 'URI',
  }

  const isSubmitDisabled =
    !modelRegistryName ||
    !modelName ||
    !versionName ||
    loading ||
    (modelLocationType === ModelLocationType.URI && !modelLocationURI) ||
    (modelLocationType === ModelLocationType.ObjectStorage &&
      (!modelLocationBucket || !modelLocationEndpoint || !modelLocationPath));

  const handleSubmit = () => {
    setIsLoading(true);
    setError(undefined);
    //TODO: implement submit calls/logic. remove console log and alert
    alert('This functionality is not yet implemented');
    /* eslint-disable-next-line no-console */
    console.log({
      modelRegistryName,
      modelName,
      modelDescription,
      versionName,
      versionDescription,
      sourceModelFormat,
      modelLocationType,
      modelLocationEndpoint,
      modelLocationBucket,
      modelLocationRegion,
      modelLocationPath,
      modelLocationURI,
    });
  };

  const modelRegistryInput = (
    <TextInput
      isDisabled
      isRequired
      type="text"
      id="mr-name"
      name="mr-name"
      value={modelRegistryName}
    />
  );

  const modelNameInput = (
    <TextInput
      isRequired
      type="text"
      id="model-name"
      name="model-name"
      value={modelName}
      onChange={(_e, value) => setData('modelName', value)}
    />
  );

  const modelDescriptionInput = (
    <TextArea
      type="text"
      id="model-description"
      name="model-description"
      value={modelDescription}
      onChange={(_e, value) => setData('modelDescription', value)}
    />
  );

  const versionNameInput = (
    <TextInput
      isRequired
      type="text"
      id="version-name"
      name="version-name"
      value={versionName}
      onChange={(_e, value) => setData('versionName', value)}
    />
  );

  const versionDescriptionInput = (
    <TextArea
      type="text"
      id="version-description"
      name="version-description"
      value={versionDescription}
      onChange={(_e, value) => setData('versionDescription', value)}
    />
  );

  const sourceModelFormatInput = (
    <TextInput
      type="text"
      placeholder="Example, tensorflow"
      id="source-model-format"
      name="source-model-format"
      value={sourceModelFormat}
      onChange={(_e, value) => setData('sourceModelFormat', value)}
    />
  );

  const endpointInput = (
    <TextInput
      isRequired
      type="text"
      id="location-endpoint"
      name="location-endpoint"
      value={modelLocationEndpoint}
      onChange={(_e, value) => setData('modelLocationEndpoint', value)}
    />
  );

  const bucketInput = (
    <TextInput
      isRequired
      type="text"
      id="location-bucket"
      name="location-bucket"
      value={modelLocationBucket}
      onChange={(_e, value) => setData('modelLocationBucket', value)}
    />
  );

  const regionInput = (
    <TextInput
      type="text"
      id="location-region"
      name="location-region"
      value={modelLocationRegion}
      onChange={(_e, value) => setData('modelLocationRegion', value)}
    />
  );

  const pathInput = (
    <TextInput
      isRequired
      type="text"
      id="location-path"
      name="location-path"
      value={modelLocationPath}
      onChange={(_e, value) => setData('modelLocationPath', value)}
    />
  );

  return (
    <ApplicationsPage
      title="Register model"
      description="Create a new model and register a first version of the new model."
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem render={() => <Link to="/modelRegistry">Model registry</Link>} />
          <BreadcrumbItem
            render={() => (
              <Link to={`/modelRegistry/${modelRegistryName}`}>{modelRegistryName}</Link>
            )}
          />
          <BreadcrumbItem>Register model</BreadcrumbItem>
        </Breadcrumb>
      }
      loaded
      empty={false}
      provideChildrenPadding
    >
      <Form>
        <Stack hasGutter>
          <StackItem>
            <FormGroup label="Model registry" isRequired fieldId="mr-name">
              {isChecked ? (
                <div className="form-fieldset-wrapper">
                  {modelRegistryInput}
                  <fieldset aria-hidden="true" className="form-fieldset">
                    <legend className="form-fieldset-legend">
                      <span>Model Registry</span>
                    </legend>
                  </fieldset>
                </div>
              ) : (
                modelRegistryInput
              )}
            </FormGroup>
          </StackItem>
          <StackItem>
            <FormSection
              title={
                <>
                  <Title headingLevel="h2">Model info</Title>
                  <Content component="p" className="form-subtitle-text">
                    Configure the model info you want to create.
                  </Content>
                </>
              }
            >
              <FormGroup label="Model name" isRequired fieldId="model-name">
                {isChecked ? (
                  <div className="form-fieldset-wrapper">
                    {modelNameInput}
                    <fieldset aria-hidden="true" className="form-fieldset">
                      <legend className="form-fieldset-legend">
                        <span>Model Name</span>
                      </legend>
                    </fieldset>
                  </div>
                ) : (
                  modelNameInput
                )}
              </FormGroup>
              <FormGroup label="Model description" fieldId="model-description">
                {isChecked ? (
                  <div className="form-fieldset-wrapper">
                    {modelDescriptionInput}
                    <fieldset aria-hidden="true" className="form-fieldset">
                      <legend className="form-fieldset-legend">
                        <span>Model Description</span>
                      </legend>
                    </fieldset>
                  </div>
                ) : (
                  modelDescriptionInput
                )}
              </FormGroup>
            </FormSection>
            <FormSection
              title={
                <>
                  <Title headingLevel="h2">Version info</Title>
                  <Content component="p" className="form-subtitle-text">
                    Configure the version info for the run that you want to register.
                  </Content>
                </>
              }
            >
              <FormGroup label="Version name" isRequired fieldId="version-name">
                {isChecked ? (
                  <div className="form-fieldset-wrapper">
                    {versionNameInput}
                    <fieldset aria-hidden="true" className="form-fieldset">
                      <legend className="form-fieldset-legend">
                        <span>Version Name</span>
                      </legend>
                    </fieldset>
                  </div>
                ) : (
                  versionNameInput
                )}
              </FormGroup>
              <FormGroup label="Version description" fieldId="version-description">
                {isChecked ? (
                  <div className="form-fieldset-wrapper">
                    {versionDescriptionInput}
                    <fieldset aria-hidden="true" className="form-fieldset">
                      <legend className="form-fieldset-legend">
                        <span>Version Description</span>
                      </legend>
                    </fieldset>
                  </div>
                ) : (
                  versionDescriptionInput
                )}
              </FormGroup>
              <FormGroup label="Source model format" fieldId="source-model-format">
                {isChecked ? (
                  <div className="form-fieldset-wrapper">
                    {sourceModelFormatInput}
                    <fieldset aria-hidden="true" className="form-fieldset">
                      <legend className="form-fieldset-legend">
                        <span>Source Model Format</span>
                      </legend>
                    </fieldset>
                  </div>
                ) : (
                  sourceModelFormatInput
                )}
              </FormGroup>
            </FormSection>
            <FormSection
              title={
                <>
                  <Title headingLevel="h2">Model location</Title>
                  <Content component="p" className="form-subtitle-text">
                    Specify the model location by providing either the object storage details or the
                    URI.
                  </Content>
                </>
              }
            >
              <Radio
                isChecked={modelLocationType === ModelLocationType.ObjectStorage}
                name="location-type-object-storage"
                onChange={() => {
                  setData('modelLocationType', ModelLocationType.ObjectStorage);
                }}
                label="Object storage"
                id="location-type-object-storage"
              />
              {modelLocationType === ModelLocationType.ObjectStorage && (
                <>
                  <FormGroup label="Endpoint" isRequired fieldId="location-endpoint">
                    {isChecked ? (
                      <div className="form-fieldset-wrapper">
                        {endpointInput}
                        <fieldset aria-hidden="true" className="form-fieldset">
                          <legend className="form-fieldset-legend">
                            <span>Endpoint</span>
                          </legend>
                        </fieldset>
                      </div>
                    ) : (
                      endpointInput
                    )}
                  </FormGroup>
                  <FormGroup label="Bucket" isRequired fieldId="location-bucket">
                    {isChecked ? (
                      <div className="form-fieldset-wrapper">
                        {bucketInput}
                        <fieldset aria-hidden="true" className="form-fieldset">
                          <legend className="form-fieldset-legend">
                            <span>Bucket</span>
                          </legend>
                        </fieldset>
                      </div>
                    ) : (
                      bucketInput
                    )}
                  </FormGroup>
                  <FormGroup label="Region" fieldId="location-region">
                    {isChecked ? (
                      <div className="form-fieldset-wrapper">
                        {regionInput}
                        <fieldset aria-hidden="true" className="form-fieldset">
                          <legend className="form-fieldset-legend">
                            <span>Region</span>
                          </legend>
                        </fieldset>
                      </div>
                    ) : (
                      regionInput
                    )}
                  </FormGroup>
                  <FormGroup label="Path" isRequired fieldId="location-path">
                    {isChecked ? (
                      <Split hasGutter>
                        <SplitItem>
                          <InputGroupText isPlain>/</InputGroupText>
                        </SplitItem>
                        <SplitItem isFilled>
                          <InputGroupItem>
                            <div className="form-fieldset-wrapper">
                              {pathInput}
                              <fieldset aria-hidden="true" className="form-fieldset">
                                <legend className="form-fieldset-legend">
                                  <span>Path</span>
                                </legend>
                              </fieldset>
                            </div>{' '}
                            : {pathInput}
                          </InputGroupItem>
                        </SplitItem>
                      </Split>
                    ) : (
                      pathInput
                    )}
                    <HelperText>
                      <HelperTextItem>
                        Enter a path to a model or folder. This path cannot point to a root folder.
                      </HelperTextItem>
                    </HelperText>
                  </FormGroup>
                </>
              )}
              <Radio
                isChecked={modelLocationType === ModelLocationType.URI}
                name="location-type-uri"
                onChange={() => {
                  setData('modelLocationType', ModelLocationType.URI);
                }}
                label="URI"
                id="location-type-uri"
              />
              {modelLocationType === ModelLocationType.URI && (
                <>
                  <FormGroup label="URI" isRequired fieldId="location-uri">
                    <div className="form-fieldset-wrapper">
                      <TextInput
                        isRequired
                        type="text"
                        id="location-uri"
                        name="location-uri"
                        value={modelLocationURI}
                        onChange={(_e, value) => setData('modelLocationURI', value)}
                      />
                      <fieldset aria-hidden="true" className="form-fieldset">
                        <legend className="form-fieldset-legend">
                          <span>URI</span>
                        </legend>
                      </fieldset>
                    </div>
                  </FormGroup>
                </>
              )}
            </FormSection>
          </StackItem>
          {error && (
            <StackItem>
              <Alert
                isInline
                variant="danger"
                title={error.name}
                actionClose={<AlertActionCloseButton onClose={() => setError(undefined)} />}
              >
                {error.message}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <ActionGroup>
              <Button
                isDisabled={isSubmitDisabled}
                variant="primary"
                id="create-button"
                data-testid="create-button"
                isLoading={loading}
                onClick={() => handleSubmit()}
              >
                Register model
              </Button>
              <Button
                isDisabled={loading}
                variant="link"
                id="cancel-button"
                onClick={() => resetData()}
              >
                Cancel
              </Button>
            </ActionGroup>
          </StackItem>
        </Stack>
      </Form>
    </ApplicationsPage>
  );
};

export default RegisterModel;
