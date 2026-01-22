import { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { UserProfileFields } from './UserProfileFields';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const UserForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
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

    if (!values.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (values.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
    <form onSubmit={handleSubmit} className="space-y-6" data-cy={USERS_TEST_IDS.USER_FORM}>
      <Card>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Información del Usuario
        </h2>

        <UserProfileFields
          values={values}
          onChange={setValues}
          errors={errors}
        />
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          dataCy={USERS_TEST_IDS.USER_FORM_CANCEL_BUTTON}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          dataCy={USERS_TEST_IDS.USER_FORM_SUBMIT_BUTTON}
        >
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
