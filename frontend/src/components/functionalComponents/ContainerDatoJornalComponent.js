
import DatoJornalComponent from "./DatoJornalComponent";

const ContainerDatoJornalComponent = ({ jornales }) => {

    return (
        <table className='table table-sm table-bordered table-striped mt-3'>
            <thead>
                <tr>
                    {/* <th> </th> */}
                    <th> </th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Obra</th>
                    <th className="text-center">Ingreso</th>
                    <th className="text-center">Salida</th>
                </tr>
            </thead>
            <tbody>
                {jornales.map(p =>
                    <DatoJornalComponent jornal={p} onlyRows={true} />
                )}
            </tbody>
        </table>
    );
};

export default ContainerDatoJornalComponent;









