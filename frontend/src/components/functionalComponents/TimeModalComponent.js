import React, { useState } from 'react';
import TimePicker from 'react-time-picker';
import { Modal, Button } from 'react-bootstrap';
import { format, subHours } from 'date-fns';

const TimeModal = ({ show, handleClose, handleSave, type, fecha }) => {
    const [time, setTime] = useState(format(new Date(), 'HH:mm:ss'));

    const onSave = () => {
        if (!time) {
            console.error('Invalid time:', time);
            return;
        }

        if (!fecha) {
            console.error('Invalid fecha:', fecha);
            return;
        }

        const [year, month, day] = fecha.split('-');
        const [hours, minutes] = time.split(':'); // Default to '00' for seconds if not provided

        if (!year || !month || !day || !hours || !minutes) {
            console.error('Invalid date or time components:', { year, month, day, hours, minutes });
            return;
        }

        // Crear un objeto de fecha y hora a partir de la fecha y hora seleccionadas
        const selectedDate = new Date(year, month - 1, day, hours, minutes);

        // Restar 3 horas solo al guardar
        const adjustedDate = subHours(selectedDate, 3);

        // Formatear la fecha y hora ajustadas en el formato requerido
        const formattedTime = format(adjustedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

        handleSave(formattedTime, type);
        handleClose();
    };

    
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar {type === 'horaComienzo' ? 'Hora de Inicio' : 'Hora de Fin'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TimePicker
                    value={time}
                    onChange={setTime}
                    className='form-control'
                    format='HH:mm' // Formato sin segundos
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="primary" onClick={onSave}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TimeModal;