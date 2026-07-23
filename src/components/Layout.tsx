import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Waypoints,
  Cpu,
  ServerCrash,
  Key,
  Users,
  Activity,
  ScrollText,
  LineChart,
  ShieldAlert,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  Search,
  Terminal,
  Globe,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const NAV_GROUPS = [
  {
    title: 'Core Platform',
    items: [
      { name: 'Overview', path: '/', icon: LayoutDashboard },
      { name: 'Playground', path: '/playground', icon: Terminal },
      { name: 'Routes', path: '/routes', icon: Waypoints },
      { name: 'Models', path: '/models', icon: Cpu },
      { name: 'Providers', path: '/providers', icon: ServerCrash },
    ]
  },
  {
    title: 'Access & Control',
    items: [
      { name: 'API Keys', path: '/keys', icon: Key },
      { name: 'Customers', path: '/customers', icon: Users },
      { name: 'Guardrails', path: '/guardrails', icon: ShieldAlert },
    ]
  },
  {
    title: 'Ops & Finance',
    items: [
      { name: 'Logs', path: '/logs', icon: ScrollText },
      { name: 'Evaluation', path: '/evaluation', icon: LineChart },
      { name: 'Billing', path: '/billing', icon: CreditCard },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Team', path: '/team', icon: Users },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isPublicPage = ['/home', '/landing', '/login', '/register'].includes(location.pathname);

  if (isPublicPage) {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    for (const group of NAV_GROUPS) {
      const item = group.items.find(n => n.path === location.pathname);
      if (item) return item.name;
    }
    return 'BurnCloud';
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] flex flex-col border-r border-gray-200 bg-[#F9FAFB] flex-shrink-0">
        <div className="h-16 flex items-center justify-between px-6 border-b border-transparent">
          <Link to="/" className="flex items-center gap-3 text-gray-900">
            <Logo className="w-7 h-7" />
            <span className="font-display font-bold tracking-tight text-[18px] text-gray-900">BurnCloud</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{group.title}</h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-1.5 text-[13px] rounded-lg transition-all group",
                        isActive 
                          ? "text-gray-900 font-medium bg-black/[0.04]" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-black/[0.02]"
                      )}
                    >
                      <Icon className={cn("w-[16px] h-[16px] transition-colors", isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600")} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick External Links in Sidebar */}
          <div className="pt-3 border-t border-gray-200/60 space-y-1">
            <h4 className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Public Portal</h4>
            <Link
              to="/home"
              className="flex items-center gap-3 px-3 py-1.5 text-[13px] rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.02] transition-all group"
            >
              <Globe className="w-[16px] h-[16px] text-gray-400 group-hover:text-gray-600" />
              Landing Page
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-1.5 text-[13px] rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/[0.02] transition-all group"
            >
              <LogOut className="w-[16px] h-[16px] text-gray-400 group-hover:text-gray-600" />
              Sign Out / Login
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200/60 bg-white/70 backdrop-blur-md z-10 flex-shrink-0">
          <h1 className="text-[18px] font-display font-semibold text-gray-900 tracking-tight">{getPageTitle()}</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-72">
              <Search className="w-[15px] h-[15px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search routes, keys, logs..." 
                className="w-full h-9 bg-gray-100/80 border border-transparent rounded-[10px] pl-9 pr-4 text-[13px] focus:bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:shadow-sm transition-all placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/home" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <span>Visit Landing Page</span>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Production
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              
              <div className="flex items-center gap-3 text-gray-400">
                <button className="hover:text-gray-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="hover:text-gray-600 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              
              <Link to="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-medium shadow-sm">
                  WH
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">BurnCloud AI</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
