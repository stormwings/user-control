import { FiActivity } from 'react-icons/fi';
import { Card, CardHeader } from '../../ui/Card';

export const UserAuditMiniList = ({ auditLog, isLoading }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader title="Actividad Reciente" subtitle="Últimos eventos" />

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-brand-primary dark:border-t-brand-hover"></div>
        </div>
      ) : auditLog && auditLog.length > 0 ? (
        <div className="space-y-3">
          {auditLog.slice(0, 5).map((event, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <FiActivity className="text-sm text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {event.action || event.event || event.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatDate(event.timestamp || event.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <FiActivity className="text-2xl text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sin actividad registrada
          </p>
        </div>
      )}
    </Card>
  );
};

export default UserAuditMiniList;
