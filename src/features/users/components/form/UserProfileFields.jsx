
export const UserProfileFields = ({ values, onChange, mode = 'create', errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  const inputClass = "mt-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-[#f6f6f6] dark:bg-gray-700 px-3 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-brand-primary dark:focus:border-brand-hover focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-[rgba(60,71,135,0.15)] dark:focus:ring-[rgba(64,153,175,0.15)]";
  const labelClass = "text-sm font-semibold text-brand-primary dark:text-brand-hover";
  const errorClass = "text-xs text-red-500 dark:text-red-400 mt-1";

  return (
    <div className="space-y-4">
      {}
      <div className="flex flex-col">
        <label htmlFor="name" className={labelClass}>
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Juan Pérez"
          value={values.name || ''}
          onChange={handleChange}
          required
          className={inputClass}
        />
        {errors.name && <span className={errorClass}>{errors.name}</span>}
      </div>

      {}
      <div className="flex flex-col">
        <label htmlFor="email" className={labelClass}>
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="usuario@ejemplo.com"
          value={values.email || ''}
          onChange={handleChange}
          autoComplete="username"
          required
          className={inputClass}
        />
        {errors.email && <span className={errorClass}>{errors.email}</span>}
      </div>

      {}
      {mode === 'create' && (
        <div className="flex flex-col">
          <label htmlFor="password" className={labelClass}>
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={values.password || ''}
            onChange={handleChange}
            autoComplete="new-password"
            required
            minLength={6}
            className={inputClass}
          />
          {errors.password && <span className={errorClass}>{errors.password}</span>}
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Mínimo 6 caracteres
          </span>
        </div>
      )}

      {}
      <div className="flex flex-col">
        <label htmlFor="phone" className={labelClass}>
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="+1234567890"
          value={values.phone || ''}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.phone && <span className={errorClass}>{errors.phone}</span>}
      </div>

      {}
      <div className="flex flex-col">
        <label htmlFor="branch" className={labelClass}>
          Sucursal
        </label>
        <input
          id="branch"
          type="text"
          name="branch"
          placeholder="Sucursal Central"
          value={values.branch || ''}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.branch && <span className={errorClass}>{errors.branch}</span>}
      </div>
    </div>
  );
};

export default UserProfileFields;
