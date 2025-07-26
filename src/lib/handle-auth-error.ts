export function handleAuthError(code: string) {
  switch (code) {
    case "invalid_credentials":
      return "E-mail ou senha inválidos";
    case "email_not_confirmed":
      return "Confirme seu e-mail antes de continuar";
    case "user_not_found":
      return "Usuário não encontrado";
    default:
      return "Erro desconhecido ao autenticar";
  }
}
