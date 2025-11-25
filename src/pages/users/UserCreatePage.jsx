import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UsersPageHeader from '../../components/users/layout/UsersPageHeader';
import UserForm from '../../components/users/form/UserForm';
import useUserMutations from '../../hooks/useUserMutations';
import { USERS_TEST_IDS } from '../../constants/testIds';

function UserCreatePage() {
  const navigate = useNavigate();
  const { createUser, isLoading } = useUserMutations();

  const handleSubmit = async (values) => {
    try {
      const user = await createUser(values);
      navigate(`/dashboard/users/${user._id}`);
    } catch (error) {
      console.error('Create user error:', error);
      toast.error(error || 'Error al crear usuario');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  return (
    <div className="flex flex-col gap-6 p-6" data-cy="user-create-page">
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
