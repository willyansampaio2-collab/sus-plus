import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";
import { cadastrar, getAuthErrorMessage } from "../services/authService";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await cadastrar(email, senha);
      navigate("/dashboard", { replace: true });
    } catch (erro) {
      setErro(getAuthErrorMessage(erro));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-panel__brand">
          <strong>SUS<span>+</span></strong>
          <p>Crie sua conta para organizar consultas, pacientes e relatórios em um só lugar.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <span>Nova conta</span>
            <h1>Criar acesso</h1>
            <p>Use um e-mail válido e uma senha com pelo menos 6 caracteres.</p>
          </div>

          {erro ? <div className="alert alert--error">{erro}</div> : null}

          <form className="auth-form" onSubmit={salvar}>
            <Input
              label="E-mail"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
            />
            <Input
              label="Senha"
              type="password"
              name="senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
            />

            <Button type="submit" fullWidth disabled={carregando}>
              {carregando ? "Criando..." : "Criar conta"}
            </Button>
          </form>

          <p className="auth-link">
            Já possui conta? <Link to="/">Entrar</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
