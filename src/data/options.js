export const STATUS_OPTIONS = [
  "Agendada",
  "Realizada",
  "Cancelada",
  "Em análise",
];

export const SPECIALTIES = [
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Ginecologia",
  "Neurologia",
  "Oftalmologia",
  "Ortopedia",
  "Pediatria",
  "Psiquiatria",
  "Urologia",
];

export const HEALTH_UNITS = [
  {
    name: "UBS Boa Vista",
    district: "Boa Vista",
    city: "Recife",
    state: "PE",
    phone: "(81) 3333-0101",
  },
  {
    name: "USF Casa Amarela",
    district: "Casa Amarela",
    city: "Recife",
    state: "PE",
    phone: "(81) 3333-0102",
  },
  {
    name: "Policlínica Lessa de Andrade",
    district: "Madalena",
    city: "Recife",
    state: "PE",
    phone: "(81) 3333-0103",
  },
  {
    name: "UPA Imbiribeira",
    district: "Imbiribeira",
    city: "Recife",
    state: "PE",
    phone: "(81) 3333-0104",
  },
  {
    name: "Hospital da Mulher do Recife",
    district: "Curado",
    city: "Recife",
    state: "PE",
    phone: "(81) 3333-0105",
  },
];

export const HEALTH_UNIT_OPTIONS = HEALTH_UNITS.map((unit) => unit.name);
