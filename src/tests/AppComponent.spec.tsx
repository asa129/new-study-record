import App from "../App";
import { render, screen } from "@testing-library/react";
import { GetAllStudyRecords } from "../lib/study-record";

// 非同期関数をモック
jest.mock("../lib/study-record", () => ({
  GetAllStudyRecords: jest.fn(),
}));

describe("title", () => {
  it("should render title", async () => {
    // モックの戻り値を設定
    (GetAllStudyRecords as jest.Mock).mockResolvedValue([]);

    render(<App />);
    expect((await screen.findByTestId("title")).textContent).toBe(
      "新・学習記録アプリ"
    );
  });
});
