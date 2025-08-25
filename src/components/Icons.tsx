import React from 'react';

type IconProps = {
    className?: string;
};

export const CorporacionJFLogo: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Corporacion JF Logo">
        <rect width="100" height="100" rx="15" fill="#1f2937"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="65" fontFamily="Arial, sans-serif" fontWeight="bold">
            JF
        </text>
    </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const QRIcon: React.FC<IconProps> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 2.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM12 12h.01M17 12h.01M7 12h.01M7 17h.01M12 7h.01M7 7h.01M4 4h16v16H4V4z" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-9 3a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const IdCardIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4m-9 4h2m-2 4h6" />
    </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" />
    </svg>
);

export const RouteIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const LogIcon: React.FC<IconProps> = ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
    </svg>
);

export const LockClosedIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const UsersAdminIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.781-4.121M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const SignatureIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

// Base64 encoded logos for PDF generation.
export const CORPORACION_JF_LOGO_B64 = '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';
export const CORPORACION_JF_CIRCULAR_LOGO_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
