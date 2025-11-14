import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { UserProfileFields } from './UserProfileFields';
import { UserRoleSelect } from './UserRoleSelect';
import { UserStatusSelect } from './UserStatusSelect';
import { UserRole, UserStatus } from '../../types/userTypes';

export const UserForm = ({
  mode = 'create',
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [values, setValues] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    password: '',
    phone: initialValues.phone || '',
    branch: initialValues.branch || '',
    role: initialValues.role || UserRole.SELLER,
    status: initialValues.status || UserStatus.ACTIVE,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!values.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!values.email?.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (mode === 'create' && !values.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (mode === 'create' && values.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!values.role) {
      newErrors.role = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {mode === 'create' ? 'Información del Usuario' : 'Editar Información'}
        </h2>

        <UserProfileFields
          values={values}
          onChange={setValues}
          mode={mode}
          errors={errors}
        />
      </Card>

      {}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Permisos y Estado
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserRoleSelect
            value={values.role}
            onChange={(role) => setValues({ ...values, role })}
          />

          {mode === 'edit' && (
            <UserStatusSelect
              value={values.status}
              onChange={(status) => setValues({ ...values, status })}
            />
          )}
        </div>

        {errors.role && (
          <span className="text-xs text-red-500 dark:text-red-400 mt-2 block">
            {errors.role}
          </span>
        )}
      </Card>

      {}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading
            ? (mode === 'create' ? 'Creando...' : 'Guardando...')
            : (mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios')}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
