import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "../app";

describe("Rendering the app", () => {
  it("Renders the App component", () => {
    render(<App />);

    screen.debug();
  });
});
