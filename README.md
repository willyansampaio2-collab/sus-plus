# SUS+

Aplicação React + Vite para agendamento e acompanhamento de consultas do SUS, com Firebase Authentication e Firestore.

## Funcionalidades

- Login e cadastro com mensagens amigáveis de erro.
- Rotas protegidas para páginas internas.
- Dashboard com indicadores de consultas.
- Agendamento com busca automática de endereço via ViaCEP.
- CRUD completo de consultas no Firestore por usuário autenticado.
- Filtros em Minhas Consultas e Relatórios.
- Páginas de Pacientes, Especialidades, Unidades de Saúde, Perfil e Relatórios.
- Layout responsivo com sidebar, navbar, cards, tabelas e modais.

## Comandos

```bash
npm install
npm run dev
npm run build
```

No Windows com PowerShell restrito, use:

```bash
npm.cmd run dev
npm.cmd run build
```

## Variáveis de ambiente

Crie um arquivo `.env` com as credenciais do Firebase:

```env
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_SENDER_ID=
VITE_APP_ID=
```

O Firestore deve estar habilitado no projeto Firebase.

## Regras do Firestore

As consultas são gravadas na coleção `consultas`, sempre com o campo `userId` preenchido com o UID do usuário logado. As regras compatíveis estão em `firestore.rules`:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function ownsExistingAppointment() {
      return signedIn() && resource.data.userId == request.auth.uid;
    }

    function ownsSubmittedAppointment() {
      return signedIn() && request.resource.data.userId == request.auth.uid;
    }

    function hasRequiredAppointmentFields(data) {
      return data.keys().hasAll([
        'userId',
        'nomePaciente',
        'cpf',
        'telefone',
        'especialidade',
        'unidade',
        'dataConsulta',
        'horario',
        'status',
        'createdAt'
      ]);
    }

    match /consultas/{consultaId} {
      allow create: if ownsSubmittedAppointment()
        && hasRequiredAppointmentFields(request.resource.data);

      allow read, delete: if ownsExistingAppointment();

      allow update: if ownsExistingAppointment()
        && ownsSubmittedAppointment()
        && hasRequiredAppointmentFields(request.resource.data);
    }
  }
}
```

Para publicar essas regras pelo Firebase CLI, use:

```bash
firebase deploy --only firestore:rules
```

## Migração de consultas antigas

Se existirem documentos em `consultas` sem `userId`, execute a migração antes de publicar regras restritivas, ou use regras temporárias de manutenção que permitam ler esses documentos.

No PowerShell:

```bash
$env:MIGRATION_EMAIL="usuario@exemplo.com"
$env:MIGRATION_PASSWORD="senha"
$env:MIGRATION_USER_ID="uid-do-usuario-dono-das-consultas"
npm.cmd run migrate:consultas-userid
```

Por padrão o script roda em modo simulação. Para aplicar:

```bash
$env:MIGRATION_DRY_RUN="false"
npm.cmd run migrate:consultas-userid
```
