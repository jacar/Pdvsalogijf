import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex items-center gap-3">
                    <img 
                        src="https://www.webcincodev.com/blog/wp-content/uploads/2025/08/Diseno-sin-titulo-27.png" 
                        alt="Logo Corporacion JF" 
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-wide">
                            Sistema de Reportes JF
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{user.name}</p>
                        <p className="text-xs text-white bg-red-600 rounded-full px-2 py-0.5 uppercase font-semibold tracking-wider">{user.role}</p>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                    >
                       Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
