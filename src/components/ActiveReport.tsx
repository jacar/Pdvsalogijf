import React from 'react';
import type { Report } from '../types';
import { SpinnerIcon, IdCardIcon, UsersIcon, BriefcaseIcon, TruckIcon, RouteIcon, CalendarIcon, ClockIcon, UserIcon } from './Icons';

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode;}> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-base font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

interface ActiveReportProps {
    report: Report;
    onAddPassenger: () => void;
    onFinalize: () => void;
    isSending: boolean;
}

const ActiveReport: React.FC<ActiveReportProps> = ({ report, onAddPassenger, onFinalize, isSending }) => {
    const { conductor, unidad, ruta, fecha, periodo, hora, area, pasajeros } = report;
    const reportDate = new Date(fecha);
    const userTimezoneOffset = reportDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(reportDate.getTime() + userTimezoneOffset);
    const formattedDate = `${adjustedDate.getDate().toString().padStart(2, '0')}/${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}/${adjustedDate.getFullYear()}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Trip Details */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Detalles del Viaje</h3>
                    <div className="space-y-5">
                        <InfoItem icon={<UserIcon className="w-5 h-5" />} label="Conductor" value={conductor} />
                        <InfoItem icon={<TruckIcon className="w-5 h-5" />} label="Unidad" value={unidad} />
                        <InfoItem icon={<RouteIcon className="w-5 h-5" />} label="Ruta" value={ruta} />
                        <InfoItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Área" value={area} />
                        <InfoItem icon={<CalendarIcon className="w-5 h-5" />} label="Fecha" value={formattedDate} />
                        <InfoItem icon={<ClockIcon className="w-5 h-5" />} label="Hora de Salida" value={`${hora} ${periodo}`} />
                        <InfoItem icon={<ClockIcon className="w-5 h-5" />} label="Hora de Llegada" value={report.horaLlegada ? report.horaLlegada : <span className="italic text-gray-500">En curso...</span>} />
                    </div>
                </div>
            </div>

            {/* Right Column: Passengers */}
            <div className="lg:col-span-2">
                 <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <UsersIcon className="w-8 h-8 text-red-600" />
                        <h3 className="text-2xl font-bold text-gray-800">
                            Pasajeros Registrados <span className="text-gray-400 font-medium">({pasajeros.length})</span>
                        </h3>
                    </div>
                     <button onClick={onAddPassenger} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5">
                        <IdCardIcon className="w-5 h-5" /> Añadir Pasajero
                    </button>
                </div>

                <div className="space-y-3">
                    {pasajeros.map((p, index) => (
                        <div key={p.passenger.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 grid grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-4 hover:border-red-500 hover:shadow-lg transition-all duration-200">
                            <span className="font-bold text-lg text-red-600 w-8 text-center">{index + 1}</span>
                            <div className="border-l pl-4">
                                <p className="text-sm font-semibold text-gray-500">Nombre</p>
                                <p className="text-base font-bold text-gray-800">{p.passenger.nombreCompleto}</p>
                            </div>
                            <div className="border-l pl-4">
                                <p className="text-sm font-semibold text-gray-500">Cédula</p>
                                <p className="text-base font-mono text-gray-800">{p.passenger.nroCedula}</p>
                            </div>
                            <div className="border-l pl-4">
                                <p className="text-sm font-semibold text-gray-500">Gerencia</p>
                                <p className="text-base text-gray-800">{p.passenger.gerencia}</p>
                            </div>
                            <div className="border-l pl-4 text-center">
                                 <p className="text-sm font-semibold text-gray-500">Hora</p>
                                <p className="text-base font-mono font-bold text-gray-800">{p.hora}</p>
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-8">
                    <button onClick={onFinalize} disabled={isSending} className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex justify-center items-center gap-2 disabled:bg-gray-500">
                        {isSending ? (
                            <>
                                <SpinnerIcon className="w-5 h-5" />
                                <span>Enviando...</span>
                            </>
                        ) : (
                            'Finalizar y Enviar Reporte'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveReport;