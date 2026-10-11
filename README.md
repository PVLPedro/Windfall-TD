# Windfall-TD
Repositório do Windfall TD, um jogo de Tower Defense desenvolvido como projeto pessoal. O objetivo: aplicar conceitos de JavaScript utilizando o framework/engine Phaser.

# Como jogar as versões Alphas (temporário)

## Node.js

1. Instale o Node.js v24 em [Página de Download do Node.js](https://nodejs.org/pt-br/download).
- Selecione a versão v24.21.0 LTS, baixe e execute o arquivo .msi e siga os passos padrões para concluir a instalação.
- Para verificar a instalação, ao finalizar, abra o Windows PowerShell ou o Shell de seu sistema operacional e execute o comando:
- `node -version`. Instalação bem sucedida caso retorne "v24.21.0" ou algo semelhante.
- `npm -version`. Instalação bem sucedida caso retorne "11.19.0" ou algo semelhante.

## Repositório

2. Opção 1: Instale o Git [Página de Download do Git](https://git-scm.com/install/windows).
- Selecione a opção para o seu sistema operacional, como por exemplo (Git for Windows/x64 Setup), baixe e execute o arquivo .exe.
- Para verificar a instalação, crie uma pasta em algum diretório de sua máquina. Então clique com o botão direito do mouse e selecione "Mostrar mais opções" (ou "Show more options). Se aparecer a opção "Open Git Bash here", a instalação foi bem sucedida.
- Abra o Git Bash (usando o processo da etapa anteorior).
- No terminal aberto, execute o comando (para colar comandos copiados no terminal do Git Bash, use o atalho "Shift + Insert"):
- `git clone https://github.com/PVLPedro/Windfall-TD.git`.

3. Opção 2: Baixe o .zip do projeto.
- Na tela inicial do repositório "Code", na opção "Code" ao lado de "About", selecione "Download ZIP".
- Descompacte o arquivo na opção "Extrair tudo..." (ou "Extract all...").
- Navegue até a pasta do repositório (como Windfall-TD-main ou Windfall-TD).

## Instale as dependências

4. Dentro da pasta do repositório (Windfall-TD):
- Abra o Terminal clicando com o botão direito do mouse e selecionando a opção "Abrir no Terminal" (ou "Open in Terminal).
- Para instalar as dependências do projeto (Node.js), execute o comando: `npm install`. Caso apareça um erro em vermelho mencionando Execution Policy, feche o Terminal e avance para a etapa 5.
- Caso o terminal aponte que há problemas de vulnerabilidade alta, execute o comando: `npm audit fix`.
- Caso o terminal indique que há mais scripts requeridos, execute o comando `npm install-scripts approve --all`
- Com tudo feito, avance para a etapa 6.

5. Caso apareça um erro em vermelho mencionando Execution Policy:
- Abra o Windows PowerShell e execute o comando: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
- Para testar, feche o Shell e volte para a etapa 4.

## Rodando o projeto

6. No mesmo Terminal aberto para instalar as dependências, ou num novo aberto na mesma pasta:
- Execute o comando `nom run dev`.
- Após isso, abra o link localhost indicado pelo Terminal.
- Não feche o Terminal enquanto estiver testando o jogo.
- Envie seu feedback sobre o jogo para pvlprofissional@gmail.com. Sua experiência e opinião ajudam a tornar o jogo melhor.
