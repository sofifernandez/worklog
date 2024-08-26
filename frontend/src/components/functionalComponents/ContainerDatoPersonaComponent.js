
import DatoPersonaComponent from "./DatoPersonaComponent";

const ContainerDatoPersonaComponent = ({ personas, minimalData, handleRowClick }) => {

    const isAnArray = Array.isArray(personas)

    return (
        <table className={`table table-sm table-bordered table-striped mt-3 ${minimalData ? 'table-hover-row' : ''}`}>
            <thead>
                <th></th>
                <th>Nombre completo</th>
                <th>Cédula</th>
                {!minimalData && (<th>Fecha Nacimiento</th>)}
                <th>Rol actual</th>
                {!minimalData && (<th>Activo</th>)}
            </thead>
            <tbody>
                {isAnArray ? (
                    personas.map(p =>
                        <DatoPersonaComponent persona={p} minimalData={minimalData} handleRowClick={handleRowClick} />
                    ))
                    :
                    (
                        <DatoPersonaComponent persona={personas} minimalData={minimalData} handleRowClick={handleRowClick} />
                    )
                }

            </tbody>
        </table>

    );
};

export default ContainerDatoPersonaComponent;









