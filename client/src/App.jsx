import { translateNode, useLanguage as useTranslationLanguage } from "./context/LanguageContext.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminVolunteers from "./pages/admin/AdminVolunteers";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminVideos from "./pages/admin/AdminVideos";

const staffRoles = ["admin", "staff"];

export default function App() {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/:id" element={<ActivityDetails />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="get-involved" element={<GetInvolved />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Navigate to="/" replace />} />

      <Route
        path="admin"
        element={
          <ProtectedRoute roles={staffRoles}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="volunteers" element={<AdminVolunteers />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="content" element={<ProtectedRoute roles={["admin"]}><AdminContent /></ProtectedRoute>} />
        <Route path="messages" element={<AdminMessages />} />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>, translationLanguage)
  );
}
