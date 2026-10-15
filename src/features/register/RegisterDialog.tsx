// 仕様は docs/product/spec.md の「収支の登録」。
import { type FormEvent, useState } from "react";
import { parseAmount } from "../../lib/money";
import { isDate, today } from "../../lib/month";
import { categoriesOf } from "../../store/categories";
import { useKakeibo } from "../../store/KakeiboProvider";
import { MEMO_MAX_LENGTH, type TransactionType } from "../../store/types";
import { Button, Dialog, Field, Input, Select } from "../../ui";

type Props = { open: boolean; onClose: () => void };

export function RegisterDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} title="収支を記録する" onClose={onClose}>
      {/* 開くたびに入力を初期値に戻すため、閉じている間は描かない。 */}
      {open && <RegisterForm onDone={onClose} />}
    </Dialog>
  );
}

const TYPE_LABEL: Record<TransactionType, string> = { expense: "支出", income: "収入" };

function RegisterForm({ onDone }: { onDone: () => void }) {
  const { addTransaction } = useKakeibo();
  const [date, setDate] = useState(() => today());
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState(() => firstCategoryId("expense"));
  const [amountText, setAmountText] = useState("");
  const [memo, setMemo] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  const amount = parseAmount(amountText);
  const errors = {
    date: isDate(date) ? null : "日付を選んでください。",
    // 何も入れていないうちは理由を出さない（登録ボタンは押せないまま）。
    amount: amountText.trim() === "" || amount !== null ? null : "1 以上の整数で入力してください。",
    memo: memo.length <= MEMO_MAX_LENGTH ? null : `${MEMO_MAX_LENGTH} 文字までにしてください。`,
  };
  const canSubmit = amount !== null && Object.values(errors).every((e) => e === null);

  function changeType(next: TransactionType) {
    setType(next);
    setCategoryId(firstCategoryId(next));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || amount === null) return;
    const result = addTransaction({ date, type, amount, categoryId, memo: memo.trim() });
    if (result.ok) onDone();
    else setSaveError(result.reason);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <fieldset className="flex gap-2">
        <legend className="mb-1 text-sm font-medium">収支</legend>
        {(["expense", "income"] as const).map((t) => (
          <label
            key={t}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 py-2 has-checked:border-primary has-checked:bg-surface-muted"
          >
            <input
              type="radio"
              name="type"
              value={t}
              checked={type === t}
              onChange={() => changeType(t)}
            />
            {TYPE_LABEL[t]}
          </label>
        ))}
      </fieldset>
      <Field label="日付" error={errors.date}>
        {(control) => (
          <Input {...control} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        )}
      </Field>
      <Field label="金額（円）" error={errors.amount}>
        {(control) => (
          <Input
            {...control}
            inputMode="numeric"
            placeholder="1,200"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
          />
        )}
      </Field>
      <Field label="カテゴリ">
        {(control) => (
          <Select {...control} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categoriesOf(type).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="メモ" error={errors.memo}>
        {(control) => <Input {...control} value={memo} onChange={(e) => setMemo(e.target.value)} />}
      </Field>
      {saveError !== null && (
        <p role="alert" className="text-sm text-danger">
          {saveError}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onDone}>
          やめる
        </Button>
        <Button variant="primary" type="submit" disabled={!canSubmit}>
          記録する
        </Button>
      </div>
    </form>
  );
}

function firstCategoryId(type: TransactionType): string {
  const first = categoriesOf(type)[0];
  if (first === undefined) throw new Error(`${type} のカテゴリが無い`);
  return first.id;
}
