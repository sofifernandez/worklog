
import DatoJornalComponent from "./DatoJornalComponent";

const ContainerDatoJornalComponent = ({ jornales,adminView }) => {

    return (
        <table className='table table-sm table-bordered table-striped mt-3'>
            <thead>
                <tr>
                    {/* <th> </th> */}
                    {adminView &&(<th className="text-center">Nombre</th>)}
                    <th> </th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Obra</th>
                    <th className="text-center">Ingreso</th>
                    <th className="text-center">Salida</th>
                    {adminView &&(<th className="text-center">Confirmado</th>)}
                </tr>
            </thead>
            <tbody>
                {jornales.map(p =>
                    <DatoJornalComponent jornal={p} onlyRows={true} adminView={adminView} />
                )}
            </tbody>
        </table>
    );
};

export default ContainerDatoJornalComponent;









