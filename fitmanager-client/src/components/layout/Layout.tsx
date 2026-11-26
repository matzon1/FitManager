import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Receipt, CalendarCheck, LogOut, Dumbbell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/memberships', icon: CreditCard, label: 'Memberships' },
  { to: '/payments', icon: Receipt, label: 'Payments' },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, role, logout } = useAuthStore();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-60 bg-surface border-r border-border flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <Dumbbell className="text-primary-text" size={22} />
          <span className="font-semibold text-foreground text-lg">FitManager</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === to ? 'bg-primary/10 text-primary-text' : 'text-muted hover:bg-surface-2'}`}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
          <div className="text-xs text-muted mb-1">{username}</div>
          <div className="text-xs text-primary-text font-medium mb-3">{role}</div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted hover:text-danger transition-colors">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}