import { useState } from "react";

import { HEALTH_UNIT_OPTIONS, SPECIALTIES, STATUS_OPTIONS } from "../../data/options";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";

const emptyAppointment = {
  nomePaciente: "",
  cpf: "",
  dataNascimento: "",
  telefone: "",
  especialidade: "",
  unidade: "",
  cep: "",
  rua: "",
  bairro: "",
  cidade: "",
  estado: "",
  dataConsulta: "",
  horario: "",
  observacoes: "",
  status: "Agendada",
};

const requiredFields = {
  nomePaciente: "Informe o nome do paciente.",
  cpf: "Informe o CPF.",
  dataNascimento: "Informe a data de nascimento.",
  telefone: "Informe o telefone.",
  especialidade: "Selecione a especialidade.",
  unidade: "Selecione a unidade de saúde.",
  cep: "Informe o CEP.",
  rua: "Informe a rua.",
  bairro: "Informe o bairro.",
  cidade: "Informe a cidade.",
  estado: "Informe o estado.",
  dataConsulta: "Informe a data da consulta.",
  horario: "Informe o horário.",
  status: "Selecione o status.",
};

export default function AppointmentForm({
  initialValues = {},
  submitLabel = "Salvar consulta",
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    ...emptyAppointment,
    ...initialValues,
    unidade: initialValues.unidade || initialValues.unidadeSaude || "",
  });
  const [errors, setErrors] = useState({});
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [cepErrorBlocksSubmit, setCepErrorBlocksSubmit] = useState(false);

  const updateField = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const clearAddress = () => {
    setFormData((current) => ({
      ...current,
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));
  };

  const buscarCep = async (cep) => {
    setCepLoading(true);
    setCepError("");
    setCepErrorBlocksSubmit(false);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        clearAddress();
        setCepError("CEP não encontrado.");
        setCepErrorBlocksSubmit(true);
        return;
      }

      setFormData((current) => ({
        ...current,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch {
      clearAddress();
      setCepError("Não foi possível buscar o CEP. Preencha o endereço manualmente.");
      setCepErrorBlocksSubmit(false);
    } finally {
      setCepLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "cep") {
      const digits = value.replace(/\D/g, "").slice(0, 8);
      updateField(name, digits);
      setCepError("");
      setCepErrorBlocksSubmit(false);

      if (digits.length === 8) {
        buscarCep(digits);
      }

      return;
    }

    updateField(name, value);
  };

  const validate = () => {
    const nextErrors = Object.entries(requiredFields).reduce((accumulator, [field, message]) => {
      if (!String(formData[field] || "").trim()) {
        accumulator[field] = message;
      }

      return accumulator;
    }, {});

    if (formData.cep && formData.cep.length !== 8) {
      nextErrors.cep = "Informe um CEP com 8 números.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0 && !cepErrorBlocksSubmit;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      ...formData,
      cpf: formData.cpf.trim(),
      nomePaciente: formData.nomePaciente.trim(),
    });
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Dados do paciente</h3>
        <div className="form-grid">
          <Input
            label="Nome do paciente"
            name="nomePaciente"
            value={formData.nomePaciente}
            onChange={handleChange}
            error={errors.nomePaciente}
          />
          <Input
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            error={errors.cpf}
          />
          <Input
            label="Data de nascimento"
            name="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={handleChange}
            error={errors.dataNascimento}
          />
          <Input
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            error={errors.telefone}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Consulta</h3>
        <div className="form-grid">
          <Select
            label="Especialidade"
            name="especialidade"
            value={formData.especialidade}
            onChange={handleChange}
            options={SPECIALTIES}
            placeholder="Selecione"
            error={errors.especialidade}
          />
          <Select
            label="Unidade de saúde"
            name="unidade"
            value={formData.unidade}
            onChange={handleChange}
            options={HEALTH_UNIT_OPTIONS}
            placeholder="Selecione"
            error={errors.unidade}
          />
          <Input
            label="Data da consulta"
            name="dataConsulta"
            type="date"
            value={formData.dataConsulta}
            onChange={handleChange}
            error={errors.dataConsulta}
          />
          <Input
            label="Horário"
            name="horario"
            type="time"
            value={formData.horario}
            onChange={handleChange}
            error={errors.horario}
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            error={errors.status}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Endereço</h3>
        <div className="form-grid">
          <Input
            label="CEP"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            error={errors.cep || (cepErrorBlocksSubmit ? cepError : "")}
            maxLength={8}
          />
          <Input
            label="Rua"
            name="rua"
            value={formData.rua}
            onChange={handleChange}
            error={errors.rua}
          />
          <Input
            label="Bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            error={errors.bairro}
          />
          <Input
            label="Cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            error={errors.cidade}
          />
          <Input
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            error={errors.estado}
            maxLength={2}
          />
        </div>
        {cepLoading ? <p className="helper-text">Buscando endereço pelo CEP...</p> : null}
        {cepError && !cepErrorBlocksSubmit ? <p className="helper-text">{cepError}</p> : null}
      </div>

      <Input
        label="Observações"
        name="observacoes"
        value={formData.observacoes}
        onChange={handleChange}
        multiline
        rows={4}
      />

      <div className="form-actions">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting || cepLoading}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
