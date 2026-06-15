import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function entrar(e) {

    e.preventDefault();

    try {

      const usuario = await login(
        email,
        senha
      );

      navigate("/dashboard");

    } catch (erro) {

      alert(
        "Usuário ou senha inválidos"
      );

      console.error(erro);

    }

  }

  return (
  <div className="hero-bg">

    <div className="login-card">

      <div className="login-left">

        <h1>
          SUS<span>+</span>
        </h1>

        <p>
          Sistema inteligente para
          agendamento de consultas
          especializadas no SUS.
        </p>

      </div>

      <div className="login-right">

        <h2>Entrar</h2>

        <form onSubmit={entrar}>

          <div className="input-group">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
            />
          </div>

          <button
            className="btn-primary"
          >
            Entrar
          </button>

        </form>

        <div className="link-area">

          Não possui conta?{" "}

          <Link to="/cadastro">
            Cadastre-se
          </Link>

        </div>

      </div>

    </div>

  </div>
);


}