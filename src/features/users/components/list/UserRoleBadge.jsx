import { Chip } from '../../../../components/ui/Chip';
import { getRoleTone, getRoleLabel } from '../../utils/userStatusHelpers';

/**
 * User Role Badge Component
 */
export const UserRoleBadge = ({ role }) => {
  return (
    <Chip tone={getRoleTone(role)}>
      {getRoleLabel(role)}
    </Chip>
  );
};

export default UserRoleBadge;
