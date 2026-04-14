import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import WaiterLayout from "@/layouts/WaiterLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminTables from "@/pages/admin/Tables";
import AdminMenu from "@/pages/admin/Menu";
import AdminOrders from "@/pages/admin/Orders";
import AdminCustomers from "@/pages/admin/Customers";
import AdminStaff from "@/pages/admin/Staff";
import AdminFeedback from "@/pages/admin/Feedback";
import WaiterTables from "@/pages/waiter/Tables";
import WaiterOrders from "@/pages/waiter/Orders";
import WaiterMenu from "@/pages/waiter/Menu";
import WaiterBilling from "@/pages/waiter/Billing";
import CustomerMenu from "@/pages/customer/Menu";
import CustomerCart from "@/pages/customer/Cart";
import CustomerOrders from "@/pages/customer/Orders";
import CustomerFeedback from "@/pages/customer/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'waiter' ? '/waiter' : '/customer'} replace />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'waiter' ? '/waiter' : '/customer'} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/tables" element={<ProtectedRoute role="admin"><AdminLayout><AdminTables /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute role="admin"><AdminLayout><AdminMenu /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute role="admin"><AdminLayout><AdminCustomers /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute role="admin"><AdminLayout><AdminStaff /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute role="admin"><AdminLayout><AdminFeedback /></AdminLayout></ProtectedRoute>} />
            <Route path="/waiter" element={<ProtectedRoute role="waiter"><WaiterLayout><WaiterTables /></WaiterLayout></ProtectedRoute>} />
            <Route path="/waiter/orders" element={<ProtectedRoute role="waiter"><WaiterLayout><WaiterOrders /></WaiterLayout></ProtectedRoute>} />
            <Route path="/waiter/menu" element={<ProtectedRoute role="waiter"><WaiterLayout><WaiterMenu /></WaiterLayout></ProtectedRoute>} />
            <Route path="/waiter/billing" element={<ProtectedRoute role="waiter"><WaiterLayout><WaiterBilling /></WaiterLayout></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerMenu /></CustomerLayout></ProtectedRoute>} />
            <Route path="/customer/cart" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerCart /></CustomerLayout></ProtectedRoute>} />
            <Route path="/customer/orders" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerOrders /></CustomerLayout></ProtectedRoute>} />
            <Route path="/customer/feedback" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerFeedback /></CustomerLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
