import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bell, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@app/components/ui/dropdown-menu';
import { getCookie } from 'src/context/Services';
import { useAuth } from 'src/context/AuthContext';
import { log } from 'console';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'employee' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const { logout, isAuthenticated } = useAuth();

  // Fetch user and alerts
  let ignore = false;
  const fetchUser = async () => {
    try {
      const token = getCookie('access_token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (!ignore) setUser(decodedToken);
      }
      else {
        setUser(null);
      }
    } catch (err) {
      if (!ignore) setUser(null);
    } finally {
      if (!ignore) setLoading(false);
    }
  };
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/inventory/alerts', {
          withCredentials: true,
        });
        if (!ignore) setAlerts(response.data || []);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };

    fetchUser();
    fetchAlerts();

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    logout();
    fetchUser();
    navigate('/login');

  };

  if (loading) {
    return (
      <nav className='animate-fade-in fixed top-0 z-50 w-full rounded-b-lg bg-green-50/80 px-4 py-3 text-[#2E7D32] shadow-md backdrop-blur-md'>
        <div className='container mx-auto flex items-center justify-between'>
          <span className='flex animate-pulse items-center text-xl font-extrabold tracking-tight'>
            Loading...
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav className='animate-fade-in fixed top-0 z-50 w-full rounded-b-lg bg-green-50/80 px-4 py-3 text-[#2E7D32] shadow-md backdrop-blur-md'>
      <div className='container mx-auto flex items-center justify-between'>
        {/* Left: Logo and Navigation */}
        <div className='flex items-center space-x-6'>
          <NavLink
            to='/'
            className='flex items-center text-xl font-extrabold tracking-tight text-[#2E7D32]'
          >
            <span className='flex items-center text-xl font-extrabold tracking-tight'>
              <svg
                className='mr-2 h-7 w-7 text-[#A5D6A7]'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636'
                />
              </svg>
              SustainaStock
            </span>
          </NavLink>
          <NavLink
            to='/dashboard'
            className={({ isActive }) =>
              `rounded px-3 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-green-100 text-[#2E7D32]' : 'text-[#2E7D32] hover:bg-green-100'
              }`
            }
          >
            Dashboard
          </NavLink>
          {isAuthenticated() && (
            <>
              <NavLink
                to='/inventory'
                className={({ isActive }) =>
                  `rounded px-3 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-green-100 text-[#2E7D32]' : 'text-[#2E7D32] hover:bg-green-100'
                  }`
                }
              >
                Inventory
              </NavLink>
              <NavLink
                to='/recommendations'
                className={({ isActive }) =>
                  `rounded px-3 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-green-100 text-[#2E7D32]' : 'text-[#2E7D32] hover:bg-green-100'
                  }`
                }
              >
                Recommendations
              </NavLink>
              <NavLink
                to='/alerts'
                className={({ isActive }) =>
                  `rounded px-3 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-green-100 text-[#2E7D32]' : 'text-[#2E7D32] hover:bg-green-100'
                  }`
                }
              >
                Alerts
              </NavLink>
              <NavLink
                to='/reports'
                className={({ isActive }) =>
                  `rounded px-3 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-green-100 text-[#2E7D32]' : 'text-[#2E7D32] hover:bg-green-100'
                  }`
                }
              >
                Reports
              </NavLink>
            </>
          )}
        </div>

        {/* Right: Notifications and Profile */}
        <div className='flex items-center space-x-3'>
          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className='relative rounded-full bg-white/90 p-2 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none'>
                  <Bell className='h-6 w-6 text-[#2E7D32]' aria-label='Notifications' />
                  {alerts.length > 0 && (
                    <span className='absolute -top-1 -right-1 inline-flex animate-pulse items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {alerts.length}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className='max-h-96 w-80 overflow-y-auto rounded-xl border border-green-200 bg-white shadow-xl'>
                  <DropdownMenuLabel
                    className='px-4 py-2 text-lg font-semibold text-[#2E7D32]'
                    inset={true}
                  >
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className='my-1 bg-green-200' />
                  {alerts.length === 0 ? (
                    <DropdownMenuItem className='px-4 py-2 text-sm text-gray-500' inset={true}>
                      No new alerts 🎉
                    </DropdownMenuItem>
                  ) : (
                    alerts.slice(0, 5).map((alert, idx) => (
                      <DropdownMenuItem
                        inset={true}
                        key={idx}
                        className='flex flex-col items-start gap-1 px-4 py-3 transition hover:bg-green-50'
                      >
                        <span className='font-medium text-gray-800'>{alert.alert}</span>
                        <span className='text-xs text-gray-500'>{alert.name}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator className='my-1 bg-green-200' />
                  <DropdownMenuItem
                    inset={true}
                    onClick={() => navigate('/alerts')}
                    className='cursor-pointer px-4 py-2 text-center font-medium text-[#2E7D32] transition hover:bg-green-50'
                  >
                    View All Alerts →
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className='rounded-full bg-white/90 p-2 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none'>
                  <User className='h-6 w-6 text-[#2E7D32]' aria-label='Profile' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-48 rounded-xl border border-green-200 bg-white shadow-xl'>
                  <DropdownMenuLabel
                    inset={true}
                    className='px-4 py-2 text-lg font-semibold text-[#2E7D32]'
                  >
                    {user?.username || 'User'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className='my-1 bg-green-200' />
                  {/* <DropdownMenuItem
                    inset={true}
                    onClick={() => navigate('/profile')}
                    className='cursor-pointer px-4 py-2 font-medium text-[#2E7D32] transition hover:bg-green-50'
                  >
                    View Profile
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    inset={true}
                    onClick={handleLogout}
                    className='cursor-pointer px-4 py-2 font-medium text-red-600 transition hover:bg-red-50'
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!user && (
            <>
              <NavLink
                to='/login'
                className={({ isActive }) =>
                  `rounded px-4 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive
                    ? 'bg-green-100 text-[#2E7D32]'
                    : 'bg-white text-[#2E7D32] hover:bg-green-100'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to='/register'
                className={({ isActive }) =>
                  `rounded px-4 py-2 font-semibold transition-transform duration-300 hover:scale-105 ${isActive
                    ? 'bg-green-100 text-[#2E7D32]'
                    : 'bg-white text-[#2E7D32] hover:bg-green-100'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
