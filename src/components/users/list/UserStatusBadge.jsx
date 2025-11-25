import { Chip } from '../../ui/Chip';
import { getStatusTone, getStatusLabel } from '../../../utils/userStatusHelpers';

export const UserStatusBadge = ({ status, dataCy }) => {
  return (
    <Chip tone={getStatusTone(status)} dataCy={dataCy}>
      {getStatusLabel(status)}
    </Chip>
  );
};

export default UserStatusBadge;
