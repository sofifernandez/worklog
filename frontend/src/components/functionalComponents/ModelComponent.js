import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';

const ModalComponent = ({ show, handleClose, children, selectedQR, obra }) => {
    const downloadAsPDF = () => {
        if (!selectedQR) {
            console.error('No QR code selected');
            return;
        }

        try {
            const doc = new jsPDF();
            const imgData = `data:image/png;base64,${selectedQR}`;

            const img = new Image();
            img.src = imgData;

            img.onload = () => {
                const imgWidth = 180;
                const imgHeight = (img.width * imgWidth) / img.width; 

                doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
                doc.save(`codigo_qr_${obra.nombre}.pdf`);
            };

            img.onerror = (error) => {
                console.error('Image load error:', error);
            };
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Código QR: {obra.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={downloadAsPDF}>
                    Descargar como PDF
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;