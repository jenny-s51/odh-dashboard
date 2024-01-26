import * as React from 'react';
import {
  CheckCircleIcon,
  InfoCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';
import classNames from 'classnames';

import './icons.scss';

export type ColoredIconProps = {
  className?: string;
  title?: string;
};

export const GreenCheckCircleIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <CheckCircleIcon
    data-test="success-icon"
    className={classNames('odh-icons__green-check-icon', className)}
    title={title}
  />
);

export const RedExclamationCircleIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ExclamationCircleIcon
    className={classNames('odh-icons__red-exclamation-icon', className)}
    title={title}
  />
);

export const YellowExclamationTriangleIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ExclamationTriangleIcon
    className={classNames('odh-icons__yellow-exclamation-icon', className)}
    title={title}
  />
);

export const BlueInfoCircleIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <InfoCircleIcon className={classNames('odh-icons__blue-info-icon', className)} title={title} />
);
