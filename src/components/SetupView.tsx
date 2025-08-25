import React, { useState } from 'react';
import type { Passenger, Driver, Report } from '../types';
import { UserIcon, LogIcon } from './Icons';

const FormInput: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; placeholder?: string; type?: string; readOnly?: boolean;}> = 
({ label, name, value, onChange, placeholder, type = 'text', readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 transition ${readOnly ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'}`}
        />
    </div>
);


const SetupView: React.FC<{ passenger: Passenger; driver: Driver; onStartTrip: (setupData: Omit<Report, 'pasajeros'|'id'>) => void; }> = ({ passenger, driver, onStartTrip }) => {
    const [formData, setFormData] = useState({
        conductor: driver.nombreCompleto,
        conductorId: driver.id,
        unidad: driver.unidad,
        ruta: 'LOS MODINES- SANTA FE-RICHMOND',
        area: 'ADMINISTRATIVA- RICHMOND',
        hora: '05:00',
        periodo: 'AM' as 'AM' | 'PM',
        fecha: new Date(),
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
     const handleDateChange = (dateString: string) => {
        const date = new Date(dateString);
        // Adjust for timezone offset to prevent day-before issues
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        setFormData(prev => ({ ...prev, fecha: new Date(date.getTime() + userTimezoneOffset) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStartTrip(formData);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Passenger Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <UserIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Paso 2: Confirmar Datos</h2>
                        <p className="text-gray-500">Este es el primer pasajero del reporte.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Nombre</p>
                        <p className="text-base font-bold text-gray-800">{passenger.nombreCompleto}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Cédula</p>
                        <p className="text-base font-mono text-gray-800">{passenger.nroCedula}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Gerencia</p>
                        <p className="text-base text-gray-800">{passenger.gerencia}</p>
                    </div>
                </div>
            </div>

            {/* Report Setup Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <LogIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Información del Viaje</h2>
                        <p className="text-gray-500">Complete los detalles para generar el informe.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                        <FormInput label="Conductor" name="conductor" value={formData.conductor} onChange={() => {}} readOnly />
                        <FormInput label="Unidad" name="unidad" value={formData.unidad} onChange={() => {}} readOnly />
                        <FormInput label="Ruta" name="ruta" value={formData.ruta} onChange={handleInputChange} />
                        <FormInput label="Área" name="area" value={formData.area} onChange={handleInputChange} />
                        <FormInput label="Hora Salida" name="hora" value={formData.hora} onChange={handleInputChange} type="time" />
                        <div>
                            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                            <select id="periodo" name="periodo" value={formData.periodo} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                         <FormInput 
                            label="Fecha" 
                            name="fecha" 
                            value={formData.fecha.toISOString().split('T')[0]} 
                            onChange={(e) => handleDateChange(e.target.value)} 
                            type="date" 
                        />
                    </div>
                    <div className="mt-8 border-t pt-6">
                         <button type="submit" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                            Iniciar Viaje
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SetupView;
