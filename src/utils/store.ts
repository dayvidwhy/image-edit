import type { Signal } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";

export const StoreContext = createContextId<{
    imageSrc: Signal<string>;
    imageWidth: Signal<number>;
    imageHeight: Signal<number>;
    strokeSize: Signal<number>;
    strokeColor: Signal<string>;
    canvasRef: Signal<HTMLCanvasElement>;
    editorRef: Signal<HTMLDivElement>;
}>(
    "StoreContext"
);
