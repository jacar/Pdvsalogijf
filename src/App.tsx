import React, { useState, useEffect } from 'react';
import type { Passenger, Report, Driver, User, AdminUser, VerifiersData } from './types';
import { PASSENGER_DATABASE, DRIVER_DATABASE, ADMIN_USER_DATABASE } from './data/mockData';
import Header from './components/Header';
import { ErrorIcon, CorporacionJFLogo, LockClosedIcon, SpinnerIcon } from './components/Icons';
import AdminView from './components/AdminView';
import DriverView from './components/DriverView';
import HomeView from './components/HomeView';
import DriverSelectionView from './components/DriverSelectionView';

// --- Helper to get data from localStorage or initialize it ---
const initializeData = <T,>(key: string, initialData: T[]): T[] => {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            // When parsing reports, revive date strings back into Date objects
            if (key === 'REPORTS_DATA') {
                return JSON.parse(storedData, (k, v) => {
                    if (k === 'fecha' && typeof v === 'string') {
                        return new Date(v);
                    }
                    return v;
                });
            }
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
    }
    // If nothing is stored, use initial data and save it.
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
};

const initializeObjectData = <T,>(key: string, initialData: T): T => {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
    }
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
};

// --- Mock API Service ---
// Simulates a backend, now using localStorage for persistence.
const mockApi = {
  reports: initializeData<Report>('REPORTS_DATA', []),
  passengers: initializeData<Passenger>('PASSENGERS_DATA', [...PASSENGER_DATABASE]),
  drivers: initializeData<Driver>('DRIVERS_DATA', [...DRIVER_DATABASE]),
  adminUsers: initializeData<AdminUser>('ADMIN_USERS_DATA', [...ADMIN_USER_DATABASE]),
  verifiers: initializeObjectData<VerifiersData>('VERIFIERS_DATA', {
      contratista: { nombre: '', ci: '', cargo: '' },
      corporacion: { nombre: '', ci: '', cargo: '' },
  }),

  login: async (user: string, pass: string): Promise<User> => {
    await new Promise(res => setTimeout(res, 600)); 
    const adminUser = mockApi.adminUsers.find(u => u.username === user && u.password === pass);
    if (adminUser) {
        return { id: adminUser.id, name: adminUser.name, role: 'admin' };
    }
    throw new Error('Usuario o contraseña incorrectos.');
  },

  getReports: async (): Promise<Report[]> => {
    await new Promise(res => setTimeout(res, 300));
    return [...mockApi.reports].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  },

  submitReport: async (report: Report): Promise<Report> => {
    await new Promise(res => setTimeout(res, 300));
    const newReportWithId = { ...report, id: `rep_${Date.now()}`};
    mockApi.reports.unshift(newReportWithId);
    localStorage.setItem('REPORTS_DATA', JSON.stringify(mockApi.reports));
    return newReportWithId;
  },

  getPassengers: async (): Promise<Passenger[]> => {
      await new Promise(res => setTimeout(res, 200));
      return [...mockApi.passengers];
  },
  addPassenger: async (passenger: Omit<Passenger, 'id'>): Promise<Passenger> => {
      await new Promise(res => setTimeout(res, 400));
      const newPassenger = { ...passenger, id: passenger.nroCedula };
      mockApi.passengers.push(newPassenger);
      localStorage.setItem('PASSENGERS_DATA', JSON.stringify(mockApi.passengers));
      return newPassenger;
  },
  deletePassenger: async (id: string): Promise<void> => {
      await new Promise(res => setTimeout(res, 400));
      mockApi.passengers = mockApi.passengers.filter(p => p.id !== id);
      localStorage.setItem('PASSENGERS_DATA', JSON.stringify(mockApi.passengers));
  },
  findPassengerByCedula: async (cedula: string): Promise<Passenger | undefined> => {
      await new Promise(res => setTimeout(res, 100));
      return mockApi.passengers.find(p => p.nroCedula === cedula);
  },

  getDrivers: async (): Promise<Driver[]> => {
      await new Promise(res => setTimeout(res, 200));
      return [...mockApi.drivers];
  },
  addDriver: async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
      await new Promise(res => setTimeout(res, 400));
      const newDriver = { ...driver, id: `drv_${Date.now()}` };
      mockApi.drivers.push(newDriver);
      localStorage.setItem('DRIVERS_DATA', JSON.stringify(mockApi.drivers));
      return newDriver;
  },
  deleteDriver: async (id: string): Promise<void> => {
      await new Promise(res => setTimeout(res, 400));
      mockApi.drivers = mockApi.drivers.filter(d => d.id !== id);
      localStorage.setItem('DRIVERS_DATA', JSON.stringify(mockApi.drivers));
  },
  updatePassenger: async (id: string, passengerData: Partial<Passenger>): Promise<Passenger> => {
      await new Promise(res => setTimeout(res, 400));
      const index = mockApi.passengers.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Passenger not found");
      const updated = { ...mockApi.passengers[index], ...passengerData };
      mockApi.passengers[index] = updated;
      localStorage.setItem('PASSENGERS_DATA', JSON.stringify(mockApi.passengers));
      return updated;
  },
  updateDriver: async (id: string, driverData: Partial<Driver>): Promise<Driver> => {
      await new Promise(res => setTimeout(res, 400));
      const index = mockApi.drivers.findIndex(d => d.id === id);
      if (index === -1) throw new Error("Driver not found");
      const updated = { ...mockApi.drivers[index], ...driverData };
      mockApi.drivers[index] = updated;
      localStorage.setItem('DRIVERS_DATA', JSON.stringify(mockApi.drivers));
      return updated;
  },
  // --- Admin User Management ---
    getAdminUsers: async (): Promise<AdminUser[]> => {
        await new Promise(res => setTimeout(res, 200));
        return [...mockApi.adminUsers];
    },
    addAdminUser: async (user: Omit<AdminUser, 'id'>): Promise<AdminUser> => {
        await new Promise(res => setTimeout(res, 400));
        if (mockApi.adminUsers.some(u => u.username === user.username)) {
            throw new Error("El nombre de usuario ya existe.");
        }
        const newUser = { ...user, id: user.username };
        mockApi.adminUsers.push(newUser);
        localStorage.setItem('ADMIN_USERS_DATA', JSON.stringify(mockApi.adminUsers));
        return newUser;
    },
    deleteAdminUser: async (id: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 400));
        if (mockApi.adminUsers.length <= 1) {
            throw new Error("No se puede eliminar el último administrador.");
        }
        mockApi.adminUsers = mockApi.adminUsers.filter(u => u.id !== id);
        localStorage.setItem('ADMIN_USERS_DATA', JSON.stringify(mockApi.adminUsers));
    },
    updateAdminUser: async (id: string, userData: Partial<AdminUser>): Promise<AdminUser> => {
        await new Promise(res => setTimeout(res, 400));
        const index = mockApi.adminUsers.findIndex(u => u.id === id);
        if (index === -1) throw new Error("Usuario no encontrado.");
        
        // Prevent username change if it already exists for another user
        if (userData.username && mockApi.adminUsers.some(u => u.username === userData.username && u.id !== id)) {
            throw new Error("El nombre de usuario ya está en uso.");
        }

        const updated = { ...mockApi.adminUsers[index], ...userData };
        mockApi.adminUsers[index] = updated;
        localStorage.setItem('ADMIN_USERS_DATA', JSON.stringify(mockApi.adminUsers));
        return updated;
    },
    // --- Verifiers Management ---
    getVerifiers: async (): Promise<VerifiersData> => {
        await new Promise(res => setTimeout(res, 200));
        return { ...mockApi.verifiers };
    },
    updateVerifiers: async (data: VerifiersData): Promise<VerifiersData> => {
        await new Promise(res => setTimeout(res, 400));
        mockApi.verifiers = data;
        localStorage.setItem('VERIFIERS_DATA', JSON.stringify(mockApi.verifiers));
        return { ...mockApi.verifiers };
    },
};

export { mockApi };


// --- Login Component (For Admin only) ---

const LoginView: React.FC<{ onLogin: (user: User) => void; onBackToHome: () => void; }> = ({ onLogin, onBackToHome }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await mockApi.login(username, password);
            onLogin(user);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                    <div className="flex flex-col items-center mb-6">
                        <CorporacionJFLogo className="w-16 h-16 mb-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">Acceso Administrador</h1>
                        <p className="text-gray-500">Ingrese sus credenciales</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                   <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                               <ErrorIcon className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !username || !password}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-red-300 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : null}
                                {isLoading ? 'Verificando...' : 'Ingresar'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={onBackToHome} className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors">
                        &larr; Volver a la página principal
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

type View = 'home' | 'login' | 'driverSelection' | 'loggedIn';
const APP_USER_KEY = 'APP_CURRENT_USER'; // Key for localStorage

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true); // To show a loader on initial load

    // Effect to restore session on component mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(APP_USER_KEY);
            if (storedUser) {
                const user: User = JSON.parse(storedUser);
                setCurrentUser(user);
                setView('loggedIn');
            }
        } catch (error) {
            console.error("Failed to restore session from localStorage", error);
            localStorage.removeItem(APP_USER_KEY); // Clear potentially corrupted data
        } finally {
            setIsInitializing(false);
        }
    }, []);

    const handleLoginSuccess = (user: User) => {
        localStorage.setItem(APP_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
        setView('loggedIn');
    };

    const handleDriverSelect = (driver: Driver) => {
        const user: User = {
            id: driver.id,
            name: driver.nombreCompleto,
            role: 'driver',
            details: driver,
        };
        localStorage.setItem(APP_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
        setView('loggedIn');
    };

    const handleLogout = () => {
        localStorage.removeItem(APP_USER_KEY);
        setCurrentUser(null);
        setView('home');
    };

     // Effect to handle inconsistent state (e.g., loggedIn view without a user)
     useEffect(() => {
        if (!isInitializing && view === 'loggedIn' && !currentUser) {
            console.warn("Inconsistent state detected. Redirecting to home.");
            setView('home'); // Go back home if logged out
        }
    }, [view, currentUser, isInitializing]);

    if (isInitializing) {
         return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <SpinnerIcon className="w-12 h-12 text-red-600" />
            </div>
        );
    }

    const renderView = () => {
        switch (view) {
            case 'home':
                return <HomeView 
                    onNavigateToAdminLogin={() => setView('login')} 
                    onNavigateToDriverSelection={() => setView('driverSelection')}
                />;
            
            case 'login':
                return <LoginView onLogin={handleLoginSuccess} onBackToHome={() => setView('home')} />;
            
            case 'driverSelection':
                return <DriverSelectionView onDriverSelect={handleDriverSelect} onBackToHome={() => setView('home')} />;

            case 'loggedIn':
                if (currentUser) {
                    return (
                        <div className="min-h-screen bg-gray-100 font-sans">
                            <Header 
                                user={currentUser}
                                onLogout={handleLogout}
                            />
                            <main className="container mx-auto p-4 md:p-8">
                               {currentUser.role === 'admin' && <AdminView />}
                               {currentUser.role === 'driver' && currentUser.details && <DriverView driver={currentUser.details} />}
                            </main>
                        </div>
                    );
                }
                // This state is handled by the useEffect. Show loader while redirecting.
                return (
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                        <SpinnerIcon className="w-12 h-12 text-red-600" />
                    </div>
                );

            default:
                setView('home');
                return null;
        }
    };
    
    return renderView();
};

export default App;
