import { useLocation, Link, useNavigate } from "react-router-dom";
import { TrendingUp, FileText, UserCheck, Users, LogOut, X } from "lucide-react";

export default function AdminSidebar({ close }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or admin session
    localStorage.removeItem("pexdo_admin_token");
    // Redirect to login page
    navigate("/admin/login");
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-black">Pedxo Admin</span>
        </div>
        <button onClick={close} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        <NavItem to="/admin/dashboard" icon={TrendingUp} label="Overview" />
        <NavItem to="/admin/contracts" icon={FileText} label="Contracts" />
        <NavItem to="/admin/developers" icon={UserCheck} label="Developers" />
        <NavItem to="/admin/assignments" icon={Users} label="Assignments" />
        <NavItem to="/admin/settings" icon={Users} label="Settings" />
      </nav>

      <div className="mt-auto p-4">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
