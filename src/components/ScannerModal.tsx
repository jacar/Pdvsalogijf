import React, { useState, useRef, useEffect } from 'react';
import { IdCardIcon, ErrorIcon } from './Icons';

interface ScannerModalProps {
    onClose: () => void;
    onScan: (id: string) => void;
    errorMessage: string;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScan, errorMessage }) => {
    const [cedula, setCedula] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cedula.trim()) {
            onScan(cedula.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center mb-5">
                    <div className="bg-red-100 p-4 rounded-full">
                         <IdCardIcon className="w-10 h-10 text-red-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Registrar Pasajero</h2>
                <p className="text-gray-500 text-center mb-6">Ingrese el número de cédula del pasajero para añadirlo al reporte.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                            Nro. de Cédula
                        </label>
                        <input
                            ref={inputRef}
                            id="cedula"
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            placeholder="Ej: 12345678"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center gap-2 mb-4 text-sm">
                           <ErrorIcon className="w-5 h-5 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed"
                            disabled={!cedula.trim()}
                        >
                            Añadir al Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScannerModal;
