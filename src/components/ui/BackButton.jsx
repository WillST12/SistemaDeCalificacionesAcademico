import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-lg"
    >
      ⬅ Volver
    </button>
  );
}
