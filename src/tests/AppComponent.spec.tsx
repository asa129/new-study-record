import App from "../App";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { addStudyRecord, GetAllStudyRecords } from "../lib/study-record";
import userEvent from "@testing-library/user-event";

// 非同期関数をモック
jest.mock("../lib/study-record", () => ({
  GetAllStudyRecords: jest.fn(),
  addStudyRecord: jest.fn(),
}));

describe("title", () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    jest.clearAllMocks();
    // デフォルトの返り値を設定
    (GetAllStudyRecords as jest.Mock).mockResolvedValue([]);
  });

  it("タイトルがある", async () => {
    render(<App />);
    expect((await screen.findByTestId("title")).textContent).toBe(
      "新・学習記録アプリ"
    );
  });

  // it("ローディング画面をみることができる", async () => {
  //   render(<App />);
  //   expect(await screen.findByTestId("loading")).toBeInTheDocument();
  // });

  it("テーブルをみることができる", async () => {
    render(<App />);
    expect(await screen.findByTestId("table")).toBeInTheDocument();
  });

  it("新規登録ボタンがある", async () => {
    render(<App />);
    expect(await screen.findByTestId("new-record-button")).toBeInTheDocument();
  });

  it("登録ができる", async () => {
    // モックデータを準備
    const mockData: any[] = [];

    // GetAllStudyRecordsの実装: 初回は空配列、2回目は登録されたデータを含む配列を返す
    (GetAllStudyRecords as jest.Mock).mockImplementation(() => {
      if ((addStudyRecord as jest.Mock).mock.calls.length > 0) {
        mockData.push({
          id: "1",
          title: "Test Title",
          time: 60,
        });
      }
      return Promise.resolve([...mockData]);
    });

    // addStudyRecordの実装: 登録されたデータをmockDataに追加
    (addStudyRecord as jest.Mock).mockImplementation(() => {
      // 実装は何もしない（成功したことにする）
      return Promise.resolve();
    });

    const user = userEvent.setup();
    render(<App />);

    // 新規登録ボタンをクリック
    await user.click(await screen.findByTestId("new-record-button"));
    // タイトルを入力
    await user.type(await screen.findByTestId("title-input"), "Test Title");
    // 時間を入力
    const timeInput = await screen.findByTestId("time-input");
    const input = timeInput.querySelector('input[role="spinbutton"]');
    await user.clear(input!);
    await user.type(input!, "60");

    // フォームエラーがないことを確認するために少し待つ
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 登録ボタンをクリック
    await user.click(await screen.findByTestId("submit-button"));

    // モーダルが閉じるのを待つ
    await waitFor(() => {
      expect(screen.queryByText("Modal Title")).not.toBeInTheDocument();
    });

    console.log("mockData", mockData);
    screen.debug();

    // 登録されたデータが表示されることを確認
    expect(await screen.findByText("Test Title")).toBeInTheDocument();
    expect(await screen.findByText("60")).toBeInTheDocument();
  });
});
