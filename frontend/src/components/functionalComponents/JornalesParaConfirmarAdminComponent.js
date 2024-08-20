import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import JornalesParaConfirmarComponent from "../functionalComponents/JornalesParaConfirmarComponent";
import ObraService from "../../services/ObraService";

export const JornalesParaConfirmarAdminComponent = () => {
    const [obras, setObras] = useState(null);
    const { personaRolLoggeado } = useAuth();

    const fetchObra = async () => {
        try {
            const response = await ObraService.getAllObras();
            if (response.data) {
                setObras(response.data);
            }
        } catch (error) {
            console.error('Error fetching obra:', error);
        }
    };

    useEffect(() => {
        fetchObra();
    }, [personaRolLoggeado.id]);

    return (
        <div>
            {obras?.length > 0 ? (
                obras.map((obra) => (
                    <JornalesParaConfirmarComponent key={obra.id} obra={obra} />
                ))
            ) : (
                <p>No hay obras disponibles</p>
            )}
        </div>
    );
};

export default JornalesParaConfirmarAdminComponent;
