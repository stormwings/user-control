import { LOCAL_STORAGE_KEYS } from '../constants';

export const saveUser = (user) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER));
};

export const removeUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
};

export const saveCart = (cart) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CART));
};

export const removeCart = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
};
