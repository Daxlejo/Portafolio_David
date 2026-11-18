"use client";

import { useEffect, useState } from "react";
import { useWorkshop } from "@/lib/workshop/store";

/** Toast `david@taller:~$ <comando>` durante 2.2 s. */
export default function StatusToast() {
  const toast = useWorkshop((s) => s.toast);
  const [hiddenId, setHiddenId] = useState(-1);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setHiddenId(toast.id), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const on = !!toast && toast.id !== hiddenId;
  return (
    <div
      role="status"
      aria-live="polite"
      data-on={on}
      className="ws-toast glass pointer-events-none absolute top-[84px] left-1/2 z-40 rounded-[10px] border border-line px-3.5 py-2 font-mono text-[12.5px] max-[760px]:top-[72px]"
    >
      {toast && (
        <>
          <b className="font-medium text-accent">david@taller</b>:~$ {toast.text}
        </>
      )}
    </div>
  );
}
