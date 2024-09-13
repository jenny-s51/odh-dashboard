import React from 'react';
import {
  ActionList,
  ActionListItem,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th } from '@patternfly/react-table';
import { ConnectionTypeField, ConnectionTypeFieldType } from '~/concepts/connectionTypes/types';
import useDraggableTableControlled from '~/utilities/useDraggableTableControlled';
import { columns } from '~/pages/connectionTypes/manage/fieldTableColumns';
import ConnectionTypeFieldModal from './ConnectionTypeFieldModal';
import ManageConnectionTypeFieldsTableRow from './ManageConnectionTypeFieldsTableRow';
import { ConnectionTypeMoveFieldToSectionModal } from './ConnectionTypeFieldMoveModal';

type EmptyFieldsTableProps = {
  onAddSection: () => void;
  onAddField: () => void;
};

const EmptyFieldsTable: React.FC<EmptyFieldsTableProps> = ({ onAddSection, onAddField }) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader icon={<EmptyStateIcon icon={PlusCircleIcon} />} titleText="No fields" />
      <EmptyStateBody>
        Add fields to prompt users to input information, and optionally assign default values to
        those fields. Connection name and description fields are included by default.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="secondary" onClick={onAddSection}>
            Add section heading
          </Button>
          <Button variant="secondary" onClick={onAddField}>
            Add field
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  </Bullseye>
);

type Props = {
  fields: ConnectionTypeField[];
  onFieldsChange: (fields: ConnectionTypeField[]) => void;
};

const ManageConnectionTypeFieldsTable: React.FC<Props> = ({ fields, onFieldsChange }) => {
  const [modalField, setModalField] = React.useState<
    { field?: ConnectionTypeField; index?: number; isEdit?: boolean } | undefined
  >();
  const [moveToSectionModalField, setMoveToSectionModalField] = React.useState<{
    field: ConnectionTypeField;
    index: number;
  }>();

  const { tableProps, rowsToRender } = useDraggableTableControlled<ConnectionTypeField>(
    fields,
    onFieldsChange,
  );

  return (
    <>
      {fields.length > 0 ? (
        <>
          <Table data-testid="connection-type-fields-table" className={tableProps.className}>
            <Thead>
              <Tr>
                <Th screenReaderText="Drag and drop" />
                {columns.map((column, columnIndex) => (
                  <Th key={columnIndex} width={column.width}>
                    {column.label}
                  </Th>
                ))}
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody {...tableProps.tbodyProps}>
              {rowsToRender.map(({ data: row, rowProps }, index) => (
                <ManageConnectionTypeFieldsTableRow
                  key={index}
                  row={row}
                  rowIndex={index}
                  fields={fields}
                  onEdit={() => {
                    setModalField({
                      field: row,
                      isEdit: true,
                      index,
                    });
                  }}
                  onRemove={() => onFieldsChange(fields.filter((f, i) => i !== index))}
                  onDuplicate={(field) => {
                    setModalField({
                      field: structuredClone(field),
                    });
                  }}
                  onAddField={() => {
                    const nextSectionIndex = fields.findIndex(
                      (f, i) => i > index && f.type === ConnectionTypeFieldType.Section,
                    );
                    if (nextSectionIndex >= 0) {
                      setModalField({ index: nextSectionIndex });
                    } else {
                      setModalField({});
                    }
                  }}
                  onMoveToSection={() => {
                    setMoveToSectionModalField({ field: row, index });
                  }}
                  onChange={(updatedField) => {
                    onFieldsChange([
                      ...fields.slice(0, index),
                      updatedField,
                      ...fields.slice(index + 1),
                    ]);
                  }}
                  {...rowProps}
                />
              ))}
            </Tbody>
          </Table>
          <ActionList className="pf-v5-u-mt-md">
            <ActionListItem>
              <Button
                variant="secondary"
                onClick={() =>
                  setModalField({ field: { type: ConnectionTypeFieldType.Section, name: '' } })
                }
              >
                Add section heading
              </Button>
            </ActionListItem>
            <ActionListItem>
              <Button variant="secondary" onClick={() => setModalField({})}>
                Add field
              </Button>
            </ActionListItem>
          </ActionList>
        </>
      ) : (
        <EmptyFieldsTable
          onAddSection={() =>
            setModalField({ field: { type: ConnectionTypeFieldType.Section, name: '' } })
          }
          onAddField={() => setModalField({})}
        />
      )}
      {modalField ? (
        <ConnectionTypeFieldModal
          fields={fields}
          field={modalField.field}
          isEdit={modalField.isEdit}
          onClose={() => setModalField(undefined)}
          onSubmit={(field) => {
            if (modalField.field && modalField.isEdit && modalField.index !== undefined) {
              // update
              onFieldsChange([
                ...fields.slice(0, modalField.index),
                field,
                ...fields.slice(modalField.index + 1),
              ]);
            } else if (modalField.index != null) {
              // insert
              onFieldsChange([
                ...fields.slice(0, modalField.index),
                field,
                ...fields.slice(modalField.index),
              ]);
            } else {
              // add
              onFieldsChange([...fields, field]);
            }
            setModalField(undefined);
          }}
        />
      ) : undefined}
      {moveToSectionModalField && (
        <ConnectionTypeMoveFieldToSectionModal
          row={moveToSectionModalField}
          fields={fields}
          onClose={() => setMoveToSectionModalField(undefined)}
          onSubmit={(field, sectionIndex) => {
            const temp = fields.toSpliced(moveToSectionModalField.index, 1);
            const newFieldIndex =
              moveToSectionModalField.index < sectionIndex ? sectionIndex : sectionIndex + 1;
            onFieldsChange(temp.toSpliced(newFieldIndex, 0, field));
            setMoveToSectionModalField(undefined);
          }}
        />
      )}
    </>
  );
};

export default React.memo(ManageConnectionTypeFieldsTable);