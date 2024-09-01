
import DatoObraComponent from "./DatoObraComponent";

const ContainerDatoObraComponent = ({ obras, onRefrescarDatos }) => {
    console.log(obras)
    const onRefrescarDatosParent = () => {
        onRefrescarDatos()
    }

    return (
        <table className='table table-sm table-striped mt-3'>
            <thead>
                <th></th>
                <th>Nombre</th>
                <th>Número BPS</th>
                <th className='text-center'>Activo</th>
                <th>Jefe de Obra</th>
                <th>Codigo QR</th>
            </thead>
            <tbody>
                {obras.map(obra =>
                    <DatoObraComponent obra={obra} onRefrescarDatos={onRefrescarDatosParent} />
                )}
            </tbody>
        </table>
    );
};

export default ContainerDatoObraComponent;









