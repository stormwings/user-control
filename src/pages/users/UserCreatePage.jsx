import { useNavigate } from 'react-router-dom';
import UsersPageHeader from '../../features/users/components/layout/UsersPageHeader';
import UserForm from '../../features/users/components/form/UserForm';
import useUserMutations from '../../features/users/hooks/useUserMutations';

/**
 * User Create Page
 * Page for creating new users
 */
function UserCreatePage() {
  const navigate = useNavigate();
  const { createUser, isLoading } = useUserMutations();

  const handleSubmit = async (values) => {
    try {
      const user = await createUser(values);
      navigate(`/dashboard/users/${user._id}`);
    } catch (error) {
      // Error is handled by useUserMutations
      console.error('Create user error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <UsersPageHeader
        title="Nuevo Usuario"
        subtitle="Crea un nuevo usuario para el sistema"
      />

      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

export default UserCreatePage;
