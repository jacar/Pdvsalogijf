import React, { useState, useEffect } from 'react';
import type { Passenger, Report, RegisteredPassenger, Driver } from '../types';
import { mockApi } from '../App';
import QRScannerModal from './QRScannerModal';
import { IdCardIcon, ErrorIcon, LogIcon, PlusIcon, QRIcon, DownloadIcon } from './Icons';
import SetupView from './SetupView';
import ActiveReport from './ActiveReport';
import { generateReportPDF } from './pdfGenerator';

// --- Toast Component ---
const Toast: React.FC<{ message: string; show: boolean; onClose: () => void; type?: 'success' | 'error'}> = ({ message, show, onClose, type = 'success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    return <div className={`fixed top-20 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-xl z-50 animate-fade-in-down`}><p>{message}</p></div>;
};


// --- Sub-components for Driver Flow ---

interface IdentificationViewProps {
    onScanClick: () => void;
    onManualSubmit: (cedula: string) => void;
    errorMessage: string;
}

const IdentificationView: React.FC<IdentificationViewProps> = ({ onScanClick, onManualSubmit, errorMessage }) => {
    const [cedula, setCedula] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cedula.trim()) {
            onManualSubmit(cedula.trim());
        }
    };
    
    return (
         <div className="max-w-md mx-auto bg-white p-8 mt-10 rounded-xl shadow-lg border border-gray-200 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="bg-red-100 p-4 rounded-full"><IdCardIcon className="w-8 h-8 text-red-600" /></div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Iniciar Nuevo Reporte</h2>
                    <p className="text-gray-500">Escanee el QR del pasajero o ingrese su cédula para comenzar.</p>
                </div>
            </div>
            <div className="my-6">
                <button onClick={onScanClick} type="button" className="w-full bg-gray-800 hover:bg-black text-white font-bold py-4 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-0.5">
                    <QRIcon className="w-7 h-7" /> Escanear QR para Iniciar
                </button>
            </div>

            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold uppercase">O ingrese manualmente</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="cedula-manual" className="sr-only">Número de Cédula</label>
                    <input
                        id="cedula-manual"
                        type="text"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        placeholder="Ingrese Nro. de Cédula del pasajero"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        pattern="\d*"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!cedula.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <IdCardIcon className="w-5 h-5" />
                    Iniciar con Cédula
                </button>
            </form>

            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center gap-2 mt-4 text-sm">
                   <ErrorIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}
        </div>
    );
};

const HistoryView: React.FC<{ reports: Report[]; onStartNew: () => void; }> = ({ reports, onStartNew }) => (
    <div className="max-w-5xl mx-auto">
        {reports.length === 0 ? (
            <div className="text-center bg-white p-16 rounded-xl shadow-lg border border-gray-200">
                <LogIcon className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-700">No has enviado reportes</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Una vez que completes un viaje, aparecerá aquí para que puedas consultarlo.</p>
                 <button onClick={onStartNew} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-lg transform hover:-translate-y-1 mx-auto">
                    <PlusIcon className="w-6 h-6" /> Empezar Primer Reporte
                </button>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-2xl font-bold text-gray-800">Tu Historial de Viajes</h3>
                    <button onClick={onStartNew} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 shrink-0">
                        <PlusIcon className="w-5 h-5" /> Crear Nuevo Reporte
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pasajeros</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(report.fecha).toLocaleDateString('es-VE')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.ruta}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-bold">{report.pasajeros.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
    </div>
);


// --- Driver View Main Component ---

interface DriverViewProps {
    driver: Driver;
}

const DriverView: React.FC<DriverViewProps> = ({ driver }) => {
    const [completedReports, setCompletedReports] = useState<Report[]>([]);
    const [view, setView] = useState<'history' | 'identify' | 'setup' | 'active'>('history');
    const [initialPassenger, setInitialPassenger] = useState<Passenger | null>(null);
    const [activeReport, setActiveReport] = useState<Report | null>(null);
    const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
    const [qrScanContext, setQrScanContext] = useState<'start' | 'add'>('start');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

    useEffect(() => {
        const loadHistory = async () => {
            const allReports = await mockApi.getReports();
            const driverReports = allReports.filter(r => r.conductorId === driver.id);
            setCompletedReports(driverReports);
            setView(driverReports.length > 0 ? 'history' : 'identify');
        };
        loadHistory();
    }, [driver.id]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToastInfo({ show: true, message, type });
    };

    const handleIdentify = async (cedula: string) => {
        setErrorMessage('');
        const passenger = await mockApi.findPassengerByCedula(cedula);
        if (passenger) {
            setInitialPassenger(passenger);
            setView('setup');
        } else {
            setErrorMessage(`Pasajero con cédula "${cedula}" no encontrado.`);
        }
    };

    const handleScanSuccess = (cedula: string) => {
        setIsQRScannerOpen(false);
        if (qrScanContext === 'start') {
            handleIdentify(cedula);
        } else {
            handleAddPassenger(cedula);
        }
    };
    
    const handleStartTrip = (setupData: Omit<Report, 'pasajeros' | 'id'>) => {
        if (!initialPassenger) return;
        const firstPassenger: RegisteredPassenger = {
            passenger: initialPassenger,
            hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };
        const newReport: Report = {
            id: '', // Temporary ID
            ...setupData,
            pasajeros: [firstPassenger],
        };
        setActiveReport(newReport);
        setView('active');
        setInitialPassenger(null);
    };
    
    const handleAddPassenger = async (cedula: string) => {
        if (!activeReport) return;
        if (activeReport.pasajeros.some(p => p.passenger.nroCedula === cedula)) {
             showToast('El pasajero ya fue registrado.', 'error');
             return;
        }
        const passenger = await mockApi.findPassengerByCedula(cedula);
        if (passenger) {
            const newRegisteredPassenger: RegisteredPassenger = {
                passenger,
                hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
            };
            setActiveReport(prev => prev ? { ...prev, pasajeros: [...prev.pasajeros, newRegisteredPassenger] } : null);
            showToast('Pasajero añadido exitosamente.', 'success');
        } else {
            showToast(`Pasajero con cédula "${cedula}" no encontrado.`, 'error');
        }
    };

    const handleFinalizeTrip = async () => {
        if (activeReport) {
            setIsSending(true);
            try {
                const finalizedReport = {
                    ...activeReport,
                    horaLlegada: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
                };
                const submittedReport = await mockApi.submitReport(finalizedReport);
                setCompletedReports(prev => [submittedReport, ...prev]);
                setActiveReport(null);
                setInitialPassenger(null);
                setView('history');
                showToast('Reporte enviado al administrador.', 'success');
            } catch (error) {
                showToast('Error al enviar el reporte.', 'error');
            } finally {
                setIsSending(false);
            }
        }
    };
    
    const renderContent = () => {
        switch (view) {
            case 'history': return <HistoryView reports={completedReports} onStartNew={() => setView('identify')} />;
            case 'identify': return <IdentificationView 
                onScanClick={() => {
                    setErrorMessage('');
                    setQrScanContext('start');
                    setIsQRScannerOpen(true);
                }}
                onManualSubmit={handleIdentify}
                errorMessage={errorMessage} 
            />;
            case 'setup': return initialPassenger ? <SetupView passenger={initialPassenger} driver={driver} onStartTrip={handleStartTrip} /> : null;
            case 'active': return activeReport ? <ActiveReport 
                report={activeReport} 
                onAddPassenger={() => {
                    setErrorMessage('');
                    setQrScanContext('add');
                    setIsQRScannerOpen(true);
                }} 
                onFinalize={handleFinalizeTrip} 
                isSending={isSending} 
            /> : null;
            default: return <HistoryView reports={completedReports} onStartNew={() => setView('identify')} />;
        }
    };

    return (
        <>
            {renderContent()}
            <Toast 
                message={toastInfo.message}
                show={toastInfo.show}
                onClose={() => setToastInfo({ show: false, message: '', type: 'success' })}
                type={toastInfo.type}
            />
            {isQRScannerOpen && <QRScannerModal onClose={() => setIsQRScannerOpen(false)} onScanSuccess={handleScanSuccess} />}
        </>
    );
};

export default DriverView;