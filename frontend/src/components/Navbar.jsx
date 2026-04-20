import { Link, useLocation } from 'react-router-dom';
import { Tag, LayoutDashboard, Ticket } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Offers', path: '/offers', icon: Ticket },
  ];

  return (
    <nav className="glass-panel rounded-none border-t-0 border-x-0 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <Tag className="w-6 h-6 text-secondary" />
            <span>Promo<span className="text-white">Pulse</span></span>
          </Link>
          
          <div className="flex gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
