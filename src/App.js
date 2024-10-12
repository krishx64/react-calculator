import "./App.css";
import DigitButton from "./DigitButton";
import { useReducer, useState } from "react";
import OperationButton from "./OperationButton";
import { type } from "@testing-library/user-event/dist/type";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete_digit",
  EVALUATE: "evaluate",
};

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "/":
      computation = prev / current;
      break;
    case "*":
      computation = prev * current;
      break;
  }
  return computation.toString();
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (
        payload.digit === "." &&
        (state.currentOperand == null || state.currentOperand.includes("."))
      )
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {};
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      )
        return state;

      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.previousOperand != null && state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand != null && state.currentOperand != null) {
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: state.currentOperand,
        operation: payload.operation,
        currentOperand: null,
      };
    default:
      return state;
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        className="span-two"
      >
        =
      </button>
    </div>
  );
}

export default App;
