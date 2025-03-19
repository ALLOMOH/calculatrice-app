type OperatorType = "+" | "-" | "*" | "/" | null;

interface CalculatorState {
  currentValue: string;
  firstOperand: number | null;
  operator: OperatorType;
  waitingForSecondOperand: boolean;
}

class Calculator {
  private display: HTMLDivElement;
  private state: CalculatorState;

  constructor() {
    this.display = document.querySelector(".display") as HTMLDivElement;
    this.state = this.initialState();
    this.initializeEventListeners();
  }

  private initialState(): CalculatorState {
    return {
      currentValue: "0",
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false,
    };
  }

  private initializeEventListeners(): void {
    document.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (e) => this.handleButtonClick(e));
    });
  }

  private handleButtonClick(event: Event): void {
    const target = event.target as HTMLButtonElement;
    const value = target.textContent!;

    switch (true) {
      case value === "C":
        this.reset();
        break;

      case value === "=":
        this.precalculate();
        break;

      case "+-*/".includes(value):
        this.handleOperator(value as OperatorType);
        break;

      case value === ".":
        this.handleDecimal();
        break;

      default:
        this.handleNumber(value);
    }

    this.updateDisplay();
  }

  private handleNumber(number: string): void {
    const { currentValue, waitingForSecondOperand } = this.state;

    if (waitingForSecondOperand) {
      this.state.currentValue = number;
      this.state.waitingForSecondOperand = false;
    } else {
      this.state.currentValue =
        currentValue === "0" ? number : currentValue + number;
    }
  }

  private handleDecimal(): void {
    if (!this.state.currentValue.includes(".")) {
      this.state.currentValue += ".";
    }
  }

  private handleOperator(operator: OperatorType): void {
    const inputValue = parseFloat(this.state.currentValue);

    if (this.state.operator && this.state.waitingForSecondOperand) {
      this.state.operator = operator;
      return;
    }

    if (this.state.firstOperand === null) {
      this.state.firstOperand = inputValue;
    } else if (this.state.operator) {
      const result = this.calculate(
        this.state.firstOperand,
        inputValue,
        this.state.operator
      );

      this.state.currentValue = `${parseFloat(result.toFixed(7))}`;
      this.state.firstOperand = result;
      this.updateDisplay();
    }

    this.state.waitingForSecondOperand = true;
    this.state.operator = operator;
  }

  private precalculate(): void {
    if (this.state.operator === null || this.state.waitingForSecondOperand)
      return;

    const secondOperand = parseFloat(this.state.currentValue);
    const result = this.calculate(
      this.state.firstOperand!,
      secondOperand,
      this.state.operator
    );

    this.state.currentValue = `${parseFloat(result.toFixed(7))}`;
    this.state.operator = null;
    this.state.firstOperand = null;
    this.state.waitingForSecondOperand = false;
  }

  private reset(): void {
    this.state = this.initialState();
    this.updateDisplay();
  }

  private updateDisplay(): void {
    this.display.textContent = this.state.currentValue;
  }

  private calculate(
    first: number,
    second: number,
    operator: OperatorType
  ): number {
    switch (operator) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        if (second === 0){
          this.display.textContent='Error';
          throw new Error("Division par zero");
        }
        return first / second;
        default:
          this.reset();
          throw new Error("Opérateur invalide");
    }
  }
}

// Initialisation quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => new Calculator());
