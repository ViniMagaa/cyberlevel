export function handleAuthError(code: string) {
  switch (code) {
    case "invalid_credentials":
      return "Credenciais inválidas";
    case "email_not_confirmed":
      return "Confirme seu e-mail antes de continuar";
    case "user_not_found":
      return "Usuário não encontrado";
    case "same_password":
      return "A nova senha deve ser diferente da senha anterior";
    case "user_already_exists":
      return "O e-mail já está cadastrado";
    case "email_address_invalid":
      return "E-mail inválido";
    default:
      return "Erro desconhecido";
  }
}
