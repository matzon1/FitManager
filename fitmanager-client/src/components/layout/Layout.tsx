import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, X, CreditCard, Receipt, CalendarCheck, LogOut, Dumbbell, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';



const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/memberships', icon: CreditCard, label: 'Memberships' },
  { to: '/payments', icon: Receipt, label: 'Payments' },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, role, logout } = useAuthStore();  
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
     <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <Dumbbell className="text-primary-text" size={22} />
          <span className="font-semibold text-foreground text-lg">FitManager</span>
        </div>
       <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={onNavigate}
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
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {

  const [open, SetOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <aside className="w-60 bg-surface border-r border-border hidden lg:flex flex-col">
        <SidebarContent onNavigate={() => {}} />
      </aside>
      <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-surface border-b border-border">
        
        <button onClick={() => SetOpen(true)} className="font-semibold text-foreground text-lg" aria-label="Open menu">
          <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
             <Dumbbell className="text-primary-text" size={22} />
         <span className="font-semibold text-foreground text-lg">FitManager</span>
          </div>
      </header>
      <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      {open && (
  <div className="lg:hidden">
    {/* dark area behind the drawer */}
    <div className="fixed inset-0 z-40 bg-black/50" onClick={() => SetOpen(false)} />

    {/* the drawer */}
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col">
      <button aria-label="Close menu" onClick={() => SetOpen(false) }
        className="absolute right-3 top-4 p-2 rounded-lg text-muted hover:bg-surface-2">
        <X size={20} />
      </button>
      <SidebarContent onNavigate={() => SetOpen(false)} />
    </div>
  </div>
)}
    </div>
  );
}