import type { Passenger, Driver, AdminUser } from '../types';

export const PASSENGER_DATABASE: Passenger[] = [
    {
        id: '14475713',
        nombreCompleto: 'ANELISA JOSEFINA HUERTA DELGADO',
        nroCedula: '14475713',
        gerencia: 'INGENIERIA DE PETROLEO'
    },
    {
        id: '21353310',
        nombreCompleto: 'EDUARDO JOSE SILVA RANGEL',
        nroCedula: '21353310',
        gerencia: 'FACILIDADES'
    },
    {
        id: '22134565',
        nombreCompleto: 'JESUS DANIEL MARQUEZ DIOMAIUTO',
        nroCedula: '22134565',
        gerencia: 'CONTRATACION'
    },
    {
        id: '22147204',
        nombreCompleto: 'ROSSANA CAROLINA ROMERO CORDERO',
        nroCedula: '22147204',
        gerencia: 'SALUD'
    },
    {
        id: '27056942',
        nombreCompleto: 'INES MARIA MORAN JIMENEZ',
        nroCedula: '27056942',
        gerencia: 'FINANZAS'
    },
    {
        id: '27848103',
        nombreCompleto: 'ANA VILLASMIL',
        nroCedula: '27848103',
        gerencia: 'FINANZAS'
    },
    { id: '12345678', nombreCompleto: 'MARIA GONZALEZ', nroCedula: '12345678', gerencia: 'RECURSOS HUMANOS' },
    { id: '87654321', nombreCompleto: 'JOSE HERNANDEZ', nroCedula: '87654321', gerencia: 'OPERACIONES' },
    { id: '11223344', nombreCompleto: 'ANA MARTINEZ', nroCedula: '11223344', gerencia: 'MANTENIMIENTO' },
    { id: '44332211', nombreCompleto: 'LUIS GARCIA', nroCedula: '44332211', gerencia: 'SEGURIDAD' },
    { id: '98765432', nombreCompleto: 'CARMEN RODRIGUEZ', nroCedula: '98765432', gerencia: 'PLANIFICACION' },
    { id: '23456789', nombreCompleto: 'JORGE PEREZ', nroCedula: '23456789', gerencia: 'PROYECTOS' },
    { id: '89765432', nombreCompleto: 'SOFIA GOMEZ', nroCedula: '89765432', gerencia: 'FINANZAS' },
    { id: '34567890', nombreCompleto: 'PEDRO SANCHEZ', nroCedula: '34567890', gerencia: 'TECNOLOGIA' },
    { id: '90876543', nombreCompleto: 'LAURA DIAZ', nroCedula: '90876543', gerencia: 'COMPRAS' },
    { id: '45678901', nombreCompleto: 'MIGUEL TORRES', nroCedula: '45678901', gerencia: 'ASUNTOS PUBLICOS' },
];

export const DRIVER_DATABASE: Driver[] = [
    {
        id: 'drv_001',
        nombreCompleto: 'ALBERTO ROMERO',
        unidad: '274',
    },
     {
        id: 'drv_002',
        nombreCompleto: 'CARLOS PEREZ',
        unidad: '150',
    },
    { id: 'drv_003', nombreCompleto: 'RAFAEL CASTILLO', unidad: '310' },
    { id: 'drv_004', nombreCompleto: 'RICARDO SOTO', unidad: '225' },
    { id: 'drv_005', nombreCompleto: 'GABRIEL ROJAS', unidad: '188' },
    { id: 'drv_006', nombreCompleto: 'DAVID MENDOZA', unidad: '412' },
];

export const ADMIN_USER_DATABASE: AdminUser[] = [
    {
        id: 'petroboscan',
        username: 'petroboscan',
        password: 'petroboscan2025',
        name: 'Admin Principal',
        role: 'admin',
    },
];