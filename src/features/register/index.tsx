import { useState } from "react";
import type { Feature } from "../../app/features";
import { Button } from "../../ui";
import { RegisterDialog } from "./RegisterDialog";

function RegisterButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        ＋ 記録する
      </Button>
      <RegisterDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const feature: Feature = { slot: "header", order: 100, Component: RegisterButton };
