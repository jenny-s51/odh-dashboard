import * as React from 'react';
import {
  BanIcon,
  ClipboardListIcon,
  HourglassHalfIcon,
  HourglassStartIcon,
  InProgressIcon,
  NotStartedIcon,
  SyncAltIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import classNames from 'classnames';
import { YellowExclamationTriangleIcon } from './icons';
import { RedExclamationCircleIcon, GreenCheckCircleIcon, BlueInfoCircleIcon } from './icons';

import './Status.scss';

type StatusIconAndTextProps = {
  title?: string;
  icon?: React.ReactElement;
  className?: string;
};
const StatusIconAndText: React.FC<StatusIconAndTextProps> = ({ icon, title, className }) => {
  if (!title) {
    return <>-</>;
  }

  return (
    <span className={classNames('odh-icon-and-text', className)} title={title}>
      {icon &&
        React.cloneElement(icon, {
          className: classNames(
            icon.props.className,
            'odh-icon-and-text__icon odh-icon-flex-child',
          ),
        })}
      {title}
    </span>
  );
};

type GenericStatusProps = {
  title?: string;
  Icon?: React.ComponentType<{ title?: string }>;
};

const GenericStatus: React.FC<GenericStatusProps> = (props) => {
  const { Icon, title, ...restProps } = props;
  return <StatusIconAndText {...restProps} title={title} icon={Icon && <Icon title={title} />} />;
};

const ErrorStatus: React.FC<GenericStatusProps> = (props) => (
  <GenericStatus {...props} Icon={RedExclamationCircleIcon} />
);

const InfoStatus: React.FC<GenericStatusProps> = (props) => (
  <GenericStatus {...props} Icon={BlueInfoCircleIcon} />
);

const ProgressStatus: React.FC<GenericStatusProps> = (props) => (
  <GenericStatus {...props} Icon={InProgressIcon} />
);

const SuccessStatus: React.FC<GenericStatusProps> = (props) => (
  <GenericStatus {...props} Icon={GreenCheckCircleIcon} />
);

export type StatusProps = {
  status: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const Status: React.FC<StatusProps> = ({ status, title, children, className }) => {
  const statusProps = { title: title || status, className };
  switch (status) {
    case 'New':
      return <StatusIconAndText {...statusProps} icon={<HourglassStartIcon />} />;

    case 'Pending':
      return <StatusIconAndText {...statusProps} icon={<HourglassHalfIcon />} />;

    case 'Planning':
      return <StatusIconAndText {...statusProps} icon={<ClipboardListIcon />} />;

    case 'ContainerCreating':
    case 'UpgradePending':
    case 'PendingUpgrade':
    case 'PendingRollback':
      return <ProgressStatus {...statusProps} />;

    case 'In Progress':
    case 'Installing':
    case 'InstallReady':
    case 'Replacing':
    case 'Running':
    case 'Updating':
    case 'Upgrading':
    case 'PendingInstall':
      return <StatusIconAndText {...statusProps} icon={<SyncAltIcon />} />;

    case 'Cancelled':
    case 'Deleting':
    case 'Expired':
    case 'Not Ready':
    case 'Cancelling':
    case 'Terminating':
    case 'Superseded':
    case 'Uninstalling':
      return <StatusIconAndText {...statusProps} icon={<BanIcon />} />;

    case 'Warning':
    case 'RequiresApproval':
      return <StatusIconAndText {...statusProps} icon={<YellowExclamationTriangleIcon />} />;

    case 'ContainerCannotRun':
    case 'CrashLoopBackOff':
    case 'Critical':
    case 'ErrImagePull':
    case 'Error':
    case 'Failed':
    case 'Failure':
    case 'ImagePullBackOff':
    case 'InstallCheckFailed':
    case 'Lost':
    case 'Rejected':
    case 'UpgradeFailed':
      return <ErrorStatus {...statusProps}>{children}</ErrorStatus>;

    case 'Accepted':
    case 'Active':
    case 'Bound':
    case 'Complete':
    case 'Completed':
    case 'Created':
    case 'Enabled':
    case 'Succeeded':
    case 'Ready':
    case 'Up to date':
    case 'Loaded':
    case 'Provisioned as node':
    case 'Preferred':
    case 'Connected':
    case 'Deployed':
      return <SuccessStatus {...statusProps} />;

    case 'Info':
      return <InfoStatus {...statusProps}>{children}</InfoStatus>;

    case 'Unknown':
      return <StatusIconAndText {...statusProps} icon={<UnknownIcon />} />;

    case 'PipelineNotStarted':
      return <StatusIconAndText {...statusProps} icon={<NotStartedIcon />} />;

    default:
      return <StatusIconAndText {...statusProps} />;
  }
};

export default Status;
