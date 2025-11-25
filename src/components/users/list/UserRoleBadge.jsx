import { Chip } from '../../ui/Chip';
import { getRoleTone, getRoleLabel } from '../../../utils/userStatusHelpers';

export const UserRoleBadge = ({ role, dataCy }) => {
  return (
    <Chip tone={getRoleTone(role)} dataCy={dataCy}>
      {getRoleLabel(role)}
    </Chip>
  );
};

export default UserRoleBadge;
