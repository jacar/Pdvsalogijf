import React from 'react';
import { CorporacionJFLogo, ArrowRightIcon } from './Icons';

interface HomeViewProps {
    onNavigateToAdminLogin: () => void;
    onNavigateToDriverSelection: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigateToAdminLogin, onNavigateToDriverSelection }) => {
    return (
        <div 
            className="min-h-screen font-sans flex flex-col bg-cover bg-center relative"
            style={{ backgroundImage: "url('https://www.webcincodev.com/blog/wp-content/uploads/2025/08/Sistema-de-Reportes-JF-2.jpg')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="p-4">
                    <div className="container mx-auto flex items-center justify-start">
                        <div className="flex items-center gap-3">
                            <CorporacionJFLogo className="w-12 h-12" />
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide">Sistema de Reportes JF</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="text-center max-w-2xl">
                         <img 
                            src="https://www.webcincodev.com/blog/wp-content/uploads/2025/08/Diseno-sin-titulo-26.png" 
                            alt="Logo Petroboscan"
                            className="mx-auto mb-6 w-48 h-auto"
                        />
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                            Sistema Integrado de Gestión de Transporte
                        </h2>
                        <p className="text-lg text-gray-200 mb-10 drop-shadow-md">
                            Bienvenido al portal. Seleccione su tipo de acceso para continuar y gestionar los reportes de viajes diarios de manera eficiente.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={onNavigateToAdminLogin}
                                className="w-full sm:w-64 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                            >
                                <span>Acceso Administrador</span>
                                <ArrowRightIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={onNavigateToDriverSelection}
                                className="w-full sm:w-64 bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                            >
                                <span>Acceso Conductor</span>
                                <ArrowRightIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </main>
                <footer className="text-center p-4 text-sm text-gray-300">
                    &copy; {new Date().getFullYear()} Corporación JF. Todos los derechos reservados.
                </footer>
            </div>
        </div>
    );
};

export default HomeView;