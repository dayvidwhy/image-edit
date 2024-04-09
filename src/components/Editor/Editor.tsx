import { $, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { StoreContext } from "~/utils/store";
import { isServer } from "@builder.io/qwik/build";

export const Editor = component$(() => {
    const imageSrc = useContext(StoreContext);

    // canvas reference
    const canvasRef = useSignal<HTMLCanvasElement>();

    // drawing style
    const strokeColor = useSignal("#000");
    const strokeSize = useSignal(10);

    // whether we are currently drawing
    const drawing = useSignal<boolean>(false);

    // as we drag the mouse, track positions to draw lines
    const previousX = useSignal(0);
    const currentX = useSignal(0);
    const previousY = useSignal(0);
    const currentY = useSignal(0);

    // Toggle on drawing
    const startDrawing = $((event: MouseEvent) => {
        if (!canvasRef.value) return;
        previousX.value = currentX.value;
        previousY.value = currentY.value;

        // work out mouse position
        currentX.value = event.clientX - canvasRef.value.offsetLeft;
        currentY.value = event.clientY - canvasRef.value.offsetTop;
    
        // start drawing
        drawing.value = true;
    });

    // Toggle off drawing
    const stopDrawing = $(() => drawing.value = false);

    // Draw lines
    const handleDrawing = $((event: MouseEvent): void => {
        if (!canvasRef.value) return;
        const canvasContext = canvasRef.value.getContext("2d");
        if (!canvasContext) return;

        // if it's pressed down, draw lines
        if (drawing.value) {
            previousX.value = currentX.value;
            previousY.value = currentY.value;
            currentX.value = event.clientX - canvasRef.value.offsetLeft;
            currentY.value = event.clientY - canvasRef.value.offsetTop;
                
            // draw
            canvasContext.beginPath();
            canvasContext.moveTo(previousX.value, previousY.value);
            canvasContext.lineTo(currentX.value, currentY.value);
            canvasContext.strokeStyle = strokeColor.value;
            canvasContext.lineWidth = strokeSize.value;
            canvasContext.stroke();
            canvasContext.closePath();
        }
    });

    // track the image source and draw it on the canvas
    useTask$(({ track }) => {
        track(() => imageSrc.value);
        if (isServer) {
            return;
        }
        const img = new Image();
        img.onload = () => {
            const ctx = canvasRef.value?.getContext("2d");
            ctx?.drawImage(img, 0, 0, 375, 300);
        };
        img.src = imageSrc.value;
    });

    // download the image
    const downloadImage = $(() => {
        canvasRef.value?.toBlob(((blob): void  => {
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
        <div class="flex justify-between border border-slate-400">
            <div class="w-full flex flex-col justify-center">
                <h2 class="text-2xl text-center w-full">
                    Edit your image here
                </h2>
                <div class="flex justify-center mt-2">
                    <button
                        preventdefault:click
                        onClick$={downloadImage}
                        class="w-fit px-2 text-lg border border-slate-400 hover:bg-slate-600 hover:text-slate-50">
                        Download
                    </button>
                </div>
            </div>
            <canvas
                class="border border-slate-400"
                ref={canvasRef}
                width={375}
                height={300}
                preventdefault:mouseup
                onMouseUp$={stopDrawing}
                preventdefault:mouseout
                onMouseOut$={stopDrawing}
                preventdefault:mousemove
                onMouseMove$={handleDrawing}
                preventdefault:mousedown
                onMouseDown$={startDrawing}
            />
        </div>
    );
});
