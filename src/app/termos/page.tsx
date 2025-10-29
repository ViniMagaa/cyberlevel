import { BackButton } from "@/components/back-button";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const termsMarkdown = `
# Termos e Condições - CyberLevel

Bem-vindo ao **CyberLevel**!  
Ao utilizar nossa plataforma, você concorda com os termos descritos abaixo.  
Por favor, leia atentamente antes de prosseguir.

---

## 1. Uso da Plataforma
- A plataforma é destinada a **crianças, adolescentes e responsáveis**.
- O uso deve respeitar os **limites de idade** e a supervisão dos responsáveis.
- Qualquer uso indevido poderá resultar na suspensão ou exclusão da conta.

---

## 2. Responsabilidade dos Usuários
- O usuário deve fornecer informações verdadeiras no cadastro.
- Pais e responsáveis concordam em acompanhar o progresso e orientar seus filhos.
- É proibido compartilhar contas ou senhas.

---

## 3. Conteúdo Educativo
- O CyberLevel oferece atividades, artigos e recursos com objetivo **educacional**.
- Não garantimos que o conteúdo substitua orientação profissional ou educacional formal.

---

## 4. Privacidade e Segurança
- Coletamos apenas os dados necessários para funcionamento da plataforma.
- Informações pessoais não serão compartilhadas com terceiros sem autorização.

---

## 5. Alterações nos Termos
- Estes termos podem ser atualizados periodicamente.
- Notificaremos os usuários sobre mudanças significativas.

---

## 6. Aceite
O uso contínuo da plataforma após alterações será considerado como **aceitação automática** dos novos termos.

---

Se tiver dúvidas, entre em contato com nossa equipe de suporte.
`;

export default function TermsAndConditionsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert mx-auto max-w-5xl px-4 py-16">
      <BackButton className="absolute top-4 left-1 sm:hidden" />

      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {termsMarkdown}
      </Markdown>
    </div>
  );
}
