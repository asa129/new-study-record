import App from "../App";
import { render, screen, waitFor } from "@testing-library/react";
import {
  addStudyRecord,
  deleteStudyRecordById,
  GetAllStudyRecords,
} from "../lib/study-record";
import userEvent from "@testing-library/user-event";
import { Record } from "../domain/record";

// 非同期関数をモック
jest.mock("../lib/study-record", () => ({
  GetAllStudyRecords: jest.fn(),
  addStudyRecord: jest.fn(),
  deleteStudyRecordById: jest.fn(),
}));

describe("App", () => {
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
    const mockData: Partial<Record>[] = [];

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

  it("モーダルが新規登録というタイトルで表示される", async () => {
    render(<App />);
    await userEvent.click(await screen.findByTestId("new-record-button"));
    expect(await screen.findByTestId("modal-title")).toHaveTextContent(
      "新規登録"
    );
  });

  it("学習内容がないときに登録するとエラーがでる", async () => {
    const user = userEvent.setup();
    render(<App />);
    await userEvent.click(await screen.findByTestId("new-record-button"));
    const timeInput = await screen.findByTestId("time-input");
    const input = timeInput.querySelector('input[role="spinbutton"]');
    await user.clear(input!);
    await user.type(input!, "60");

    // フォームエラーがないことを確認するために少し待つ
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 登録ボタンをクリック
    await userEvent.click(await screen.findByTestId("submit-button"));

    expect(await screen.findByText("学習内容は必須です")).toBeInTheDocument();
  });

  it("学習時間がないときに登録するとエラーがでる", async () => {
    const user = userEvent.setup();
    render(<App />);
    await userEvent.click(await screen.findByTestId("new-record-button"));
    await user.type(await screen.findByTestId("title-input"), "Test Title");

    // フォームエラーがないことを確認するために少し待つ
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 登録ボタンをクリック
    await userEvent.click(await screen.findByTestId("submit-button"));

    screen.debug();

    expect(await screen.findByText("学習時間は必須です")).toBeInTheDocument();
  });

  it("削除ができること", async () => {
    // モックデータを準備
    const mockData: Partial<Record>[] = [
      { id: "1", title: "Test Title", time: 60 },
    ];

    // GetAllStudyRecordsの実装: 初回はモックデータを返す
    (GetAllStudyRecords as jest.Mock).mockImplementation(() => {
      return Promise.resolve(mockData);
    });

    // 削除処理をモック
    (deleteStudyRecordById as jest.Mock).mockImplementation(() => {
      // モックデータから削除する
      const index = mockData.findIndex((record) => record.id === "1");
      if (index !== -1) {
        mockData.splice(index, 1);
      }
      // 再レンダリングをトリガーするためにGetAllStudyRecordsを再設定
      (GetAllStudyRecords as jest.Mock).mockResolvedValue([...mockData]);
      return Promise.resolve(); // 成功したことにする
    });

    render(<App />);

    // データが表示されることを確認
    expect(await screen.findByText("Test Title")).toBeInTheDocument();

    // 削除ボタンをクリック
    await userEvent.click(await screen.findByTestId("delete-button"));

    // 削除されたデータが表示されないことを確認
    await waitFor(() => {
      expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    });
  });
});
