import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Report, VerifiersData } from '../types';
import { CORPORACION_JF_LOGO_B64, CORPORACION_JF_CIRCULAR_LOGO_B64 } from './Icons';

export const generateReportPDF = (report: Report) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const verifiersDataString = localStorage.getItem('VERIFIERS_DATA');
    const verifiers: VerifiersData = verifiersDataString 
        ? JSON.parse(verifiersDataString) 
        : { 
            contratista: { nombre: '', ci: '', cargo: '' }, 
            corporacion: { nombre: '', ci: '', cargo: '' } 
          };

    // --- Header ---
    // Left Logo (PDVSA)
    doc.addImage(CORPORACION_JF_LOGO_B64, 'PNG', 12, 12, 25, 18);
    
    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE VIAJES DIARIOS', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Corporación JF', pageWidth / 2, 25, { align: 'center' });

    // Right Logo (Circular JF)
    doc.addImage(CORPORACION_JF_CIRCULAR_LOGO_B64, 'PNG', 175, 12, 20, 20);
    doc.setFontSize(10);
    doc.text('J-50014920-4', 185, 36, { align: 'center' });

    // --- Info Section ---
    const startY = 45;

    // Area Box
    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230);
    doc.rect(15, startY, 60, 7, 'FD'); // x, y, w, h, style
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AREA', 45, startY + 4.5, { align: 'center' });
    doc.rect(15, startY + 7, 60, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(report.area, 45, startY + 13, { align: 'center' });

    // Conductor Section
    doc.setFont('helvetica', 'bold');
    doc.text('CONDUCTOR:', 15, startY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(report.conductor, 45, startY + 25);
    
    const reportDate = new Date(report.fecha);
    const userTimezoneOffset = reportDate.getTimezoneOffset() * 60000;
    const date = new Date(reportDate.getTime() + userTimezoneOffset);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    autoTable(doc, {
        startY: startY + 28,
        head: [['DIA', 'MES', 'AÑO', 'H. SALIDA', 'H. LLEGADA']],
        body: [[day, month, year, report.hora, report.horaLlegada || '']],
        headStyles: { halign: 'center', fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.1, lineColor: 0, fontSize: 8 },
        bodyStyles: { halign: 'center', lineWidth: 0.1, lineColor: 0 },
        margin: { left: 15 },
        tableWidth: 80,
        theme: 'grid'
    });
    
    // Route and Unit section
    doc.rect(100, startY + 28, 95, 14.5);
    doc.rect(100, startY + 21, 95, 7);
    doc.text(report.ruta, 102, startY + 35);
    
    doc.setFont('helvetica', 'bold');
    doc.text('UNIDAD:', 140, startY + 25.5);
    doc.setFont('helvetica', 'normal');
    doc.text(report.unidad, 160, startY + 25.5);

    // AM/PM Box
    doc.rect(160, startY + 35.5, 35, 7);
    doc.line(177.5, startY + 35.5, 177.5, startY + 42.5); // separator
    doc.text('AM', 168.5, startY + 40, { align: 'center' });
    doc.text('PM', 186.5, startY + 40, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    if(report.periodo === 'AM') {
        doc.text('X', 168.5, startY + 40, { align: 'center' });
    } else {
        doc.text('X', 186.5, startY + 40, { align: 'center' });
    }

    // --- Passengers Table ---
    const tableBody: any[][] = report.pasajeros.map((p, index) => [
        index + 1,
        p.passenger.nombreCompleto,
        p.passenger.nroCedula,
        p.passenger.gerencia,
        p.hora
    ]);
    
    const emptyRowsCount = 20 - tableBody.length;
    if (emptyRowsCount > 0) {
        for (let i = 0; i < emptyRowsCount; i++) {
            tableBody.push([
                { content: tableBody.length + i + 1, styles: { textColor: '#888' } },
                '', '', '', ''
            ]);
        }
    }
    
    autoTable(doc, {
        startY: startY + 50,
        head: [['N°', 'Nombre y Apellido', 'Cédula', 'Gerencia', 'Hora']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            1: { cellWidth: 65 },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
        },
        didDrawPage: (data: any) => {
            // --- Footer ---
            const footerY = 250;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('VERIFICADO POR CONTRATISTA', 15, footerY);
            doc.text('VERIFICADO POR CORPORACIÓN JF', 120, footerY);

            doc.setFont('helvetica', 'normal');
            doc.text(`NOMBRE: ${verifiers.contratista.nombre}`, 15, footerY + 5);
            doc.text(`CI: ${verifiers.contratista.ci}`, 15, footerY + 10);
            doc.text(`CARGO: ${verifiers.contratista.cargo}`, 15, footerY + 15);
            doc.text('FIRMA:', 15, footerY + 25);
            doc.line(30, footerY + 24.5, 80, footerY + 24.5);
            
            doc.text(`NOMBRE: ${verifiers.corporacion.nombre}`, 120, footerY + 5);
            doc.text(`CI: ${verifiers.corporacion.ci}`, 120, footerY + 10);
            doc.text(`CARGO: ${verifiers.corporacion.cargo}`, 120, footerY + 15);
            doc.text('FIRMA:', 120, footerY + 25);
            doc.line(135, footerY + 24.5, 185, footerY + 24.5);
        }
    });

    doc.save(`Reporte_Viaje_${report.id.slice(-6)}.pdf`);
};
