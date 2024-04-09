import { component$, $, useContext, useSignal } from"@builder.io/qwik";
import { StoreContext } from "~/utils/store";

export const Controls = component$(() => {
    const { strokeColor, strokeSize, canvasRef, imageSrc } = useContext(StoreContext);
    const copyCanvasRef = useSignal<HTMLCanvasElement>();

    const grayscaleAmount = useSignal(100);
    const blurAmount = useSignal(4);
    const invertAmount = useSignal(100);
    const contrastAmount = useSignal(200);
    const darkenAmount = useSignal(0.4);
    const brightenAmount = useSignal(1.6);
    const hueAmount = useSignal(90);
    const sepiaAmount = useSignal(100);
    const saturateAmount = useSignal(200);

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
            label: "Grayscale",
            action: $(() => applyEffect(`grayscale(${grayscaleAmount.value}%)`)),
            rangeStart: 0,
            rangeEnd: 100,
            step: 1,
            signal: grayscaleAmount
        },
        {
            label: "Blur",
            action: $(() => applyEffect(`blur(${blurAmount.value}px)`)),
            rangeStart: 0,
            rangeEnd: 10,
            step: 1,
            signal: blurAmount
        },
        {
            label: "Invert",
            action: $(() => applyEffect(`invert(${invertAmount.value}%)`)),
            rangeStart: 0,
            rangeEnd: 100,
            step: 1,
            signal: invertAmount
        },
        {
            label: "Contrast",
            action: $(() => applyEffect(`contrast(${contrastAmount.value}%)`)),
            rangeStart: 0,
            rangeEnd: 200,
            step: 1,
            signal: contrastAmount
        },
        {
            label: "Darken",
            action: $(() => applyEffect(`brightness(${darkenAmount.value})`)),
            rangeStart: 0.2,
            rangeEnd: 0.6,
            step: 0.1,
            signal: darkenAmount
        },
        {
            label: "Brighten",
            action: $(() => applyEffect(`brightness(${brightenAmount.value})`)),
            rangeStart: 1.4,
            rangeEnd: 1.8,
            step: 0.1,
            signal: brightenAmount
        },
        {
            label: "Hue",
            action: $(() => applyEffect(`hue-rotate(${hueAmount.value}deg)`)),
            rangeStart: 0,
            rangeEnd: 360,
            step: 1,
            signal: hueAmount
        },
        {
            label: "Sepia",
            action: $(() => applyEffect(`sepia(${sepiaAmount.value}%)`)),
            rangeStart: 0,
            rangeEnd: 100,
            step: 1,
            signal: sepiaAmount
        },
        {
            label: "Saturate",
            action: $(() => applyEffect(`saturate(${saturateAmount.value}%)`)),
            rangeStart: 0,
            rangeEnd: 200,
            step: 1,
            signal: saturateAmount
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
                        strokeSize.value = parseFloat(target.value);
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
            <div class="flex flex-row flex-wrap border-b border-slate-400 pb-1 mb-1">
                {controlButtons.map((button, index) => {
                    return (
                        <div class="w-full px-1 mb-1 flex flex-col" key={index}>
                            <div class="flex justify-between">
                                <label for={button.label} class="text-xs w-1/2 mx-1">
                                    {button.label}
                                </label>
                                <p class="text-xs mr-14">
                                    {button.signal.value}
                                </p>
                            </div>
                            <div class="flex flex-row w-full">
                                <input
                                    type="range"
                                    min={button.rangeStart}
                                    max={button.rangeEnd}
                                    name={button.label}
                                    step={button.step}
                                    value={button.signal.value}
                                    onChange$={$((event: Event) => {
                                        const target = event.target as HTMLInputElement;
                                        button.signal.value = parseFloat(target.value);
                                    })}
                                    class="w-2/3 mx-1" />
                                
                                <button
                                    preventdefault:click
                                    onClick$={button.action}
                                    class="w-fit px-1 text-xs border border-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-all">
                                    Apply
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div class="w-full px-1 mt-1 flex flex-row">
                <button
                    preventdefault:click
                    onClick$={resetImage}
                    class="w-1/2 px-2 mr-1 text-xs border border-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-all">
                    Reset
                </button>
                <button
                    preventdefault:click
                    onClick$={downloadImage}
                    class="w-1/2 px-2 ml-1 text-xs border border-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-all">
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
