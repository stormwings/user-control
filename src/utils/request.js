import axios from "axios";
import { DEFAULT_API_URL } from '../constants';

const API_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const httpRequest = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default httpRequest;
