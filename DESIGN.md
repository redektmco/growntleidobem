# Design · LP Lei do Bem

Herdado de grownt.tech. Esta LP não cria identidade nova.

## Cores
- Laranja marca `#F15F38` (destaques, ícones, fundo texturizado do hero `assets/hero-bg.webp`)
- Laranja botão `#D24426`, hover `#BF3A1F` (texto branco ≥ 4,5:1)
- Laranja texto `#B83A1D` (links e ícones sobre fundo claro)
- Lavado laranja `#FCE7E0` (caixas de ícone)
- Marinho `#1A2437` (texto principal, bloco de prova, seletor ativo)
- Fundo `#F2F1F0`, cartões `#FFFFFF`, campos `#F7F6F5`, linhas `#E2E0DD`
- Texto secundário `#56616E`; azul acinzentado `#B8C9D3` e `#AEBDC7` sobre marinho

## Tipografia
- Títulos: Bricolage Grotesque 800, tracking negativo (-0,025 a -0,028em), entrelinha 1,0–1,08, com ponto final como no site
- Texto: DM Sans 500, 17px, entrelinha 1,6; rótulos e botões DM Sans 700

## Forma
- Placas (hero, prova, fechamento): raio 40px (28px no celular)
- Cartões: raio 28px; FAQ 20px; campos 14px; botões e seletor em pill
- Raios concêntricos: imagem dentro do painel = raio do painel − padding
- Sombras neutras (marinho em baixa opacidade), nunca coloridas
- Grade de 4px

## Componentes
- Nav flutuante em pill, translúcida, com um CTA
- Formulário de 5 campos + telefone opcional, erros inline, aviso quando o regime não é Lucro Real
- Seletor segmentado "Sou de PD&I / Sou do Fiscal ou Financeiro" (assinatura da página)
- Passos numerados ligados por linha (a ordem carrega informação)
- Cases em colunas separadas por linhas finas, sem cartões
- Anel da marca (círculo aberto com dois pontos) desenhado uma vez na seção de prova

## Movimento
- Uma curva `cubic-bezier(0.16, 1, 0.3, 1)`; seletor `cubic-bezier(0.32, 0.72, 0, 1)` sem overshoot
- Uma entrada no carregamento (hero), troca de painel com fade curto, anel desenhado ao entrar
- `prefers-reduced-motion` desliga tudo
