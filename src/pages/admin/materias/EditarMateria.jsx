import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import materiaService from "../../../services/materiaService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarMateria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(true);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ================================
  // Cargar datos existentes
  // ================================
  useEffect(() => {
    const cargarMateria = async () => {
      try {
        const res = await materiaService.obtener(id);
        setForm({
          nombre: res.data.nombre,
          codigo: res.data.codigo,
          descripcion: res.data.descripcion || "",
        });
        setLoading(false);
      } catch (error) {
        alert("Error al cargar la materia");
        navigate("/admin/materias");
      }
    };

    cargarMateria();
  }, [id, navigate]);

  // ================================
  // Guardar cambios
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIONES
    if (!form.nombre.trim() || !form.codigo.trim()) {
      alert("El nombre y el código son obligatorios.");
      return;
    }

    try {
      await materiaService.actualizar(id, form);
      alert("Materia actualizada correctamente");
      navigate("/admin/materias");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar materia");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Editar Materia</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >
        <input
          name="nombre"
          placeholder="Nombre de la materia"
          className="input"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          name="codigo"
          placeholder="Código"
          className="input"
          value={form.codigo}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción (opcional)"
          className="input col-span-2"
          rows="4"
          value={form.descripcion}
          onChange={handleChange}
        ></textarea>

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
