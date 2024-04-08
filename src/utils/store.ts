import type { Signal } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";

export const StoreContext = createContextId<Signal<string>>(
    "StoreContext"
);
