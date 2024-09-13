import * as React from 'react';
import { SearchInput, ToolbarFilter, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router';
import { SearchType } from '~/concepts/dashboard/DashboardSearchField';
import { RegisteredModel } from '~/concepts/modelRegistry/types';
import SimpleDropdownSelect from '~/components/SimpleDropdownSelect';
import { filterRegisteredModels } from '~/pages/modelRegistry/screens/utils';
import { ModelRegistrySelectorContext } from '~/concepts/modelRegistry/context/ModelRegistrySelectorContext';
import EmptyModelRegistryState from '~/pages/modelRegistry/screens/components/EmptyModelRegistryState';
import {
  registerModelUrl,
  registeredModelArchiveUrl,
} from '~/pages/modelRegistry/screens/routeUtils';
import { asEnumMember } from '~/utilities/utils';
import RegisteredModelTable from './RegisteredModelTable';
import RegisteredModelsTableToolbar from './RegisteredModelsTableToolbar';
import './MUI-theme.scss';

type RegisteredModelListViewProps = {
  registeredModels: RegisteredModel[];
  refresh: () => void;
};

const RegisteredModelListView: React.FC<RegisteredModelListViewProps> = ({
  registeredModels: unfilteredRegisteredModels,
  refresh,
}) => {
  const navigate = useNavigate();
  const { preferredModelRegistry } = React.useContext(ModelRegistrySelectorContext);
  const [searchType, setSearchType] = React.useState<SearchType>(SearchType.KEYWORD);
  const [search, setSearch] = React.useState('');

  const searchTypes = React.useMemo(() => [SearchType.KEYWORD], []); // TODO Add owner once RHOAIENG-7566 is completed.

  if (unfilteredRegisteredModels.length === 0) {
    return (
      <EmptyModelRegistryState
        testid="empty-registered-models"
        title="No models in selected registry"
        description={`${preferredModelRegistry?.metadata.name} has no models registered to it. Register model to this registry, or select a different one.`}
        primaryActionText="Register model"
        secondaryActionText="View archived models"
        primaryActionOnClick={() => {
          navigate(registerModelUrl(preferredModelRegistry?.metadata.name));
        }}
        secondaryActionOnClick={() => {
          navigate(registeredModelArchiveUrl(preferredModelRegistry?.metadata.name));
        }}
      />
    );
  }

  const filteredRegisteredModels = filterRegisteredModels(
    unfilteredRegisteredModels,
    search,
    searchType,
  );

  const resetFilters = () => {
    setSearch('');
  };

  const toggleGroupItems = (
    <ToolbarGroup variant="filter-group" alignItems="center">
      <ToolbarFilter
        labels={search === '' ? [] : [search]}
        deleteLabel={() => setSearch('')}
        deleteLabelGroup={() => setSearch('')}
        categoryName="Keyword"
      >
        <SimpleDropdownSelect
          options={searchTypes.map((key) => ({
            key,
            label: key,
          }))}
          value={searchType}
          onChange={(newSearchType) => {
            const newSearchTypeInput = asEnumMember(newSearchType, SearchType);
            if (newSearchTypeInput !== null) {
              setSearchType(newSearchTypeInput);
            }
          }}
          icon={<FilterIcon />}
        />
      </ToolbarFilter>
      <ToolbarItem variant="label">
        <SearchInput
          placeholder={`Find by ${searchType.toLowerCase()}`}
          value={search}
          onChange={(_, searchValue) => {
            setSearch(searchValue);
          }}
          onClear={() => setSearch('')}
          style={{ minWidth: '200px' }}
          data-testid="registered-model-table-search"
        />
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <RegisteredModelTable
      refresh={refresh}
      clearFilters={resetFilters}
      registeredModels={filteredRegisteredModels}
      toolbarContent={<RegisteredModelsTableToolbar toggleGroupItems={toggleGroupItems} />}
    />
  );
};

export default RegisteredModelListView;
