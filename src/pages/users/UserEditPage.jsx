import { useParams, useNavigate } from 'react-router-dom';
import useUserDetail from '../../features/users/hooks/useUserDetail';
import useUserMutations from '../../features/users/hooks/useUserMutations';
import UsersPageHeader from '../../features/users/components/layout/UsersPageHeader';
import UserForm from '../../features/users/components/form/UserForm';
import { mapUserToFormValues } from '../../features/users/utils/userMappers';

/**
 * User Edit Page
 * Page for editing existing users
 */
function UserEditPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isLoadingUser } = useUserDetail(userId);
  const { updateUser, isLoading: isSaving } = useUserMutations();

  const handleSubmit = async (values) => {
    try {
      await updateUser(userId, values);
      navigate(`/dashboard/users/${userId}`);
    } catch (error) {
      // Error is handled by useUserMutations
      console.error('Update user error:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/users/${userId}`);
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-brand-primary dark:border-t-brand-hover"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cargando usuario...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Usuario no encontrado
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            El usuario que intentas editar no existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <UsersPageHeader
        title={`Editar Usuario: ${user.name}`}
        subtitle="Modifica la información del usuario"
      />

      <UserForm
        mode="edit"
        initialValues={mapUserToFormValues(user)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  );
}

export default UserEditPage;
