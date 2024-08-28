import { useNavigate, useParams } from 'react-router-dom';
import JornalService from '../services/JornalService';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export const QrJornalComponent = () => {
    const { setRefreshJornales } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const obraID = id;

    // Function to handle the creation or update process
    const handleCreateOrUpdateJornal = () => {
        if (obraID) {
            JornalService.createOrUpdateJornalQr(obraID)
                .then((res) => {
                    const nuevoJornal = res.data;
                    let titulo = '';
                    if (!nuevoJornal.horaFin) {
                        titulo = 'Ingreso a obra: ' + nuevoJornal.obra.nombre;
                    } else {
                        titulo = 'Salida de obra: ' + nuevoJornal.obra.nombre;
                    }

                    Swal.fire({
                        title: titulo,
                        showConfirmButton: true, // Show the close button
                        icon: 'success',
                        confirmButtonText: 'Cerrar', // Customize the button text
                    }).then(() => {
                        setRefreshJornales(true);
                        navigate('/');
                    });
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response) {
                        Swal.fire({
                            title: 'Error',
                            text: error.response.data, // Display the error message
                            icon: 'error',
                            showConfirmButton: true, // Show the close button
                            confirmButtonText: 'Cerrar', // Customize the button text
                        }).then(() => {
                            setRefreshJornales(true);
                            navigate('/');
                        });
                    }
                });
        } else {
            Swal.fire({
                title: 'Error al registrar jornal',
                showConfirmButton: true, // Show the close button
                confirmButtonText: 'Cerrar', // Customize the button text
            }).then(() => {
                navigate('/');
            });
        }
    };

    // Show confirmation alert when the component renders
    Swal.fire({
        title: 'Confirmación',
        text: '¿Desea registrar el jornal?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            handleCreateOrUpdateJornal();
        } else {
            navigate('/');
        }
    });

    return null; // Component does not render any visible elements
};

export default QrJornalComponent;
