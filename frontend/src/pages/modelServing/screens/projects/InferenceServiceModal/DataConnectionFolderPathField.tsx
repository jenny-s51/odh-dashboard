import * as React from 'react';
import { FormGroup, InputGroup, InputGroupText, TextInput, InputGroupItem } from '@patternfly/react-core';

type DataConnectionFolderPathFieldProps = {
  folderPath: string;
  setFolderPath: (folderPath: string) => void;
};

const DataConnectionFolderPathField: React.FC<DataConnectionFolderPathFieldProps> = ({
  folderPath,
  setFolderPath,
}) => (
  <FormGroup fieldId="folder-path" label="Folder path">
    <InputGroup>
      <InputGroupText >/</InputGroupText>
      <InputGroupItem isFill ><TextInput
        aria-label="folder-path"
        type="text"
        value={folderPath}
        placeholder="eg. data"
        onChange={(_event, value) => setFolderPath(value)}
      /></InputGroupItem>
    </InputGroup>
  </FormGroup>
);

export default DataConnectionFolderPathField;
