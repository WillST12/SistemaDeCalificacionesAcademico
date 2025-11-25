import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return logout;
}
