
export interface Passenger {
    id: string; // nroCedula will be used as the ID
    nombreCompleto: string;
    nroCedula: string;
    gerencia: string;
}

export interface Driver {
    id: string;
    nombreCompleto: string;
    unidad: string;
}

export interface RegisteredPassenger {
    passenger: Passenger;
    hora: string;
}

export interface Report {
    id: string;
    conductor: string;
    conductorId: string;
    unidad: string;
    ruta: string;
    fecha: Date;
    periodo: 'AM' | 'PM';
    hora: string; // Departure time
    horaLlegada?: string; // Arrival time
    area: string;
    pasajeros: RegisteredPassenger[];
}

export interface User {
    id:string;
    name: string;
    role: 'admin' | 'driver';
    details?: Driver; // Only if role is 'driver'
}

export interface AdminUser {
    id: string; // username will be used as the ID
    username: string;
    password: string;
    name: string;
    role: 'admin';
}

export interface Verifier {
    nombre: string;
    ci: string;
    cargo: string;
}

export interface VerifiersData {
    contratista: Verifier;
    corporacion: Verifier;
}
