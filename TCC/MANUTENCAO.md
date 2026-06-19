# 🚀 Manual de Manutenção - StudyPro

## 📌 Estrutura Implementada

```
TCC/
├── scripts/
│   └── site-common.js          [Auto-injeta header/footer/tradutor]
├── css/
│   └── site-common.css         [Estilos globais]
├── index.html                  [Homepage]
├── comLogin.html               [Com login alternativo]
├── sala-trofeusVitor.html      [Sala de troféus]
├── html/
│   ├── *.html                  [+10 páginas internas]
│   └── [Todas incluem site-common.js]
├── questoes/
│   ├── *.html                  [+5 páginas de questões]
│   └── [Todas incluem site-common.js]
├── videos/
│   ├── *.html                  [2 páginas de vídeos]
│   └── [Todas incluem site-common.js]
└── IA/
    └── *.html                  [Páginas de IA]
```

---

## 🔧 Como Funciona

### Arquivo Principal: `scripts/site-common.js`

**Responsabilidades:**
1. ✅ Injeta `<header class="site-header">` no topo
2. ✅ Injeta `<footer class="site-footer">` no rodapé
3. ✅ Remove headers/footers duplicados
4. ✅ Gerencia seletor de idioma (localStorage)
5. ✅ Sincroniza i18next entre páginas

**Execução Automática:**
- Roda ao final de cada página via `<script src="...site-common.js"></script>`
- Se já foi aplicado, retorna silenciosamente (flag: `window.__siteCommonApplied`)

---

## 🎨 Customização

### Editar Header

**Arquivo:** `scripts/site-common.js`
**Função:** `injectHeader()`

```javascript
function injectHeader() {
  // Encontre o innerHTML e edite conforme necessário
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <!-- EDITE AQUI -->
    <div class="site-header-content">
      ...
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);
}
```

### Editar Footer

**Arquivo:** `scripts/site-common.js`
**Função:** `injectFooter()`

```javascript
function injectFooter() {
  // Edite o innerHTML conforme necessário
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <!-- EDITE AQUI -->
    <div class="site-footer-content">
      ...
    </div>
  `;
  document.body.appendChild(footer);
}
```

### Editar Estilos

**Arquivo:** `css/site-common.css`

Encontre o seletor e edite:
```css
.site-header {
  /* Edite background-color, font-size, etc */
}

.site-nav {
  /* Edite estilo da navegação */
}
```

---

## 🌐 Adicionar Novos Idiomas

### Passo 1: Editar cada página individualmente

Por exemplo, em `html/desempenho.html`:

```javascript
i18next.init({
  lng: localStorage.getItem('i18nextLng') || 'pt',
  resources: {
    pt: { translation: { /*...*/ } },
    en: { translation: { /*...*/ } },
    es: { translation: { /*...*/ } },
    // ADICIONE AQUI:
    fr: { translation: {
      'questionario': 'Questionnaire',
      'voltar': 'Retour',
      // ... mais traduções
    }}
  }
});
```

### Passo 2: Adicionar botão no seletor

**Arquivo:** `scripts/site-common.js`
**Função:** `injectHeader()`

Encontre:
```html
<ul class="site-lang-menu" id="site-lang-menu">
  <li><button class="site-lang-option" data-lang="pt">🇧🇷 PT</button></li>
  <li><button class="site-lang-option" data-lang="en">🇺🇸 EN</button></li>
  <li><button class="site-lang-option" data-lang="es">🇪🇸 ES</button></li>
  <!-- ADICIONE AQUI:
  <li><button class="site-lang-option" data-lang="fr">🇫🇷 FR</button></li>
  -->
</ul>
```

---

## ✏️ Adicionar Tradução para um Elemento

### 1. No HTML, adicione atributo `data-i18n`:

```html
<button data-i18n="voltar">Voltar</button>
<a href="..." data-i18n="privacidade">Política de Privacidade</a>
```

### 2. Na inicialização do i18next, adicione a tradução:

```javascript
i18next.init({
  resources: {
    pt: { translation: {
      'voltar': 'Voltar',
      'privacidade': 'Política de Privacidade'
    }},
    en: { translation: {
      'voltar': 'Back',
      'privacidade': 'Privacy Policy'
    }},
    es: { translation: {
      'voltar': 'Volver',
      'privacidade': 'Política de Privacidad'
    }}
  }
});
```

### 3. Pronto! A tradução funcionará automaticamente.

---

## 🐛 Troubleshooting

### ❌ Header/Footer não aparecendo

**Solução:**
1. Verifique se site-common.js está sendo carregado (F12 → Console)
2. Procure por `[site-common]` nos logs
3. Verifique se há erro de CORS nos arquivos CSS/JS

### ❌ Seletor de idioma não funcionando

**Solução:**
1. Verifique localStorage: `localStorage.getItem('i18nextLng')`
2. Certifique-se de que i18next está inicializado na página
3. Verifique se há erro no console

### ❌ Textos não traduzem

**Solução:**
1. Verifique se o elemento tem atributo `data-i18n`
2. Verifique se a chave existe nos recursos i18next
3. Procure no console por avisos

### ❌ Site quebrou depois de editar site-common.js

**Solução:**
1. Procure por erros de sintaxe (F12 → Console)
2. Desfaça as mudanças e teste novamente
3. Use um validador JavaScript online

---

## 📊 Verificação de Saúde

### Checklist de Validação

- [ ] Header aparece em todas as páginas?
- [ ] Footer aparece em todas as páginas?
- [ ] Seletor de idioma funciona?
- [ ] Idioma persiste ao navegar?
- [ ] Links da navegação funcionam?
- [ ] Botão voltar funciona?
- [ ] Não há headers/footers duplicados?
- [ ] Console não tem erros críticos?

---

## 🔍 Debuggando

### Verificar se site-common.js rodou

**No Console (F12):**
```javascript
console.log(window.__siteCommonApplied);  // Deve ser true
```

### Ver logs de site-common

**No Console, filtre por:**
```
[site-common]
```

### Forçar reaplica

**No Console:**
```javascript
window.__applyTranslations();
```

---

## 📝 Versão

- **Versão:** 2.0
- **Data:** 2026-06-19
- **Compatibilidade:** Todos os browsers modernos
- **Dependências:** i18next v23.15.1 (CDN)

---

## 🆘 Suporte Técnico

Se algo quebrou ou não funciona conforme esperado:

1. **Verifique o Console do Navegador** (F12 → Console)
2. **Procure por erros de JavaScript**
3. **Revise as mudanças recentes**
4. **Desfaça a mudança e teste novamente**
5. **Se persistir, consulte documentação do i18next**

---

## 💡 Boas Práticas

✅ **FAÇA:**
- Sempre adicione `data-i18n` aos elementos que precisam tradução
- Teste em múltiplos idiomas
- Use cache busting se editar site-common.js (`?v=2.0`)
- Mantenha git/controle de versão

❌ **NÃO FAÇA:**
- Não edite site-common.js sem testar
- Não delete comentários (ajudam na manutenção)
- Não ignore erros no console
- Não adicione lógica complexa (mantenha simples)

---

**Documento de Manutenção Completo**
