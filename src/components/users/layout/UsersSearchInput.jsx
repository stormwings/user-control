import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Input } from '../../ui/Input';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const UsersSearchInput = ({ value, onChange, placeholder = "Buscar usuario...", debounceMs = 1500 }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setIsTyping(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onChange(newValue);
    }, debounceMs);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full sm:w-80">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isTyping ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-brand-hover" />
        ) : (
          <FiSearch className="text-gray-500" />
        )}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="pl-10"
        dataCy={USERS_TEST_IDS.USERS_SEARCH}
      />
    </div>
  );
};

export default UsersSearchInput;
