import { useState } from "react";
import { cadastrar } from "../services/authService";
import { Link } from "react-router-dom";

export default function Cadastro() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function salvar(e) {

    e.preventDefault();

    try {

      await cadastrar(
        email,
        senha
      );

      alert(
        "Usuário criado com sucesso!"
      );

    } catch (erro) {

      alert(erro.message);

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
          Crie sua conta para acessar
          o sistema de agendamento
          inteligente do SUS.
        </p>

      </div>

      <div className="login-right">

        <h2>Criar Conta</h2>

        <form onSubmit={salvar}>

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
            Criar Conta
          </button>

        </form>

        <div className="link-area">

          Já possui conta?{" "}

          <Link to="/">
            Entrar
          </Link>

        </div>

      </div>

    </div>

  </div>
);

}