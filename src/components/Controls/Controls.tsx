import { component$, $, useContext, useSignal } from"@builder.io/qwik";
import { StoreContext } from "~/utils/store";

export const Controls = component$(() => {
    const { strokeColor, strokeSize, canvasRef, imageSrc } = useContext(StoreContext);
    const copyCanvasRef = useSignal<HTMLCanvasElement>();

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

    const resetImage = $(() => {
        const img = new Image();
        img.onload = () => {
            const ctx = canvasRef.value.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height);
        };
        img.src = imageSrc.value;
    });

    const applyEffect = $((effect: string) => {
        const ctx = canvasRef.value.getContext("2d");
        if (!ctx || !copyCanvasRef.value) return;
        if (imageSrc.value === "") return;

        // Set the hiddne canvas size to the current image size
        copyCanvasRef.value.width = canvasRef.value.width;
        copyCanvasRef.value.height = canvasRef.value.height;
        
        // get the hidden canvas context
        const copyCtx = copyCanvasRef.value.getContext("2d");
        if (!copyCtx) return;

        // Copy the canvas, set the effect, then draw it back on
        copyCtx.drawImage(canvasRef.value, 0, 0);
        ctx.filter = effect;
        ctx.drawImage(copyCanvasRef.value, 0, 0);

        // turn off the filter for further drawing
        ctx.filter = "none";
    });

    const controlButtons = [
        {
            label: "Reset",
            action: resetImage
        },
        {
            label: "Grayscale",
            action: $(() => applyEffect("grayscale(100%)"))
        },
        {
            label: "Blur",
            action: $(() => applyEffect("blur(4px)"))
        },
        {
            label: "Invert",
            action: $(() => applyEffect("invert(100%)"))
        },
        {
            label: "Contrast",
            action: $(() => applyEffect("contrast(200%)"))
        },
        {
            label: "Darken",
            action: $(() => applyEffect("brightness(0.4)"))
        },
        {
            label: "Brighten",
            action: $(() => applyEffect("brightness(1.6)"))
        },
        {
            label: "Hue",
            action: $(() => applyEffect("hue-rotate(90deg)"))
        },
        {
            label: "Sepia",
            action: $(() => applyEffect("sepia(100%)"))
        },
        {
            label: "Saturate",
            action: $(() => applyEffect("saturate(200%)"))
        }
    ];

    return (
        <div class="flex flex-col w-full p-2 text-slate-600">
            <h3 class="text-lg mx-1">
                Controls
            </h3>
            <div class="flex py-1 border-y border-slate-400">
                <label for="strokeSize" class="text-xs w-1/2 mx-1">
                    Stroke Size
                </label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    class="w-1/2 mx-1"
                    name="strokeSize"
                    value={strokeSize.value}
                    onChange$={$((event: Event) => {
                        const target = event.target as HTMLInputElement;
                        strokeSize.value = parseInt(target.value);
                    })} />
            </div>
            <div class="flex py-1 border-b border-slate-400">
                <label for="strokeColor" class="text-xs w-1/2 mx-1">
                    Stroke Color
                </label>
                <input
                    type="color"
                    name="strokeColor"
                    class="w-1/2 mx-1"
                    value={strokeColor.value}
                    onChange$={$((event: Event) => {
                        const target = event.target as HTMLInputElement;
                        strokeColor.value = target.value;
                    })} />
            </div>
            <h3 class="text-xs mx-1 pt-1">
                Effects
            </h3>
            <div class="flex flex-row flex-wrap border-b border-slate-400 pb-1">
                {controlButtons.map((button, index) => {
                    return (
                        <div class="w-1/2 px-1 mb-1" key={index}>
                            <button
                                preventdefault:click
                                onClick$={button.action}
                                class="w-full px-2 text-xs border border-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-all">
                                {button.label}
                            </button>
                        </div>
                    );
                })}
            </div>
            <div class="w-full px-1 mt-1">
                <button
                    preventdefault:click
                    onClick$={downloadImage}
                    class="w-full px-2 text-xs border border-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-all">
                    Download
                </button>
            </div>
            <canvas
                ref={copyCanvasRef}
                class="hidden"
            />
        </div>
    );
});
