import type { ReactElement } from "react";

export function errorTypeGuard(error: unknown): error is Error {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  );
}

export function isReactElement(element: unknown): element is ReactElement {
  return element !== null && typeof element === "object" && "props" in element;
}
