import App from "../App";
import { render, screen } from "@testing-library/react";

describe("title", () => {
  it("should render title", async () => {
    render(<App />);
    expect((await screen.findByTestId("title")).textContent).toBe(
      "新・学習記録アプリ"
    );
  });
});
