import { component$, $, useContext } from"@builder.io/qwik";
import { StoreContext } from "~/utils/store";

export const Controls = component$(() => {
    const { strokeColor, strokeSize, canvasRef } = useContext(StoreContext);

    // download the image
    const downloadImage = $(() => {
        canvasRef.value.toBlob(((blob): void  => {
            if (!blob) {
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "";
            a.click();
            URL.revokeObjectURL(url);
        }));
    });

    return (
        <div class="flex flex-col w-full border border-slate-400 p-2 text-slate-600">
            <h3 class="text-2xl">
                    Controls
            </h3>
            <div class="flex pt-2">
                <label for="strokeSize" class="flex justify-between text-sm w-1/2">
                        Stroke Size
                </label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    class="w-1/2"
                    name="strokeSize"
                    value={strokeSize.value}
                    onChange$={$((event: Event) => {
                        const target = event.target as HTMLInputElement;
                        strokeSize.value = parseInt(target.value);
                    })} />
            </div>
            <div class="flex pt-2">
                <label for="strokeColor" class="flex justify-between text-sm w-1/2">
                    Stroke Color
                </label>
                <input
                    type="color"
                    name="strokeColor"
                    class="w-1/2"
                    value={strokeColor.value}
                    onChange$={$((event: Event) => {
                        const target = event.target as HTMLInputElement;
                        strokeColor.value = target.value;
                    })} />
            </div>
            <button
                preventdefault:click
                onClick$={downloadImage}
                class="w-fit mt-2 px-2 text-lg border rounded border-slate-400 hover:bg-slate-600 hover:text-slate-50">
                    Download
            </button>
        </div>
    );
});
