import * as React from 'react';
import {
  DEFAULT_TASK_NODE_TYPE,
  DEFAULT_WHEN_OFFSET,
  DEFAULT_WHEN_SIZE,
  PipelineNodeModel,
  RunStatus,
  WhenStatus,
} from '@patternfly/react-topology';
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { ListIcon } from '@patternfly/react-icons/dist/esm/icons/list-icon';
import { MonitoringIcon } from '@patternfly/react-icons/dist/esm/icons/monitoring-icon';
import './topology.css';

export const NODE_PADDING_VERTICAL = 45;
export const NODE_PADDING_HORIZONTAL = 15;

export const ROW_HEIGHT = 100;
export const COLUMN_WIDTH = 250;

export const DEFAULT_TASK_WIDTH = 180;
export const FINALLY_TASK_WIDTH = DEFAULT_TASK_WIDTH - DEFAULT_WHEN_OFFSET - DEFAULT_WHEN_SIZE;
export const DEFAULT_TASK_HEIGHT = 32;
export const DEFAULT_FINALLY_NODE_TYPE = 'DEFAULT_FINALLY_NODE';

export const TASK_STATUSES = [
  undefined,
  RunStatus.Succeeded,
  RunStatus.Failed,
  RunStatus.Running,
  RunStatus.InProgress,
  RunStatus.FailedToStart,
  RunStatus.Skipped,
  RunStatus.Cancelled,
  RunStatus.Pending,
  RunStatus.Idle,
];

const STATUS_PER_ROW = 4;
const GRAPH_MARGIN_TOP = 40;
const PARALLEL_TASKS_COUNT = 3;
const PARALLEL_TASK_DEPTH = 2;
const FINALLY_TASKS_COUNT = 2;

export const useDemoPipelineNodes = (
  showContextMenu: boolean,
  showBadges: boolean,
  // showIcons: boolean,
  badgeTooltips: boolean,
  layout?: string,
  showGroups = false,
): PipelineNodeModel[] =>
  React.useMemo(() => {
    // Create a task node for each task status
    const tasks = TASK_STATUSES.map((status, index) => {
      // Set all the standard fields
      const task: PipelineNodeModel = {
        id: `task-${status}`,
        type: DEFAULT_TASK_NODE_TYPE,
        label: `${status || 'No status'} Task`,
        width: DEFAULT_TASK_WIDTH + (showContextMenu ? 10 : 0) + (showBadges ? 40 : 0),
        height: DEFAULT_TASK_HEIGHT,
        style: {
          padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL],
        },
        runAfterTasks: [],
      };

      // put options in data, our DEMO task node will pass them along to the TaskNode
      task.data = {
        status,
        badge: showBadges ? '3/4' : undefined,
        badgeTooltips,
        showContextMenu,
        columnGroup: index % STATUS_PER_ROW,
      };

      // If not using a layout, manually place the node by setting the x,y location
      if (!layout) {
        const row = Math.ceil((index + 1) / STATUS_PER_ROW) - 1;
        const column = index % STATUS_PER_ROW;
        const columnWidth = COLUMN_WIDTH + (showBadges ? 32 : 0) + (showContextMenu ? 20 : 0);
        task.x = column * columnWidth;
        task.y = GRAPH_MARGIN_TOP + row * ROW_HEIGHT;
      }

      return task;
    });

    // Add when tasks to the nodes that are not first in the row
    const whenTasks = tasks.filter(
      (task, index) => index % (Math.floor(tasks.length / (STATUS_PER_ROW - 1)) + 1) !== 0,
    );
    whenTasks.forEach((task, index) => {
      task.data.whenStatus = index % 2 === 0 ? WhenStatus.Met : WhenStatus.Unmet;
      task.data.whenOffset = DEFAULT_WHEN_OFFSET;
      task.data.whenSize = DEFAULT_WHEN_SIZE;
    });

    // Connect the tasks in each row by setting the `runAfterTasks` value for each task
    for (let i = 0; i < tasks.length; i++) {
      tasks[i + 1].runAfterTasks?.push(tasks[i].id);
      i++;
      if (i + 1 < tasks.length) {
        tasks[i + 1].runAfterTasks?.push(tasks[i].id);
      }
      i++;
      if (i + 1 < tasks.length) {
        tasks[i + 1].runAfterTasks?.push(tasks[i].id);
      }
      i++;
    }

    if (layout) {
      const parallelTasks: PipelineNodeModel[] = [];

      for (let i = 0; i < PARALLEL_TASKS_COUNT; i++) {
        const parallelTask: PipelineNodeModel = {
          id: `parallelTasks-${i}`,
          type: DEFAULT_TASK_NODE_TYPE,
          label: `Parallel Sub-Task ${i}`,
          width: DEFAULT_TASK_WIDTH + (showContextMenu ? 10 : 0) + (showBadges ? 40 : 0),
          height: DEFAULT_TASK_HEIGHT,
          data: {
            leadIcon: <CubeIcon width={16} height={16} />,
          },
          style: {
            padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL],
          },
          runAfterTasks: [],
        };

        // put options in data, our DEMO task node will pass them along to the TaskNode
        parallelTask.data = {
          status,
          showContextMenu,
        };
        parallelTasks.push(parallelTask);
      }

      let usedNodes = 0;
      while (usedNodes < parallelTasks.length) {
        for (let depth = 0; depth < PARALLEL_TASK_DEPTH; depth++) {
          if (usedNodes < parallelTasks.length) {
            if (depth === 0) {
              parallelTasks[usedNodes].runAfterTasks = [tasks[9].id];
            } else {
              parallelTasks[usedNodes].runAfterTasks = [parallelTasks[usedNodes - 1].id];
            }
          }
          usedNodes++;
        }
      }
      tasks.push(...parallelTasks);

      if (showGroups) {
        tasks.push({
          id: `group-parallels`,
          type: 'task-group',
          children: parallelTasks.map((t) => t.id),
          group: true,
          label: 'Parallel tasks',
          collapsed: true,
          data: {
            selected: true,
            badge: 'Label',
            badgeColor: '#F0F0F0',
            badgeTextColor: '#000000',
            badgeBorderColor: '#F0F0F0',
            collapsedWidth: 75,
            collapsedHeight: 42,
            collapsible: true,
          },
        });
      }
    }

    const finallyNodes = [];
    for (let i = 0; i < FINALLY_TASKS_COUNT; i++) {
      const finallyNode: PipelineNodeModel = {
        id: `finally-${i}`,
        type: DEFAULT_FINALLY_NODE_TYPE,
        label: `Finally task ${i}`,
        width: FINALLY_TASK_WIDTH,
        height: DEFAULT_TASK_HEIGHT,
        style: { paddingLeft: DEFAULT_WHEN_SIZE + DEFAULT_WHEN_OFFSET },
      };

      if (!layout) {
        const columnWidth = COLUMN_WIDTH + (showBadges ? 32 : 0) + (showContextMenu ? 20 : 0);
        finallyNode.x = STATUS_PER_ROW * columnWidth;
        finallyNode.y =
          GRAPH_MARGIN_TOP + ((3 - FINALLY_TASKS_COUNT) * ROW_HEIGHT) / 2 + ROW_HEIGHT * i;
      }
      finallyNodes.push(finallyNode);
    }

    const finallyGroup = {
      id: 'finally-group',
      type: 'finally-group',
      children: finallyNodes.map((n) => n.id),
      group: true,
    };

    if (showGroups) {
      const taskGroups = tasks.reduce((acc: PipelineNodeModel[], task) => {
        if (task.data?.columnGroup !== undefined) {
          let taskGroup = acc.find(
            (group: PipelineNodeModel) => group.id === `group-${task.data.columnGroup}`,
          );
          if (!taskGroup) {
            taskGroup = {
              id: `group-${task.data.columnGroup}`,
              type: 'task-group',
              children: [],
              group: true,
              label: `Group ${task.data.columnGroup}`,
              collapsed: true,
              data: {
                collapsedWidth: 75,
                collapsedHeight: 42,
                collapsible: true,
                badgeColor: '#F0F0F0',
                badgeTextColor: '#000000',
                badgeBorderColor: '#F0F0F0',
              },
            };
            acc.push(taskGroup);
          }
          taskGroup.children?.push(task.id);
        }
        return acc;
      }, [] as PipelineNodeModel[]);

      tasks.push(...taskGroups);
    }

    const iconTask1: PipelineNodeModel = {
      id: `task-icon-1`,
      type: DEFAULT_TASK_NODE_TYPE,
      label: `iris_dataset`,
      width: DEFAULT_TASK_WIDTH + (showContextMenu ? 10 : 0) + (showBadges ? 40 : 0),
      height: DEFAULT_TASK_HEIGHT,
      style: {
        padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL],
      },
      runAfterTasks: [],
    };

    // put options in data, our DEMO task node will pass them along to the TaskNode
    iconTask1.data = {
      status: RunStatus.Failed,
      badge: showBadges ? '3/4' : undefined,
      badgeTooltips,
      showContextMenu,
      showStatusState: false,
      columnGroup: (TASK_STATUSES.length % STATUS_PER_ROW) + 1,
      leadIcon: <ListIcon className="list-lead-icon" width={23} height={23} />,
    };

    if (!layout) {
      const row = Math.ceil((TASK_STATUSES.length + 1) / STATUS_PER_ROW) - 1;
      const columnWidth = COLUMN_WIDTH + (showBadges ? 32 : 0) + (showContextMenu ? 20 : 0);
      iconTask1.x = columnWidth;
      iconTask1.y = GRAPH_MARGIN_TOP + row * ROW_HEIGHT;
    }
    tasks.push(iconTask1);

    const iconTask2: PipelineNodeModel = {
      id: `task-icon-2`,
      type: DEFAULT_TASK_NODE_TYPE,
      label: 'iris_dataset',
      width: DEFAULT_TASK_WIDTH + (showContextMenu ? 10 : 0) + (showBadges ? 40 : 0),
      height: DEFAULT_TASK_HEIGHT,
      style: {
        padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL],
      },
      runAfterTasks: [iconTask1.id],
    };

    // put options in data, our DEMO task node will pass them along to the TaskNode
    iconTask2.data = {
      badge: showBadges ? '3/4' : undefined,
      badgeTooltips,
      showContextMenu,
      columnGroup: (TASK_STATUSES.length % STATUS_PER_ROW) + 1,
      showStatusState: false,
      leadIcon: <MonitoringIcon className="monitoring-lead-icon" width={23} height={23} />,
    };

    if (!layout) {
      const row = Math.ceil((TASK_STATUSES.length + 1) / STATUS_PER_ROW) - 1;
      const columnWidth = COLUMN_WIDTH + (showBadges ? 32 : 0) + (showContextMenu ? 20 : 0);
      iconTask2.x = 2 * columnWidth;
      iconTask2.y = GRAPH_MARGIN_TOP + row * ROW_HEIGHT;
    }
    tasks.push(iconTask2);

    return [...tasks, ...finallyNodes, finallyGroup];
  }, [badgeTooltips, layout, showBadges, showContextMenu, showGroups]);
