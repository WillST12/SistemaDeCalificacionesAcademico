import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import materiaService from "../../../services/materiaService";
import profesorService from "../../../services/profesorService";
import profesorMateriaService from "../../../services/profesorMateriaService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarClase(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [form, setForm] = useState({ idProfesorMateria: "", periodo: "", activo: true });

  useEffect(()=>{
    materiaService.listar().then(res=>setMaterias(res.data));
    profesorService.listar().then(res=>setProfesores(res.data));
    ClaseService.obtener(id).then(res=>{
      // si tu API devuelve objeto con IdClase, Periodo, Profesor, Materia -> adapta:
      const data = res.data;
      // Necesitamos el IdProfesorMateria: si tu API no lo devuelve, tendrás que añadirlo en backend GetClases por Id.
      setForm({
        idProfesorMateria: data.idProfesorMateria ?? data.IdProfesorMateria ?? "",
        periodo: data.periodo ?? data.Periodo ?? "",
        activo: data.activo ?? data.Activo ?? true
      });
    }).catch(()=>{});
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Si el admin cambió profesor o materia: crear / obtener idProfesorMateria
      let idProfesorMateria = form.idProfesorMateria;
      if (form.idMateria && form.idProfesor) {
        const pmRes = await profesorMateriaService.asignar({
          idProfesor: Number(form.idProfesor),
          idMateria: Number(form.idMateria)
        });
        idProfesorMateria = pmRes.data.idProfesorMateria ?? pmRes.data;
      }

      await ClaseService.actualizar(id, {
        idProfesorMateria,
        periodo: form.periodo,
        activo: form.activo
      });

      alert("Clase actualizada");
      navigate("/admin/clases");
    } catch (err) {
      console.error(err);
      alert("Error actualizando clase");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Editar Clase</h1>

      <form className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* similar a CrearClase, con selects */}
        <input name="periodo" value={form.periodo} onChange={handleChange} className="input" />
        <label className="col-span-2">
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo
        </label>

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg">Actualizar</button>
      </form>
    </div>
  );
}
