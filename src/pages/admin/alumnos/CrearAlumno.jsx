import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../services/axiosConfig";


export default function EditarAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/alumnos/${id}`).then((res) => setForm(res.data));
  }, [id]);

  if (!form) return <p>Cargando...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.put(`/alumnos/${id}`, form);
    navigate("/admin/alumnos");
  };

  return (
    <div>
      <h1>Editar Alumno</h1>
      <form onSubmit={submit} className="card p-4">
        <div className="mb-3">
          <label>Nombre</label>
          <input
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Apellido</label>
          <input
            name="apellido"
            className="form-control"
            value={form.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Fecha Nacimiento</label>
          <input
            type="date"
            name="fechaNac"
            className="form-control"
            value={form.fechaNac?.split("T")[0]}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Matrícula</label>
          <input
            name="matricula"
            className="form-control"
            value={form.matricula}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            className="form-control"
            value={form.correo}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">Actualizar</button>
      </form>
    </div>
  );
}
