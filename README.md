# IntelliMail: Seu Assistente Inteligente de E-mails

![Logo](frontend/assets/logo.png)

## 🚀 Como Usar a Versão Online

A aplicação está hospedada no plano gratuito do Render, o que significa que o backend (a API) pode levar um tempo para "acordar" após um período de inatividade. Para garantir que tudo funcione corretamente, siga estes passos:

1.  **Inicialize o Backend**: Primeiro, abra o link da API em uma nova aba e aguarde. Você verá uma mensagem simples, como um "Not Found" ou um erro, mas o importante é que esta ação irá iniciar o servidor.
    * **URL do Backend**: [https://intellimail-i2jx.onrender.com](https://intellimail-i2jx.onrender.com)

2.  **Acesse a Aplicação**: Após o backend ter inicializado (geralmente em menos de um minuto), abra o link do frontend para começar a usar o IntelliMail.
    * **URL do Frontend**: [https://intellimail-frontend.onrender.com/dashboard.html](https://intellimail-frontend.onrender.com/dashboard.html)

Se você acessar o frontend e as requisições não funcionarem, apenas aguarde um minuto e tente novamente.

---

## O Que o IntelliMail Faz?

Em um mundo onde a comunicação por e-mail é constante, gerenciar uma caixa de entrada lotada pode ser desgastante. O IntelliMail atua como um filtro inteligente, ajudando você a:

* **Priorizar o que é importante**: A IA analisa e classifica seus e-mails, separando comunicações produtivas de distrações.
* **Responder com mais rapidez**: Receba sugestões de respostas prontas e contextuais, que você pode usar como estão ou adaptar.
* **Visualizar sua produtividade**: Através de um painel de controle, entenda melhor como seu tempo está sendo distribuído nos e-mails.

## ✨ Principais Funcionalidades

* **Classificação Automática**: Cada e-mail processado é categorizado como **Produtivo** (demandas, reuniões, tarefas) ou **Improdutivo** (newsletters, promoções, spam).
* **Sugestões de Resposta Inteligentes**: A IA gera um rascunho de resposta claro e objetivo, economizando seu tempo de digitação.
* **Dashboard de Produtividade**: Um painel visual exibe estatísticas sobre seus e-mails, incluindo a contagem total, a separação entre produtivos e improdutivos, e uma taxa de produtividade geral.
* **Processamento Versátil**: Envie seus e-mails para análise colando o texto diretamente na plataforma ou fazendo o upload de arquivos nos formatos `.txt`, `.pdf` ou até mesmo um arquivo `.zip` contendo múltiplos e-mails.
* **Histórico Completo**: Todos os e-mails processados ficam salvos em um histórico, onde você pode consultar o conteúdo original, a classificação e a sugestão de resposta a qualquer momento.

## 🎨 Personalize a Inteligência Artificial

O grande diferencial do IntelliMail é a capacidade de adaptar a IA ao seu estilo de comunicação. Na tela de **Personalização**, você pode ajustar:

* **Suas Informações**: Preencha seu nome, sobrenome e o nome da sua empresa. A IA usará esses dados para criar respostas que pareçam ter sido escritas por você.
* **Modo de Resposta**: Alterne entre um tom de voz **Pessoal** (em primeira pessoa) ou **Empresarial** (mais formal, representando sua empresa).
* **Instruções para a IA**: Dê diretrizes específicas para a IA! Você pode pedir para que ela sempre inclua uma saudação, finalize com uma frase específica ou adote um tom particular. Use as variáveis `{full_name}` e `{company_name}` para que suas informações sejam inseridas dinamicamente nas respostas.

## 🛠️ Tecnologias Utilizadas

O IntelliMail foi construído com tecnologias modernas para garantir uma experiência rápida e inteligente:

* **Framework Backend**: O cérebro da aplicação é desenvolvido em Python utilizando o framework **Flask**.
* **Inteligência Artificial**: As análises e sugestões são potencializadas pela **API do Google Gemini**, um dos modelos de IA mais avançados do mercado.
