# Karoline Garcia Fotografia 📸

Bem-vindo ao repositório do site oficial de **Karoline Garcia Fotografia**. 
Este projeto é um portfólio dinâmico, elegante e moderno desenvolvido para exibir fotografia social e pet com a mais alta qualidade, focado em minimalismo e excelente experiência do usuário.

O grande diferencial deste projeto é possuir um **Painel de Administração Integrado**, que permite a atualização total do site (textos, galerias e fotos de layout) sem a necessidade de mexer no código.

---

## 🛠 Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework React (App Router).
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização baseada em classes utilitárias para um design responsivo perfeito.
- **[Framer Motion](https://www.framer.com/motion/)**: Animações suaves e transições de página (micro-interações).
- **[Supabase](https://supabase.com/)**: Banco de dados PostgreSQL e Storage (armazenamento das fotos). Funciona como o backend completo da aplicação.

---

## ⚙️ Funções do Painel de Administração (`/admin`)

O painel é acessado através da rota `seu-site.com.br/admin`. Ele é protegido por login (autenticação do Supabase) e se divide em 3 sessões principais:

### 1. 🖼️ Fotos Soltas & Galeria
Gerencie fotos que aparecem na grade geral (estilo alvenaria/masonry) da aba de portfólios.
- **Upload em Massa:** Selecione várias fotos de uma vez (Exemplo: Enviar 20 fotos de um casamento diretamente para a aba "Fotografia Social").
- **Exclusão:** Apague fotos individuais ou use a seleção em massa para remover diversas fotos de uma vez só.

### 2. 📚 Gerenciar Ensaios (Álbuns)
Crie páginas exclusivas para um evento ou cliente específico.
- **Criar Ensaio:** Adicione uma Foto de Capa, Título e Categoria (Social ou Pet). O sistema criará automaticamente uma página de ensaio para esse evento.
- **Vincular Fotos:** Na aba "Fotos Soltas", ao fazer upload de novas imagens, você pode escolher **"Vincular a um Ensaio"**. Com isso, as fotos não ficarão jogadas na galeria principal, mas sim organizadas dentro da página específica daquele evento (Exemplo: "Casamento Ana e João").
- **Exclusão:** Apagar um ensaio exclui a capa e **todas** as fotos vinculadas a ele automaticamente.

### 3. 🎨 Personalização do Site (CMS)
Chega de depender de programador para trocar as imagens estáticas do site!
- **Alteração Visual:** O site possui espaços reservados para fotos ilustrativas (ex: Foto de Fundo da Home, Foto da página Sobre Mim, Foto da página de Contato).
- **Como usar:** No painel, você verá a foto que está atualmente no site. Basta **clicar sobre ela** e enviar uma nova imagem. A alteração é refletida no site na mesma hora para todos os visitantes.

---

## 🚀 Como Hospedar (Deploy na HostGator)

O site foi arquitetado para ser **100% estático**. Isso significa que ele não precisa de um servidor Node.js rodando (como o Render ou Vercel). O navegador do próprio cliente faz o trabalho de buscar os dados no Supabase.

Para atualizar o site na HostGator (ou qualquer servidor cPanel):

1. **Abra o terminal na pasta do projeto e instale as dependências** (caso seja a primeira vez):
   ```bash
   npm install
   ```

2. **Gere os arquivos estáticos**:
   ```bash
   npm run build
   ```
   > Esse comando irá criar uma pasta chamada `out` no seu projeto. O Next.js automaticamente criará todas as rotas com `index.html` (graças à configuração `trailingSlash: true`).

3. **Faça o Upload**:
   - Abra o Gerenciador de Arquivos do seu cPanel na HostGator.
   - Entre na pasta `public_html` (ou na pasta raiz do seu domínio).
   - Envie **todos** os arquivos e pastas que estão **dentro** da pasta `out` (gerada no passo 2) para a sua HostGator.

Pronto! Seu site e o painel de administração estarão online, ultrarrápidos e seguros!

---

## 💻 Comandos de Desenvolvimento

Caso queira rodar o site no seu computador para testar alterações no código:

```bash
# Rode o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.
