# Dueños de Fábrica Industrial · Recursos

Site estático de recursos operacionais para **Capital Humano Industrial** (Grupo Morte). Biblioteca interactiva com vídeos YouTube, estantería 3D, catálogo de recursos e formulário de acesso à pasta Google Drive.

---

## Visão geral

| Item | Detalhe |
|------|---------|
| **Marca** | Dueños de Fábrica Industrial (DFI) |
| **Editora** | Capital Humano Industrial |
| **Tipo** | Site estático (HTML + CSS + JavaScript) |
| **Idiomas** | Espanhol (ES), Português (PT), Inglês (EN) |
| **Recursos** | 6 ferramentas operacionais para donos de fábrica PYME |
| **Tema visual** | Escuro + verde (`#22c55e`) |
| **Formulário** | YouFunnelCloud (opt-in Google Drive) |

---

## Estrutura do projeto

```
Web:Estágio/
├── index.html          # Página principal (HTML semântico)
├── css/
│   └── style.css       # Estilos, tema, componentes e responsivo
├── js/
│   ├── app.js          # Lógica: estantería, catálogo, theater, i18n, YouTube
│   └── i18n.js         # Traduções ES / PT / EN
└── README.md
```

---

## Secções do site

| Secção | ID / classe | Função |
|--------|-------------|--------|
| **Barra superior** | `.siteTopbar` | Marca fixa (3,5 cm) + seletor PT / ES / EN |
| **Hero** | `.welcome` | Texto introdutório, CTA Google Drive, vídeo de apresentação |
| **Estantería** | `.shelfSection` | Lombadas interactivas (6 “livros”) |
| **Theater** | `#shelfTheater` | Carrossel 3D: vídeo central + cartas laterais |
| **Catálogo** | `.catalogSection` | Grid de fichas com thumbnail e descrição |
| **Âncora** | `.siteAnchor` | Frase “CONTROLA O PIERDE.” |
| **Rodapé** | `.footerMorte` | Marca, links legais, copyright |
| **Modal formulário** | `#enrForm` | Opt-in YouFunnelCloud para pasta Drive |

---

## Fluxo do utilizador

```
Entrada no site
    │
    ├─► Barra: escolhe idioma (PT / ES / EN)
    │
    ├─► Hero: vê vídeo intro + clica "Acceder a Google Drive"
    │         └─► Abre modal com formulário
    │
    ├─► Estantería: clica num livro (lombada)
    │         └─► Abre Theater (carrossel 3D)
    │               ├─► Vídeo YouTube no centro
    │               ├─► Arrastar rato / ← → para mudar recurso
    │               └─► Ao terminar: "Ver el próximo vídeo"
    │
    └─► Catálogo: fichas detalhadas + botão "Acceder a los recursos"
```

---

## Recursos (6 volumes)

| # | Categoria | Vídeo YouTube | Estado |
|---|-----------|---------------|--------|
| **01** | Diagnóstico · 7 escenas | [FrVlDjusLXw](https://youtu.be/FrVlDjusLXw) | ✅ Ativo (destaque) |
| **02** | Valoración · Descuento | [W4ntQNEdYaA](https://www.youtube.com/watch?v=W4ntQNEdYaA) | ✅ Ativo |
| **03** | Sucesión · Sucesor | [XnRkrTyPNWg](https://www.youtube.com/watch?v=XnRkrTyPNWg) | ✅ Ativo |
| **04** | Operaciones · 16 problemas | [J81m52BdSh8](https://www.youtube.com/watch?v=J81m52BdSh8) | ✅ Ativo |
| **05** | Sistemas · 9 sistemas | — | ⏳ Sem vídeo |
| **06** | Mercado · SAP | [7MqaiZakijI](https://www.youtube.com/watch?v=7MqaiZakijI) | ✅ Ativo |

> Os textos (título, resumo, módulo) estão traduzidos em `js/i18n.js`. Os IDs de vídeo e URLs estão em `js/app.js` → `VOL_BASE`.

---

## Funcionalidades principais

| Funcionalidade | Ficheiro | Descrição |
|----------------|----------|-----------|
| **Multilíngue** | `i18n.js` + `app.js` | Troca ES/PT/EN; preferência guardada em `localStorage` (`dfi-lang`) |
| **Estantería 3D** | `app.js` + `style.css` | Lombadas com hover; clique abre theater |
| **Carrossel theater** | `app.js` | Carta central com player; anteriores à esquerda, próximos à direita |
| **Drag & teclado** | `app.js` | Arrastar com rato ou setas ← → para navegar |
| **Fim de vídeo** | YouTube IFrame API | Overlay “Ver el próximo vídeo” |
| **Vídeo intro** | `index.html` | YouTube com poster; overlay verde para activar som |
| **Catálogo** | `app.js` | Card 01 destacado; cards 02–06 estilo profissional |
| **Formulário** | `index.html` | Modal `#enrForm` via `data-openform` |

---

## Internacionalização (i18n)

| Atributo HTML | Uso |
|---------------|-----|
| `data-i18n="chave"` | Texto simples |
| `data-i18n-html="chave"` | HTML com `<span class="serif">` |
| `data-i18n-aria="chave"` | `aria-label` acessível |

| Idioma | Código | `lang` no `<html>` |
|--------|--------|---------------------|
| Espanhol | `es` | `es` (predefinido) |
| Português | `pt` | `pt` |
| Inglês | `en` | `en` |

Para adicionar ou editar textos: abrir `js/i18n.js` e alterar o objecto do idioma correspondente.

---

## Dependências externas

| Serviço | URL / origem | Uso |
|---------|--------------|-----|
| **Google Fonts** | Archivo, JetBrains Mono, Instrument Serif | Tipografia |
| **YouTube IFrame API** | `youtube.com/iframe_api` | Player nos recursos |
| **YouFunnelCloud** | `links.youfunnelcloud.com` | Formulário opt-in |
| **Legal Grupo Morte** | `legal.grupomorte.cloud` | Políticas no rodapé |
| **Thumbnails YouTube** | `img.youtube.com/vi/{id}/...` | Capas dos vídeos |

---

## Como executar localmente

Não é necessário build nem npm. Servir a pasta do projecto com qualquer servidor estático:

```bash
# Python 3
python3 -m http.server 8080

# ou Node (npx)
npx serve .
```

Abrir no browser: `http://localhost:8080`

> Abrir `index.html` directamente (`file://`) pode bloquear algumas APIs; preferir servidor local.

---

## Edição rápida

| O que alterar | Onde |
|---------------|------|
| Textos estáticos / traduções | `js/i18n.js` |
| Vídeos (ID YouTube, thumb, URLs) | `js/app.js` → `VOL_BASE` |
| Cores e layout | `css/style.css` (variáveis `--accent`, `--bg`, etc.) |
| Estrutura HTML | `index.html` |
| Formulário (iframe) | `index.html` → `#enrForm` |
| Vídeo de introdução | `index.html` → `#introVideo` / `#vslPoster` |

### Exemplo: adicionar vídeo ao recurso 05

Em `js/app.js`, no objecto `VOL_BASE` do recurso `n:"05"`:

```javascript
{
  n: "05",
  thumb: "https://img.youtube.com/vi/SEU_ID/maxresdefault.jpg",
  h: 256,
  youtubeId: "SEU_ID",
  videoUrl: "https://www.youtube.com/watch?v=SEU_ID",
  resourceUrl: "",
  resourceLabel: ""
}
```

---

## Design system (CSS)

| Variável | Valor | Uso |
|----------|-------|-----|
| `--accent` | `#22c55e` | Verde principal |
| `--accent-soft` | `#4ade80` | Destaques |
| `--bg` | `#060608` | Fundo |
| `--topbar-h` | `3.5cm` | Altura da barra superior |
| `--maxw` | `1140px` | Largura máxima do conteúdo |
| `--f-display` | Archivo | Títulos e UI |
| `--f-mono` | JetBrains Mono | Labels, pills |
| `--f-serif` | Instrument Serif | Itálico de marca |

---

## Créditos

| | |
|---|---|
| **Projeto** | Alejandro Morte / Capital Humano Industrial |
| **Marca** | Dueños de Fábrica Industrial |
| **Copyright** | © 2026 Capital Humano Industrial |

