import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";
import { getAuthErrorMessage, login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";
  const authMessage = location.state?.authMessage;

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await login(email, senha);
      navigate(redirectTo, { replace: true });
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
          <p>Sistema profissional para agendamento e acompanhamento de consultas do SUS.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <span>Bem-vindo</span>
            <h1>Entrar no SUS+</h1>
            <p>Acesse sua agenda, relatórios e consultas cadastradas.</p>
          </div>

          {authMessage ? <div className="alert alert--success">{authMessage}</div> : null}
          {erro ? <div className="alert alert--error">{erro}</div> : null}

          <form className="auth-form" onSubmit={entrar}>
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
              placeholder="Digite sua senha"
            />

            <Button type="submit" fullWidth disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="auth-link">
            Não possui conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
