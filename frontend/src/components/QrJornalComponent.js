import { useNavigate, useParams } from 'react-router-dom';
import JornalService from '../services/JornalService';
import Swal from 'sweetalert2';


export const QrJornalComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams()
    const obra = { id: id }
        if (obra) {
            const jornal = { obra }
            JornalService.createOrUpdateJornalQr(jornal).then((res) => {  
                let timerInterval;
                Swal.fire({
                   title: 'Jornal Registrado con éxito',
                   timer: 2000,
                   timerProgressBar: true,
                   didOpen: () => {
                       Swal.showLoading();
                    },
                   willClose: () => {
                    clearInterval(timerInterval);
                   }
                   }).then((result) => {
                     if (result.dismiss === Swal.DismissReason.timer) {
                       navigate('/');
                    }
                   });
               navigate('/');
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === 'Error de integridad de datos') {
                        console.log(error.response.data);
                    }
                }
            })
        } else {
                let timerInterval;
                 Swal.fire({
                    title: 'Error al registrar jornal',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                     },
                    willClose: () => {
                     clearInterval(timerInterval);
                    }
                    }).then((result) => {
                      if (result.dismiss === Swal.DismissReason.timer) {
                        navigate('/');
                     }
                    });
                navigate('/');
         }
}

export default QrJornalComponent