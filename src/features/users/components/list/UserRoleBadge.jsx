import { Chip } from '../../../../components/ui/Chip';
import { getRoleTone, getRoleLabel } from '../../utils/userStatusHelpers';

export const UserRoleBadge = ({ role }) => {
  return (
    <Chip tone={getRoleTone(role)}>
      {getRoleLabel(role)}
    </Chip>
  );
};

export default UserRoleBadge;
