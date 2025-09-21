# 🎨 Guia Visual Completo - Devagram

## 🌈 Sistema de Cores e Gradientes

### Paleta Principal
```scss
// Cores base
$azul-principal: #667eea;
$roxo-principal: #764ba2;
$branco: #ffffff;

// Transparências
$glassmorphism: rgba(255, 255, 255, 0.15);
$glassmorphism-forte: rgba(255, 255, 255, 0.3);
$sombra-azul: rgba(103, 126, 234, 0.3);
```

### Gradientes Padronizados

#### 1. Background Principal (Body)
```css
background: linear-gradient(135deg, #667eea, #764ba2, #ffffff);
background-attachment: fixed;
background-repeat: no-repeat;
```
- **Uso**: Fundo de toda a aplicação
- **Direção**: 135deg (diagonal)
- **Sequência**: Azul → Roxo → Branco

#### 2. Header Glassmorphism
```css
background: linear-gradient(90deg, #ffffff 0%, #764ba2 50%, #667eea 100%);
backdrop-filter: blur(10px);
```
- **Uso**: Cabeçalho principal
- **Direção**: 90deg (horizontal)
- **Sequência**: Branco → Roxo → Azul

#### 3. Logo SSphere
```css
background: linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
- **Uso**: Texto do logo
- **Direção**: 135deg (diagonal)
- **Sequência**: Branco → Azul → Roxo

## 🏗️ Estrutura Visual

### Layout Responsivo
```
Mobile (< 992px):
┌─────────────────────┐
│ Header Glassmorphism│
├─────────────────────┤
│                     │
│    Feed Content     │
│   (Transparente)    │
│                     │
├─────────────────────┤
│ Bottom Navigation   │
└─────────────────────┘

Desktop (≥ 992px):
┌─────────────────────┐
│ Header Glassmorphism│
├─────────────────────┤
│                     │
│    Feed Content     │
│   (Transparente)    │
│                     │
└─────────────────────┘
```

### Hierarquia de Transparência
1. **Body**: Gradiente sólido (base)
2. **Header**: Glassmorphism com gradiente
3. **Cards/Posts**: Transparentes com bordas
4. **Navigation**: Transparente com blur

## 🎯 Componentes Principais

### Header (.cabecalhoHeader)
```scss
.cabecalhoHeader {
  background: linear-gradient(90deg, #ffffff 0%, #764ba2 50%, #667eea 100%);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 25px rgba(103, 126, 234, 0.3);
}
```

### Logo SSphere
```scss
.logoText {
  background: linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 0 4px 8px rgba(103, 126, 234, 0.3);
}
```

### Feed Container
```scss
.feedContainer {
  background: transparent;
  min-height: 100vh;
}
```

### Posts/Cards
```scss
.postagem, .paginaLogin, .paginaPublica {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 30px rgba(103, 126, 234, 0.25);
  backdrop-filter: blur(5px);
}
```

## 🎨 Efeitos Visuais

### Glassmorphism
```scss
.glassmorphism {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 25px rgba(103, 126, 234, 0.3);
}
```

### Hover Effects
```scss
.hover-effect {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(103, 126, 234, 0.4);
  }
}
```

### Text Gradients
```scss
.text-gradient {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## 📱 Responsividade

### Breakpoints
```scss
$mobile: 0px;
$tablet: 768px;
$desktop: 992px;
$large: 1200px;
```

### Media Queries Padrão
```scss
// Mobile First
.component {
  // Estilos mobile
  
  @media screen and (min-width: 992px) {
    // Estilos desktop
  }
}
```

## 🎯 Boas Práticas

### ✅ Fazer
- Usar gradientes padronizados
- Manter transparência em cards
- Aplicar glassmorphism em overlays
- Testar em mobile e desktop
- Usar backdrop-filter para blur

### ❌ Evitar
- Backgrounds sólidos em cards
- Gradientes diferentes dos padrão
- Quebrar a hierarquia visual
- Esquecer responsividade
- Usar cores fora da paleta

## 🔧 Implementação

### Ordem de CSS
1. **globals.scss** (base)
2. **componentes individuais**
3. **tema-claro-melhorado.scss** (sobrescreve)

### Classes Importantes
```scss
// Tema principal
body.tema-claro { }

// Componentes principais
.cabecalhoHeader { }
.feedContainer { }
.postagem { }
.bottom-nav { }
```

## 🎨 Exemplos de Uso

### Novo Card Transparente
```scss
.meu-card {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(103, 126, 234, 0.2);
  border-radius: 12px;
}
```

### Botão com Gradiente
```scss
.meu-botao {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(103, 126, 234, 0.4);
  }
}
```

---
**Mantenha este guia como referência para todas as implementações visuais futuras.**