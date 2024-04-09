import type { Signal } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";

export const StoreContext = createContextId<{
    imageSrc: Signal<string>;
    imageWidth: Signal<string>;
    imageHeight: Signal<string>;
    strokeSize: Signal<number>;
    strokeColor: Signal<string>;
    canvasRef: Signal<HTMLCanvasElement>;
}>(
    "StoreContext"
);
