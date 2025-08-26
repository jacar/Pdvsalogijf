import React, { useState, useEffect, useRef, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import type { Report, Passenger, Driver, AdminUser, VerifiersData } from '../types';
import { mockApi } from '../App';
import { DownloadIcon, SpinnerIcon, LogIcon, UsersIcon, TruckIcon, PlusIcon, TrashIcon, PencilIcon, QRIcon, UsersAdminIcon, SignatureIcon } from './Icons';
import { generateReportPDF } from './pdfGenerator';

// --- QR Code Modal Component ---
const QRCodeModal: React.FC<{ passenger: Passenger; onClose: () => void }> = ({ passenger, onClose }) => {
    const qrRef = useRef<HTMLCanvasElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [qrError, setQrError] = useState(false);

    useEffect(() => {
        if (qrRef.current && passenger.nroCedula) {
            QRCode.toCanvas(qrRef.current, passenger.nroCedula, { width: 256, margin: 2 }, (error: any) => {
                if (error) {
                    console.error("QR Code Generation Error:", error);
                    setQrError(true);
                }
            });
        }
    }, [passenger.nroCedula]);

    const handlePrint = () => {
        const printContents = modalContentRef.current?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = `<html><head><title>Credencial</title></head><body>${printContents}</body></html>`;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm m-4 transform transition-all text-center" onClick={(e) => e.stopPropagation()}>
                <div ref={modalContentRef}>
                     <img 
                        src="https://www.webcincodev.com/blog/wp-content/uploads/2025/08/Diseno-sin-titulo-27.png" 
                        alt="Logo Corporacion JF"
                        className="mx-auto mb-4 w-24 h-auto"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Credencial de Pasajero</h2>
                    <p className="text-gray-600 mb-1 font-semibold">{passenger.nombreCompleto}</p>
                    <p className="text-gray-500 mb-4">C.I: {passenger.nroCedula}</p>
                    <div className="flex justify-center my-4 h-[256px] w-[256px] mx-auto">
                        {qrError 
                            ? <div className="text-red-500 bg-red-100 flex items-center justify-center w-full h-full rounded-lg">Error al generar QR</div>
                            : <canvas ref={qrRef} />
                        }
                    </div>
                    <p className="text-sm text-gray-500">Presente este código QR al conductor para registrar su viaje de forma rápida.</p>
                </div>
                 <div className="mt-6 flex gap-4 print:hidden">
                    <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition">Cerrar</button>
                    <button onClick={handlePrint} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Imprimir</button>
                </div>
            </div>
        </div>
    );
};


// --- Helper function for week calculations ---
const getWeekRange = (weekString: string) => {
    try {
        const [year, week] = weekString.split('-W').map(Number);
        const d = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
        const day = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - day);
        const start = new Date(d);
        start.setUTCDate(d.getUTCDate() - 3);
        const end = new Date(start);
        end.setUTCDate(start.getUTCDate() + 6);
        return { start, end };
    } catch {
        return { start: new Date(), end: new Date() };
    }
};

const ReportsManagement: React.FC<{ reports: Report[]; showToast: (message: string, type?: 'success' | 'error') => void }> = ({ reports, showToast }) => {
    const [filterType, setFilterType] = useState<'all' | 'day' | 'week' | 'month'>('all');
    const [filterValue, setFilterValue] = useState('');
    const [isSending, setIsSending] = useState(false);

    const filteredReports = useMemo(() => {
        if (filterType === 'all' || !filterValue) return reports;


        const getUTCDate = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

        switch (filterType) {
            case 'day':
                const selectedDateParts = filterValue.split('-').map(Number);
                const selectedDay = new Date(selectedDateParts[0], selectedDateParts[1] - 1, selectedDateParts[2]);
                const selectedDayUTC = getUTCDate(selectedDay);
                return reports.filter(r => getUTCDate(new Date(r.fecha)) === selectedDayUTC);
            
            case 'month':
                const [year, month] = filterValue.split('-').map(Number);
                return reports.filter(r => {
                    const reportDate = new Date(r.fecha);
                    return reportDate.getFullYear() === year && (reportDate.getMonth() + 1) === month;
                });

            case 'week':
                const { start, end } = getWeekRange(filterValue);
                const startUTC = getUTCDate(start);
                const endUTC = getUTCDate(end);
                return reports.filter(r => {
                    const reportDateUTC = getUTCDate(new Date(r.fecha));
                    return reportDateUTC >= startUTC && reportDateUTC <= endUTC;
                });

            default:
                return reports;
        }
    }, [reports, filterType, filterValue]);
    
    const handleFilterTypeChange = (type: 'all' | 'day' | 'week' | 'month') => {
        setFilterType(type);
        setFilterValue('');
    };

    const handleDownloadConsolidated = () => {
        if (filteredReports.length === 0) {
            showToast('No hay reportes para descargar en el período seleccionado.', 'error');
            return;
        }
        setIsSending(true);
        try {
            showToast('Generando PDF consolidado...');
            const doc = new jsPDF();
            
            let title = 'Reporte Consolidado de Viajes';
            let subtitle = `Total de reportes: ${filteredReports.length}`;
            if (filterType !== 'all' && filterValue) {
                title = `Reporte Consolidado`;
                subtitle = `Período: ${filterValue} | Total: ${filteredReports.length} reportes`;
            }

            doc.setFontSize(18);
            doc.text(title, 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(subtitle, 105, 28, { align: 'center' });
            
            const tableBody = filteredReports.map(r => [
                new Date(r.fecha).toLocaleDateString('es-VE'),
                r.conductor,
                r.unidad,
                r.ruta,
                r.pasajeros.length.toString()
            ]);

            autoTable(doc, {
                startY: 40,
                head: [['Fecha', 'Conductor', 'Unidad', 'Ruta', 'Nº Pasajeros']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' }
            });

            const fileName = `Reporte_Consolidado_${filterValue || 'Todos'}.pdf`;
            doc.save(fileName);
            showToast('PDF descargado exitosamente.');

        } catch (error) {
            console.error("Failed to generate consolidated PDF:", error);
            showToast('Error al generar el PDF.', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const renderFilterInput = () => {
        const inputClass = "bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500";
        switch (filterType) {
            case 'day': return <input type="date" value={filterValue} onChange={e => setFilterValue(e.target.value)} className={inputClass}/>;
            case 'week': return <input type="week" value={filterValue} onChange={e => setFilterValue(e.target.value)} className={inputClass}/>;
            case 'month': return <input type="month" value={filterValue} onChange={e => setFilterValue(e.target.value)} className={inputClass}/>;
            default: return null;
        }
    };
    
    const FilterButton: React.FC<{ type: 'all' | 'day' | 'week' | 'month', children: React.ReactNode}> = ({type, children}) => (
        <button onClick={() => handleFilterTypeChange(type)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filterType === type ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {children}
        </button>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-semibold text-gray-800">Filtrar por:</span>
                <div className="flex items-center gap-2">
                    <FilterButton type="all">Todos</FilterButton>
                    <FilterButton type="day">Día</FilterButton>
                    <FilterButton type="week">Semana</FilterButton>
                    <FilterButton type="month">Mes</FilterButton>
                </div>
                <div className="flex-grow min-w-[150px]">
                    {renderFilterInput()}
                </div>
                <button onClick={handleDownloadConsolidated} disabled={isSending || filteredReports.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed">
                     {isSending ? <SpinnerIcon className="w-5 h-5" /> : <DownloadIcon className="w-5 h-5" />}
                     {isSending ? 'Generando...' : 'Descargar Consolidado'}
                </button>
            </div>
            {filteredReports.length === 0 ? (
                <div className="text-center p-12">
                    <LogIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold">No hay reportes para mostrar.</h3>
                    <p className="text-gray-500">No se encontraron reportes para el período seleccionado o no hay reportes en el sistema.</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conductor</th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pasajeros</th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(report.fecha).toLocaleDateString('es-VE')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.ruta}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.conductor}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-bold">{report.pasajeros.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                        onClick={() => generateReportPDF(report)}
                                        className="text-blue-600 hover:text-blue-800 transition-transform duration-200 hover:scale-125"
                                        title="Descargar PDF del reporte"
                                    >
                                        <DownloadIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const VerifiersManagement: React.FC<{
    showToast: (message: string, type?: 'success' | 'error') => void;
}> = ({ showToast }) => {
    const [verifiers, setVerifiers] = useState<VerifiersData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await mockApi.getVerifiers();
                setVerifiers(data);
            } catch (error) {
                showToast('Error al cargar los datos de las firmas.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [showToast]);

    const handleInputChange = (
        type: 'contratista' | 'corporacion',
        field: 'nombre' | 'ci' | 'cargo',
        value: string
    ) => {
        setVerifiers(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [type]: {
                    ...prev[type],
                    [field]: value,
                },
            };
        });
    };

    const handleSave = async () => {
        if (!verifiers) return;
        setIsSaving(true);
        try {
            await mockApi.updateVerifiers(verifiers);
            showToast('Datos de firmas guardados exitosamente.', 'success');
        } catch (error) {
            showToast('Error al guardar los datos de las firmas.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !verifiers) {
        return <div className="flex justify-center items-center p-20"><SpinnerIcon className="w-12 h-12 text-red-600" /></div>;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Firmas para Reportes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contratista Form */}
                <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-700">Verificado por Contratista</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" value={verifiers.contratista.nombre} onChange={e => handleInputChange('contratista', 'nombre', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CI</label>
                        <input type="text" value={verifiers.contratista.ci} onChange={e => handleInputChange('contratista', 'ci', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <input type="text" value={verifiers.contratista.cargo} onChange={e => handleInputChange('contratista', 'cargo', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                    </div>
                </div>
                {/* Corporacion Form */}
                <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-700">Verificado por Corporación JF</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" value={verifiers.corporacion.nombre} onChange={e => handleInputChange('corporacion', 'nombre', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CI</label>
                        <input type="text" value={verifiers.corporacion.ci} onChange={e => handleInputChange('corporacion', 'ci', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <input type="text" value={verifiers.corporacion.cargo} onChange={e => handleInputChange('corporacion', 'cargo', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t pt-6 flex justify-end">
                <button onClick={handleSave} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 disabled:bg-red-300">
                    {isSaving ? <SpinnerIcon className="w-5 h-5" /> : null}
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
};


const AdminView: React.FC = () => {
    const [view, setView] = useState<'reports' | 'passengers' | 'drivers' | 'users' | 'verifiers'>('reports');
    const [reports, setReports] = useState<Report[]>([]);
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [qrModalPassenger, setQrModalPassenger] = useState<Passenger | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [reportsData, passengersData, driversData, usersData] = await Promise.all([
                    mockApi.getReports(),
                    mockApi.getPassengers(),
                    mockApi.getDrivers(),
                    mockApi.getAdminUsers()
                ]);
                setReports(reportsData);
                setPassengers(passengersData);
                setDrivers(driversData);
                setAdminUsers(usersData);
            } catch (error) {
                showToast('Error al cargar los datos.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        // setToastInfo({ show: true, message, type });
        // setTimeout(() => setToastInfo({ show: false, message: '', type: 'success' }), 5000);
    };

    const TabButton: React.FC<{ activeView: string, targetView: string, label: string, icon: React.ReactNode, onClick: () => void }> = 
    ({ activeView, targetView, label, icon, onClick }) => {
        const isActive = activeView === targetView;
        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-all duration-300 ${
                    isActive
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
                {icon}
                {label}
            </button>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center p-20"><SpinnerIcon className="w-12 h-12 text-red-600" /></div>;
        }

        switch(view) {
            case 'reports': return <ReportsManagement reports={reports} showToast={showToast} />;
            case 'passengers': return <DataManagement<Passenger> 
                title="Pasajeros" 
                data={passengers} 
                columns={['nombreCompleto', 'nroCedula', 'gerencia']} 
                api={{ add: mockApi.addPassenger, delete: mockApi.deletePassenger, get: mockApi.getPassengers, update: mockApi.updatePassenger }} 
                onUpdate={setPassengers} 
                showToast={showToast} 
                formFields={['nombreCompleto', 'nroCedula', 'gerencia']}
                onGenerateQR={setQrModalPassenger} 
            />;
            case 'drivers': return <DataManagement<Driver> title="Conductores" data={drivers} columns={['nombreCompleto', 'unidad']} api={{ add: mockApi.addDriver, delete: mockApi.deleteDriver, get: mockApi.getDrivers, update: mockApi.updateDriver }} onUpdate={setDrivers} showToast={showToast} formFields={['nombreCompleto', 'unidad']} />;
            case 'users': return <DataManagement<AdminUser> 
                title="Usuarios" 
                data={adminUsers} 
                columns={['name', 'username']} 
                api={{ add: mockApi.addAdminUser, delete: mockApi.deleteAdminUser, get: mockApi.getAdminUsers, update: mockApi.updateAdminUser }} 
                onUpdate={setAdminUsers} 
                showToast={showToast} 
                formFields={['name', 'username', 'password']}
                fieldTypes={{ password: 'password' }}
                fieldPlaceholders={{ password: 'Dejar en blanco para no cambiar' }}
            />;
            case 'verifiers': return <VerifiersManagement showToast={showToast} />;
            default: return null;
        }
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
            <div className="flex flex-wrap items-center gap-4 p-2 bg-gray-200 rounded-xl">
                 <TabButton activeView={view} targetView="reports" label="Reportes" icon={<LogIcon className="w-6 h-6"/>} onClick={() => setView('reports')} />
                 <TabButton activeView={view} targetView="passengers" label="Pasajeros" icon={<UsersIcon className="w-6 h-6"/>} onClick={() => setView('passengers')} />
                 <TabButton activeView={view} targetView="drivers" label="Conductores" icon={<TruckIcon className="w-6 h-6"/>} onClick={() => setView('drivers')} />
                 <TabButton activeView={view} targetView="users" label="Usuarios" icon={<UsersAdminIcon className="w-6 h-6"/>} onClick={() => setView('users')} />
                 <TabButton activeView={view} targetView="verifiers" label="Firmas" icon={<SignatureIcon className="w-6 h-6"/>} onClick={() => setView('verifiers')} />
            </div>
            <div>
                {renderContent()}
            </div>
            {qrModalPassenger && <QRCodeModal passenger={qrModalPassenger} onClose={() => setQrModalPassenger(null)} />}
        </div>
    );
};


interface DataManagementProps<T extends { id: string }> {
    title: string;
    data: T[];
    columns: (keyof T)[];
    api: {
        add: (item: Omit<T, 'id'>) => Promise<T>;
        delete: (id: string) => Promise<void>;
        get: () => Promise<T[]>;
        update: (id: string, item: Partial<T>) => Promise<T>;
    };
    onUpdate: (data: T[]) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
    formFields: string[];
    onGenerateQR?: (item: T) => void;
    fieldTypes?: { [key: string]: string };
    fieldPlaceholders?: { [key: string]: string };
}
const DataManagement = <T extends { id: string }>({ title, data, columns, api, onUpdate, showToast, formFields, onGenerateQR, fieldTypes, fieldPlaceholders }: DataManagementProps<T>) => {
    const [formData, setFormData] = useState<Partial<T>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const isEditing = editingId !== null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({});
        setEditingId(null);
    };

    const handleEditClick = (item: T) => {
        setEditingId(item.id);
        const editFormData = { ...item };
        // Clear password field for security
        if ('password' in editFormData) {
            (editFormData as any).password = '';
        }
        setFormData(editFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formFields.filter(f => f !== 'password').some(field => !(formData as any)[field] || String((formData as any)[field]).trim() === '')) {
            showToast('Por favor, complete todos los campos requeridos.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            if (isEditing) {
                const payload = { ...formData };
                // Don't update password if the field is empty
                if ('password' in payload && !(payload as any).password) {
                    delete (payload as any).password;
                }
                await api.update(editingId!, payload);
                showToast(`${title.slice(0, -1)} actualizado con éxito.`, 'success');
            } else {
                 // Ensure password is not empty for new users
                if ('password' in formData && !(formData as any).password) {
                     showToast('La contraseña es obligatoria para nuevos usuarios.', 'error');
                     setIsSubmitting(false);
                     return;
                }
                await api.add(formData as Omit<T, 'id'>);
                showToast(`${title.slice(0, -1)} añadido con éxito.`, 'success');
            }
            const updatedData = await api.get();
            onUpdate(updatedData);
            resetForm();
        } catch (error: any) {
            showToast(error.message || `Error al guardar ${title.slice(0, -1)}.`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar este ${title.slice(0, -1)}?`)) {
            try {
                await api.delete(id);
                const updatedData = await api.get();
                onUpdate(updatedData);
                showToast(`${title.slice(0, -1)} eliminado con éxito.`, 'success');
            } catch (error: any) {
                showToast(error.message || `Error al eliminar ${title.slice(0, -1)}.`, 'error');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => <th key={String(col)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{String(col).replace(/([A-Z])/g, ' $1').toUpperCase()}</th>)}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map(item => (
                            <tr key={item.id}>
                                {columns.map(col => <td key={String(col)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{String(item[col])}</td>)}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                                    {onGenerateQR && <button onClick={() => onGenerateQR(item)} className="text-gray-600 hover:text-black transition-transform duration-200 hover:scale-125" title="Generar QR"><QRIcon className="w-5 h-5"/></button>}
                                    <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800 transition-transform duration-200 hover:scale-125" title="Editar"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 transition-transform duration-200 hover:scale-125" title="Eliminar"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="lg:col-span-1">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
                    <h3 className="text-lg font-bold">{isEditing ? `Editar ${title.slice(0, -1)}` : `Añadir Nuevo ${title.slice(0, -1)}`}</h3>
                    {formFields.map(field => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</label>
                            <input
                                type={fieldTypes?.[field] || 'text'}
                                name={field}
                                value={(formData as any)[field] || ''}
                                onChange={handleInputChange}
                                placeholder={isEditing ? (fieldPlaceholders?.[field] || '') : ''}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required={!isEditing || field !== 'password'}
                            />
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                         {isEditing && (
                            <button type="button" onClick={resetForm} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all duration-200">
                                Cancelar
                            </button>
                        )}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-red-300">
                            {isSubmitting ? <SpinnerIcon className="w-5 h-5" /> : (isEditing ? null : <PlusIcon className="w-5 h-5" />)}
                            {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Añadir')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminView;
