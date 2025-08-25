import React, { useState, useEffect } from 'react';
import type { Driver } from '../types';
import { mockApi } from '../App';
import { SpinnerIcon, ErrorIcon, TruckIcon, CorporacionJFLogo } from './Icons';

interface DriverSelectionViewProps {
    onDriverSelect: (driver: Driver) => void;
    onBackToHome: () => void;
}

const DriverSelectionView: React.FC<DriverSelectionViewProps> = ({ onDriverSelect, onBackToHome }) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const driverData = await mockApi.getDrivers();
                setDrivers(driverData);
            } catch (err) {
                setError('No se pudieron cargar los perfiles de conductor.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-10"><SpinnerIcon className="w-10 h-10 text-red-600" /></div>;
        }
        if (error) {
            return (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-3">
                    <ErrorIcon className="w-6 h-6" />
                    <span>{error}</span>
                </div>
            );
        }
        if (drivers.length === 0) {
             return <p className="text-center text-gray-500">No hay conductores registrados en el sistema.</p>
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <button
                        key={driver.id}
                        onClick={() => onDriverSelect(driver)}
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left hover:border-red-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <TruckIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-800">{driver.nombreCompleto}</p>
                                <p className="text-sm text-gray-500 font-medium">Unidad: <span className="font-bold text-gray-700">{driver.unidad}</span></p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
                 <div className="text-center mb-8">
                    <CorporacionJFLogo className="w-16 h-16 mx-auto mb-3"/>
                    <h1 className="text-3xl font-bold text-gray-800">Seleccione su Perfil</h1>
                    <p className="text-gray-500">Elija su nombre para comenzar a registrar viajes.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                   {renderContent()}
                </div>

                <div className="mt-8 text-center">
                    <button onClick={onBackToHome} className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors">
                        &larr; Volver a la página principal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverSelectionView;