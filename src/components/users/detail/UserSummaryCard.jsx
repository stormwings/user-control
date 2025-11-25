import { FiMail } from 'react-icons/fi';
import { Card, CardHeader } from '../../ui/Card';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const UserSummaryCard = ({ user }) => {
  return (
    <Card dataCy={USERS_TEST_IDS.USER_DETAIL_CARD}>
      <CardHeader title="Información Básica" />

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400">
            Nombre completo
          </label>
          <p className="mt-1 text-sm text-gray-100">
            {user?.name || '—'}
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <FiMail className="text-xs" />
            Correo electrónico
          </label>
          <p className="mt-1 text-sm text-gray-100">
            {user?.email || '—'}
          </p>
        </div>

      </div>
    </Card>
  );
};

export default UserSummaryCard;
