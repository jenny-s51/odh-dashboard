import * as React from 'react';
import userCardImage from '~/images/card-img-user.svg';
import groupCardImage from '~/images/card-img-group.svg';
import OverviewCard from './OverviewCard';

type UserGroupsCardProps = {
  users: number;
  groups: number;
};

const UserGroupsCard: React.FC<UserGroupsCardProps> = ({ users, groups }) => (
  <div className="odh-project-overview__user-group-card">
    <OverviewCard
      count={users}
      title="Users"
      icon={() => <img style={{ height: '32px' }} src={userCardImage} alt="Users" />}
      ignoreEmptyState
      typeModifier="user"
    />
    <OverviewCard
      count={groups}
      title="Groups"
      icon={() => <img style={{ height: '32px' }} src={groupCardImage} alt="Groups" />}
      ignoreEmptyState
      typeModifier="group"
    />
  </div>
);

export default UserGroupsCard;
