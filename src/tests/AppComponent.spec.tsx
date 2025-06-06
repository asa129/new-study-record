import App from "../App";
import { render, screen, waitFor } from "@testing-library/react";
import {
  addStudyRecord,
  deleteStudyRecordById,
  GetAllStudyRecords,
  updateStudyRecordById,
} from "../lib/study-record";
import userEvent from "@testing-library/user-event";
import { Record } from "../domain/record";

// 非同期関数をモック
jest.mock("../lib/study-record", () => ({
  GetAllStudyRecords: jest.fn(),
  addStudyRecord: jest.fn(),
  deleteStudyRecordById: jest.fn(),
  updateStudyRecordById: jest.fn(),
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

  it("ローディング画面をみることができる", async () => {
    // GetAllStudyRecordsのモックを遅延させる
    (GetAllStudyRecords as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );
    render(<App />);
    expect(await screen.findByTestId("loading")).toBeInTheDocument();
  });

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

  it("モーダルのタイトルが記録編集である", async () => {
    const user = userEvent.setup();
    // モックデータを作る
    const mockData: Partial<Record>[] = [
      { id: "1", title: "タイトル", time: 3 },
    ];

    // 初期表示用のデータ取得
    (GetAllStudyRecords as jest.Mock).mockImplementation(() => {
      return Promise.resolve(mockData);
    });

    render(<App />);

    // 初期表示できることを確認
    expect(await screen.findByTestId("title")).toBeInTheDocument();

    // 編集ボタン押下
    await user.click(await screen.findByTestId("edit-button"));

    // モーダルが表示されるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect((await screen.findByTestId("modal-title")).textContent).toBe(
      "記録編集"
    );
  });

  it("編集して登録すると更新される", async () => {
    const user = userEvent.setup();
    // モックデータを作る
    const mockData: Partial<Record>[] = [
      { id: "1", title: "タイトル", time: 3 },
    ];

    // 初期表示用のデータ取得
    (GetAllStudyRecords as jest.Mock).mockImplementation(() => {
      return Promise.resolve(mockData);
    });

    render(<App />);

    // 初期表示できることを確認
    expect(await screen.findByTestId("title")).toBeInTheDocument();

    // 編集ボタン押下
    await user.click(await screen.findByTestId("edit-button"));

    // モーダルが表示されるまで少し待つ
    expect(await screen.findByTestId("modal-title")).toHaveTextContent(
      "記録編集"
    );

    // 編集する値を入力する
    // タイトル欄を一旦クリアしてから入力
    await user.clear(await screen.findByTestId("title-input"));
    await user.type(
      await screen.findByTestId("title-input"),
      "タイトル更新したよ"
    );
    const timeInput = await screen.findByTestId("time-input");
    const input = timeInput.querySelector('input[role="spinbutton"]');
    await user.clear(input!);
    await user.type(input!, "4");

    // 編集した処理を前もってモック化する
    (updateStudyRecordById as jest.Mock).mockImplementation(() => {
      // 更新したことにして、なにも返さない
      return Promise.resolve([]);
    });

    // 更新後のデータを取得する
    (GetAllStudyRecords as jest.Mock).mockImplementation(() => {
      return Promise.resolve([
        {
          id: "1",
          title: "タイトル更新したよ",
          time: 4,
        },
      ]);
    });

    // 登録ボタンをクリック
    await user.click(await screen.findByTestId("submit-button"));

    // モーダルが閉じるのを待つ
    await waitFor(() => {
      expect(screen.queryByTestId("modal-title")).not.toBeInTheDocument();
    });

    // 更新処理が成功したことを確認
    expect(updateStudyRecordById).toHaveBeenCalledTimes(1);
    expect(updateStudyRecordById).toHaveBeenCalledWith({
      id: "1",
      title: "タイトル更新したよ",
      time: 4,
    });

    // 更新されたデータが表示されることを確認
    expect(await screen.findByText("タイトル更新したよ")).toBeInTheDocument();
    expect(await screen.findByText("4")).toBeInTheDocument();
  });
});
