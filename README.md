# **Calculatrice-app**


## *Idee pour ameliorer le min projet*

Je vais ajouter ces fonctionnalités de manière progressive. Voici la mise à jour complète :

### **1. Nouveau HTML (./index.html)**

html

```
<!DOCTYPE html>
<html data-theme="light">
<head>
  <meta charset="UTF-8">
  <title>Calculatrice Pro</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="container">
    <div class="theme-switcher">
      <select id="themeSelect">
        <option value="light">Classique</option>
        <option value="dark">Nuit</option>
        <option value="vintage">Rétro</option>
      </select>
    </div>
  
    <div class="calculator">
      <div class="display">
        <div class="memory-indicator" id="memoryIndicator"></div>
        <div class="current-value">0</div>
      </div>
    
      <div class="history" id="history"></div>
    
      <div class="buttons">
        <!-- Nouveaux boutons mémoire -->
        <button class="memory" data-action="mc">MC</button>
        <button class="memory" data-action="mr">MR</button>
        <button class="memory" data-action="m+">M+</button>
        <button class="memory" data-action="m-">M-</button>
      
        <!-- ... autres boutons existants ... -->
        <button class="operator">+</button>
        <button>=</button>
      </div>
    </div>
  </div>
  <script type="module" src="./renderer.ts"></script>
</body>
</html>
```

Run HTML

### **2. Nouveau CSS (src/style.css)**

css


```css
:root {
  /* Thème light par défaut */
  --bg-color: #f0f0f0;
  --calc-bg: #333;
  --btn-bg: #666;
  --operator-bg: #ff9500;
  --clear-bg: #ff3b30;
  --text-color: white;
  --display-bg: #98fb98;
}

[data-theme="dark"] {
  --bg-color: #2c2c2c;
  --calc-bg: #1a1a1a;
  --btn-bg: #4d4d4d;
  --operator-bg: #ffaa33;
  --clear-bg: #ff4444;
  --display-bg: #245a24;
}

[data-theme="vintage"] {
  --bg-color: #f0e6d3;
  --calc-bg: #8b7355;
  --btn-bg: #a0522d;
  --operator-bg: #daa520;
  --clear-bg: #cd5c5c;
  --display-bg: #6b8e23;
}

/* Ajouts pour les nouvelles fonctionnalités */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.theme-switcher select {
  padding: 5px;
  border-radius: 5px;
  background: var(--btn-bg);
  color: var(--text-color);
}

.memory-indicator {
  position: absolute;
  top: 5px;
  left: 5px;
  color: var(--text-color);
  font-size: 12px;
}

.history {
  height: 100px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 5px;
  background: var(--display-bg);
  border-radius: 5px;
  font-size: 12px;
}

.history-item {
  padding: 2px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
```

### **3. Main.ts étendu**

typescript


```typescript
interface CalculatorState {
  // ... existant ...
  memory: number;
  history: string[];
  currentTheme: string;
}

class Calculator {
  private historyContainer: HTMLDivElement;
  private themeSelect: HTMLSelectElement;
  private memoryIndicator: HTMLDivElement;

  constructor() {
    // ... sélecteurs existants ...
    this.historyContainer = document.getElementById('history') as HTMLDivElement;
    this.themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
    this.memoryIndicator = document.getElementById('memoryIndicator') as HTMLDivElement;

    this.state = {
      ...this.initialState(),
      memory: 0,
      history: [],
      currentTheme: 'light'
    };

    this.loadTheme();
    this.initializeThemeListener();
  }

  private initializeThemeListener(): void {
    this.themeSelect.addEventListener('change', (e) => {
      const theme = (e.target as HTMLSelectElement).value;
      this.changeTheme(theme);
    });
  }

  private changeTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.state.currentTheme = theme;
    localStorage.setItem('calculatorTheme', theme);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
    this.themeSelect.value = savedTheme;
    this.changeTheme(savedTheme);
  }

  // Méthodes mémoire
  private handleMemory(action: string): void {
    const current = parseFloat(this.state.currentValue);
  
    switch(action) {
      case 'mc':
        this.state.memory = 0;
        break;
      case 'mr':
        if(this.state.memory !== 0) {
          this.state.currentValue = this.state.memory.toString();
          this.updateDisplay();
        }
        break;
      case 'm+':
        this.state.memory += current;
        break;
      case 'm-':
        this.state.memory -= current;
        break;
    }
  
    this.updateMemoryIndicator();
  }

  private updateMemoryIndicator(): void {
    this.memoryIndicator.textContent = 
      this.state.memory !== 0 ? `M: ${this.state.memory}` : '';
  }

  // Méthodes historiques
  private addToHistory(operation: string): void {
    this.state.history.unshift(operation);
    if(this.state.history.length > 10) this.state.history.pop();
  
    this.historyContainer.innerHTML = this.state.history
      .map(op => `<div class="history-item">${op}</div>`)
      .join('');
  }

  // Modifier la méthode calculate
  private calculate(): void {
    // ... existant ...
    const operation = `${firstOperand}${operator}${secondOperand} = ${result}`;
    this.addToHistory(operation);
  }
}
```

## **Nouvelles fonctionnalités a ajoutées :**

1. **Système de mémoire :**
   * MC : Mémoire Clear
   * MR : Mémoire Recall
   * M+ : Ajoute à la mémoire
   * M- : Soustrait de la mémoire
   * Indicateur visuel de la mémoire
2. **Historique des calculs :**
   * Stockage des 10 derniers calculs
   * Défilement automatique
   * Format : "5 + 3 = 8"
3. **Système de thèmes :**
   * 3 thèmes prédéfinis (light/dark/vintage)
   * Persistance dans localStorage
   * Sélecteur déroulant
   * Variables CSS dynamiques
4. **Améliorations visuelles :**
   * Meilleure disposition responsive
   * Indicateurs d'état
   * Style cohérent entre les thèmes

### **Pour utiliser ces modifications :**

1. Ajouter les nouveaux styles CSS
2. Mettre à jour le HTML avec les nouveaux éléments
3. Intégrer les nouvelles méthodes dans la classe Calculator
4. Redémarrer l'application avec `npm run dev`

### **Prochaines améliorations possibles :**

* Conversion d'unités
* Calculs scientifiques
* Personnalisation des thèmes
* Export de l'historique
* Sons de feedback

```typescript
# Changer de thème
document.querySelector('#themeSelect').value = 'dark'

# Vider la mémoire
document.querySelector('[data-action="mc"]').click()
```
