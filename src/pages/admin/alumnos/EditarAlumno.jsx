import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    alumnoService.obtener(id).then((res) => setForm(res.data));
  }, [id]);

  if (!form) return <p>Cargando...</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await alumnoService.actualizar(id, form);
    navigate("/admin/alumnos");
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Editar Alumno</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
         <h2 className="col-span-2 font-semibold text-blue-600">
          Nombre Del Alumno
        </h2>   
        <input name="nombre" value={form.nombre} onChange={handleChange} className="input"/>
        <h2 className="col-span-2 font-semibold text-blue-600">
          Apellidos
        </h2>
        <input name="apellido" value={form.apellido} onChange={handleChange} className="input"/>
        <h2 className="col-span-2 font-semibold text-blue-600">
          Correo Electronico
        </h2>
        <input name="correo" value={form.correo} onChange={handleChange} className="input"/>
        <h2 className="col-span-2 font-semibold text-blue-600">
          Matricula
        </h2>
        <input name="matricula" value={form.matricula} onChange={handleChange} className="input"/>
        <h2 className="col-span-2 font-semibold text-blue-600">
          Fecha de Nacimiento
        </h2>
        <input
          type="date"
          name="fechaNac"
          value={form.fechaNac?.substring(0, 10)}
          onChange={handleChange}
          className="input"
        />

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg">
          Actualizar
        </button>
      </form>
    </div>
  );
}
