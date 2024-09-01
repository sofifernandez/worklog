import React from 'react';
import JornalService from '../../services/JornalService';

const ConfirmarJornalComponent = ({ jornal, jornales, onError, onSuccess }) => {

    const confirmarJornal = async (jornal) => {
        try {
            await JornalService.confirmarJornal(jornal.id);
            onSuccess(`${jornal.persona.nombre}: Jornal del dia ${jornal.fechaJornal} confirmado exitosamente.`);
        } catch (error) {
            onError(error.response?.data || `${jornal.persona.apellido}: jornal del dia ${jornal.fechaJornal} no se pudo confirmar.`);
        }
    };

    const confirmarJornales = async (jornales) => {
        const results = await Promise.all(jornales.map(async (jornal) => {
            try {
                await JornalService.confirmarJornal(jornal.id);
                return { success: true, jornal };
            } catch (error) {
                return { success: false, error: error.response?.data || `${jornal.persona.apellido}: jornal del dia ${jornal.fechaJornal} no se pudo confirmar.` };
            }
        }));

        const successfulResults = results.filter(result => result.success);
        const errorResults = results.filter(result => !result.success);

        if (errorResults.length > 0) {
            errorResults.forEach(result => onError(result.error));
        }

        if (successfulResults.length > 0) {
            successfulResults.forEach(res => onSuccess(`${res.jornal.persona.apellido}: jornal del dia ${res.jornal.fechaJornal} confirmado exitosamente.`));
        }
    };

    const handleConfirm = () => {
        if (jornal) {
            confirmarJornal(jornal);
        } else if (jornales && jornales.length > 0) {
            confirmarJornales(jornales);
        }
    };

    const buttonText = jornal ? 'Confirmar' : (jornales && jornales.length > 0) ? 'Confirmar todos los jornales' : '';

    return (
        <button
            className="btn btn-primary mx-1"
            onClick={handleConfirm}
        >
            {buttonText}
        </button>
    );
};

export default ConfirmarJornalComponent;