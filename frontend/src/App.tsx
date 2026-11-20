import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { BookFormPage } from "./pages/BookFormPage";
import { BookListPage } from "./pages/BookListPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute permission="book:read"><BookListPage /></ProtectedRoute>} />
          <Route path="/books/new" element={<ProtectedRoute permission="book:create"><BookFormPage /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute permission="book:read"><BookDetailPage /></ProtectedRoute>} />
          <Route path="/books/:id/edit" element={<ProtectedRoute permission="book:update"><BookFormPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute permission="notification:read"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute permission="user:read"><AdminUsersPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
