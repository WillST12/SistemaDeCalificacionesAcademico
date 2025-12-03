import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarClase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    periodo: "",
    idProfesorMateria: null,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const res = await ClaseService.obtener(id);

    setForm({
      periodo: res.data.periodo ?? res.data.Periodo,
      idProfesorMateria: res.data.idProfesorMateria ?? res.data.IdProfesorMateria,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await ClaseService.actualizar(id, {
      periodo: form.periodo,
      idProfesorMateria: form.idProfesorMateria,
      activo: true
    });

    alert("Clase actualizada correctamente");
    navigate("/admin/clases");
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Editar Clase</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
        
        <label className="font-semibold">Periodo:</label>
        <input
          className="input w-full mb-4"
          value={form.periodo}
          onChange={(e) => setForm({ ...form, periodo: e.target.value })}
        />

        <input type="hidden" value={form.idProfesorMateria} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
