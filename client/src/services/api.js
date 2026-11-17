import axios from "axios";

const configuredBase = (import.meta.env.VITE_API_URL || "").trim();
export const API_BASE = configuredBase || "/api";
export const SERVER_ORIGIN = API_BASE.startsWith("http") ? new URL(API_BASE).origin : "";

const TOKEN_KEY = "cso_token";
const USER_KEY = "cso_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(token, user, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateStoredUser(user) {
  const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  }
}

export function resolveImage(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads") && SERVER_ORIGIN) return `${SERVER_ORIGIN}${url}`;
  return url;
}

export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message === "Network Error") return "Unable to reach the server. Please check that the API is running.";
  return error?.message || "Something went wrong. Please try again.";
}

const api = axios.create({ baseURL: API_BASE, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && getToken()) {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.dispatchEvent(new CustomEvent("cso:unauthorized"));
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  profile: () => api.get("/auth/profile").then((res) => res.data),
};

export const publicApi = {
  content: () => api.get("/content").then((res) => res.data),
  videos: () => api.get("/videos").then((res) => res.data),
  activities: (params) => api.get("/activities", { params }).then((res) => res.data),
  activity: (id) => api.get(`/activities/${id}`).then((res) => res.data),
  events: (params) => api.get("/events", { params }).then((res) => res.data),
  event: (id) => api.get(`/events/${id}`).then((res) => res.data),
  registerForEvent: (id, payload) => api.post(`/events/${id}/register`, payload).then((res) => res.data),
  gallery: (params) => api.get("/gallery", { params }).then((res) => res.data),
  volunteer: (payload) => api.post("/volunteers", payload).then((res) => res.data),
  message: (payload) => api.post("/messages", payload).then((res) => res.data),
};

export const adminApi = {
  stats: () => api.get("/stats").then((res) => res.data),
  saveContent: (content) => api.put("/content", { content }).then((res) => res.data),
  uploadVideo: (formData) => api.post("/videos", formData, { timeout: 0 }).then((res) => res.data),
  deleteVideo: (id) => api.delete(`/videos/${id}`).then((res) => res.data),

  activities: (params) => api.get("/activities", { params }).then((res) => res.data),
  createActivity: (formData) => api.post("/activities", formData).then((res) => res.data),
  updateActivity: (id, formData) => api.put(`/activities/${id}`, formData).then((res) => res.data),
  deleteActivity: (id) => api.delete(`/activities/${id}`).then((res) => res.data),

  events: (params) => api.get("/events", { params }).then((res) => res.data),
  createEvent: (formData) => api.post("/events", formData).then((res) => res.data),
  updateEvent: (id, formData) => api.put(`/events/${id}`, formData).then((res) => res.data),
  deleteEvent: (id) => api.delete(`/events/${id}`).then((res) => res.data),
  eventRegistrations: (id) => api.get(`/events/${id}/registrations`).then((res) => res.data),
  registrations: () => api.get("/registrations").then((res) => res.data),
  updateRegistration: (id, payload) => api.put(`/registrations/${id}`, payload).then((res) => res.data),
  deleteRegistration: (id) => api.delete(`/registrations/${id}`).then((res) => res.data),

  volunteers: (params) => api.get("/volunteers", { params }).then((res) => res.data),
  updateVolunteer: (id, payload) => api.put(`/volunteers/${id}`, payload).then((res) => res.data),
  updateVolunteerStatus: (id, status) => api.patch(`/volunteers/${id}/status`, { status }).then((res) => res.data),
  deleteVolunteer: (id) => api.delete(`/volunteers/${id}`).then((res) => res.data),

  gallery: (params) => api.get("/gallery", { params }).then((res) => res.data),
  createGalleryItem: (formData) => api.post("/gallery", formData).then((res) => res.data),
  updateGalleryItem: (id, formData) => api.put(`/gallery/${id}`, formData).then((res) => res.data),
  deleteGalleryItem: (id) => api.delete(`/gallery/${id}`).then((res) => res.data),

  messages: (params) => api.get("/messages", { params }).then((res) => res.data),
  markMessageRead: (id) => api.patch(`/messages/${id}/read`).then((res) => res.data),
  deleteMessage: (id) => api.delete(`/messages/${id}`).then((res) => res.data),

  users: (params) => api.get("/users", { params }).then((res) => res.data),
  createUser: (payload) => api.post("/users", payload).then((res) => res.data),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload).then((res) => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((res) => res.data),
};

export default api;
