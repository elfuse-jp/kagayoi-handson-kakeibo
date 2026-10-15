import { screen, within } from "@testing-library/react";
import { STORAGE_KEY } from "../../store/storage";
import { renderApp } from "../../test-utils";

describe("収支の登録", () => {
  it("入力した支出を記録し、一覧に出す", async () => {
    const { user } = renderApp({ month: "2026-09" });
    await user.click(screen.getByRole("button", { name: "＋ 記録する" }));
    const dialog = screen.getByRole("dialog", { name: "収支を記録する" });

    await user.clear(within(dialog).getByLabelText("日付"));
    await user.type(within(dialog).getByLabelText("日付"), "2026-09-10");
    await user.type(within(dialog).getByLabelText("金額（円）"), "1,200");
    await user.selectOptions(within(dialog).getByLabelText("カテゴリ"), "交通");
    await user.type(within(dialog).getByLabelText("メモ"), "電車");
    await user.click(within(dialog).getByRole("button", { name: "記録する" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    const list = screen.getByRole("region", { name: "取引" });
    expect(within(list).getByText("電車")).toBeDefined();
    expect(within(list).getByText("1,200円")).toBeDefined();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null").transactions).toEqual([
      {
        id: expect.any(String),
        date: "2026-09-10",
        type: "expense",
        amount: 1200,
        categoryId: "transport",
        memo: "電車",
      },
    ]);
  });

  it("収入に切り替えると、カテゴリも収入のものになる", async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole("button", { name: "＋ 記録する" }));

    await user.click(screen.getByRole("radio", { name: "収入" }));

    const options = within(screen.getByLabelText("カテゴリ")).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["給与", "その他"]);
  });

  it("金額が正しくなければ理由を出し、記録させない", async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole("button", { name: "＋ 記録する" }));
    const submit = screen.getByRole("button", { name: "記録する" });
    expect(submit).toHaveProperty("disabled", true);

    await user.type(screen.getByLabelText("金額（円）"), "1.5");

    expect(screen.getByText("1 以上の整数で入力してください。")).toBeDefined();
    expect(submit).toHaveProperty("disabled", true);
  });
});
