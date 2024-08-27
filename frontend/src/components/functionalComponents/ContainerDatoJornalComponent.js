
import DatoJornalComponent from "./DatoJornalComponent";

const ContainerDatoJornalComponent = ({ jornales, adminView, jefeView, onError = () => {}, onSuccess = () => {} }) => {

    return (
        <table className='table table-sm table-bordered table-striped mt-3'>
            <thead>
                <tr>
                    {/* <th> </th> */}
                    {(adminView || jefeView) &&(<th className="text-center">Nombre</th>)}
                    <th className="text-center">Tipo </th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Obra</th>
                    <th className="text-center">Ingreso</th>
                    <th className="text-center">Salida</th>
                    {(adminView || jefeView) &&(<th className="text-center">Confirmado</th>)}
                    {(adminView || jefeView) &&(<th className="text-center">Acciones</th>)}
                </tr>
            </thead>
            <tbody>
            {jornales.map(p =>
                    <DatoJornalComponent
                        key={p.id}
                        jornal={p}
                        adminView={adminView}
                        jefeView={jefeView}
                        onError={onError}
                        onSuccess={onSuccess}
                    />
                )}
            </tbody>
        </table>
    );
};

export default ContainerDatoJornalComponent;









