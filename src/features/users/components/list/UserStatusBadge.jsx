import { Chip } from '../../../../components/ui/Chip';
import { getStatusTone, getStatusLabel } from '../../utils/userStatusHelpers';

/**
 * User Status Badge Component
 */
export const UserStatusBadge = ({ status }) => {
  return (
    <Chip tone={getStatusTone(status)}>
      {getStatusLabel(status)}
    </Chip>
  );
};

export default UserStatusBadge;
