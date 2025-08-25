import React, { useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { QRIcon } from './Icons';

interface QRScannerModalProps {
    onClose: () => void;
    onScanSuccess: (decodedText: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onScanSuccess }) => {
    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;
        
        // Use a flag to prevent multiple scans or cleanup calls
        let isScanning = true;

        const handleSuccess = (decodedText: string) => {
            if (isScanning) {
                isScanning = false;
                // Stop scanning and clean up before calling the success handler
                if (scanner) {
                    scanner.clear().then(() => {
                        onScanSuccess(decodedText);
                    }).catch(error => {
                        console.error("Failed to clear scanner on success:", error);
                        onScanSuccess(decodedText);
                    });
                }
            }
        };

        const handleError = (errorMessage: string) => {
            // This callback is called frequently, so it's best to keep it quiet
        };

        // Ensure the element is in the DOM before initializing
        const containerId = 'qr-reader';
        const container = document.getElementById(containerId);
        
        if (container) {
            scanner = new Html5QrcodeScanner(
                containerId, 
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    videoConstraints: {
                        facingMode: { ideal: "environment" } // Strongly prefer rear camera
                    }
                },
                /* verbose= */ false
            );
            scanner.render(handleSuccess, handleError);
        }

        return () => {
            if (isScanning && scanner) {
                scanner.clear().catch((error) => {
                    // This can fail if the scanner is already stopped or never started.
                    // It's safe to ignore.
                });
            }
        };
    }, [onScanSuccess]);

    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center justify-center mb-5">
                    <div className="bg-gray-800 p-4 rounded-full">
                        <QRIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mt-4 mb-2">Escanear Código QR</h2>
                    <p className="text-gray-500 text-center">Apunte la cámara al código QR del pasajero.</p>
                </div>
                
                <div id="qr-reader" className="w-full rounded-lg overflow-hidden border-4 border-gray-300"></div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;