
import DatoPersonaComponent from "./DatoPersonaComponent";

const ContainerDatoPersonaComponent = ({ personas}) => {

    return (
        <table className='table table-sm table-bordered table-striped mt-3'>
            <thead>
                <th> </th>
                <th>Nombre completo</th>
                <th>Cédula</th>
                <th>Fecha Nacimiento</th>
                <th>Rol actual</th>
                <th>Activo</th>
            </thead>
            <tbody>
                {personas.map(p =>
                    <DatoPersonaComponent persona={p} onlyRows={true} />
                )}
            </tbody>
        </table>
    );
};

export default ContainerDatoPersonaComponent;









