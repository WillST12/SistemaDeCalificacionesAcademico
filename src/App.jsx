import { useEffect } from "react";
import { api } from "./services/axiosConfig";

function App() {
  useEffect(() => {
    api.get("/auth/test")  
      .then(res => console.log("API OK 👉", res.data))
      .catch(err => console.error("API ERROR ", err));
  }, []);

  return <h1>Probando conexión con la API...</h1>;
}

export default App;
