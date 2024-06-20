
import DatoObraComponent from "./DatoObraComponent";

const ContainerDatoObraComponent = ({ obras, onRefrescarDatos }) => {

    const onRefrescarDatosParent=()=>{
        onRefrescarDatos()
    }

    return (
        <table className='table table-sm table-bordered table-striped mt-3'>
            <thead>
                <th>Nombre</th>
                <th>Numero BPS</th>
                <th>Activo</th>
                <th>Jefe de Obra</th>
                <th>Acciones</th>
            </thead>
            <tbody>
                {obras.map(obra =>
                    <DatoObraComponent obra={obra} onlyRows={true} onRefrescarDatos={onRefrescarDatosParent} />
                )}
            </tbody>
        </table>
    );
};

export default ContainerDatoObraComponent;









