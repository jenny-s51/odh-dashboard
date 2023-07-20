import * as React from 'react';
import {
	InputGroup,
	SearchInput, InputGroupItem
} from '@patternfly/react-core';
import {
	Select,
	SelectOption
} from '@patternfly/react-core/deprecated';

export enum SearchType {
  NAME = 'Name',
  USER = 'User',
  PROJECT = 'Project',
}

type SearchFieldProps = {
  types: string[];
  searchType: SearchType;
  onSearchTypeChange: (searchType: SearchType) => void;
  searchValue: string;
  onSearchValueChange: (searchValue: string) => void;
};

const SearchField: React.FC<SearchFieldProps> = ({
  types,
  searchValue,
  searchType,
  onSearchValueChange,
  onSearchTypeChange,
}) => {
  const [typeOpen, setTypeOpen] = React.useState(false);

  return (
    <InputGroup>
      <InputGroupItem><Select
        removeFindDomNode
        isOpen={typeOpen}
        onToggle={() => setTypeOpen(!typeOpen)}
        selections={searchType}
        onSelect={(e, key) => {
          if (typeof key === 'string') {
            onSearchTypeChange(SearchType[key]);
            setTypeOpen(false);
          }
        }}
      >
        {types.map((key) => (
          <SelectOption key={key} value={key}>
            {SearchType[key]}
          </SelectOption>
        ))}
      </Select></InputGroupItem>
      <InputGroupItem><SearchInput
        placeholder={`Find by ${searchType.toLowerCase()}`}
        value={searchValue}
        onChange={(_, newSearch) => {
          onSearchValueChange(newSearch);
        }}
        onClear={() => onSearchValueChange('')}
        style={{ minWidth: '200px' }}
      /></InputGroupItem>
    </InputGroup>
  );
};

export default SearchField;
