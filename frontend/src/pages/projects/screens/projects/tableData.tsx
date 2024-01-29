import { SortableData } from '~/components/table';
import { ProjectKind } from '~/k8sTypes';
import { getProjectCreationTime, getProjectDisplayName } from '~/pages/projects/utils';

export const columns: SortableData<ProjectKind>[] = [
  {
    field: 'project',
    label: 'Project',
    sortable: false,
    colSpan: 3,
    hasRightBorder: true,
  },
  {
    field: 'Workbenches',
    label: 'Workbenches',
    sortable: false,
    colSpan: 2,
    hasRightBorder: true,
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
    rowSpan: 2,
  },
];
export const subColumns: SortableData<ProjectKind>[] = [
  {
    field: 'name',
    label: 'Name',
    sortable: (a, b) => getProjectDisplayName(a).localeCompare(getProjectDisplayName(b)),
  },
  {
    field: 'status',
    label: 'Status',
    sortable: false,
  },
  {
    field: 'created',
    label: 'Created',
    sortable: (a, b) => getProjectCreationTime(a) - getProjectCreationTime(b),
    hasRightBorder: true,
  },
  {
    field: 'workbench-name',
    label: 'Name',
    sortable: false,
  },
  {
    field: 'workbench-status',
    label: 'Status',
    sortable: false,
    hasRightBorder: true,
  },
];
export const columnsAlt: SortableData<ProjectKind>[] = [
  {
    field: 'expand',
    label: '',
    sortable: false,
  },
  {
    field: 'name',
    label: 'Name',
    sortable: (a, b) => getProjectDisplayName(a).localeCompare(getProjectDisplayName(b)),
  },
  {
    field: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    field: 'createdBy',
    label: 'Created by',
    sortable: true,
  },
  {
    field: 'created',
    label: 'Created',
    sortable: (a, b) => getProjectCreationTime(a) - getProjectCreationTime(b),
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
  },
];
