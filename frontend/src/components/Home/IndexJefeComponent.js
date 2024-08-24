import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import JefeObraService from "../../services/JefeObraService";
import JornalesParaConfirmarComponent from "../functionalComponents/JornalesParaConfirmarComponent";

export const IndexJefeComponent = () => {
  const [obra, setObra] = useState(null);
  const { personaRolLoggeado } = useAuth();

  const fetchObra = async () => {
    try {
      const response = await JefeObraService.getObraByJefeId(personaRolLoggeado.id);
      if (response.data) {
        setObra(response.data);
      } else {
        setObra(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("No se encontró ninguna obra para este jefe.");
        setObra(null);
      } else {
        
        console.error("Error al obtener la obra:", error);
        setObra(null);
      }
    }
  };

  useEffect(() => {
    fetchObra();
  }, [personaRolLoggeado.id]);

  return (
    <div>
      <JornalesParaConfirmarComponent obra={obra} />
    </div>
  );
};

export default IndexJefeComponent;
