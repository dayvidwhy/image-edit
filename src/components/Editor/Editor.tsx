import { $, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { StoreContext } from "~/utils/store";
import { isServer } from "@builder.io/qwik/build";

export const Editor = component$(() => {
    const { imageSrc, imageWidth, imageHeight, strokeColor, strokeSize, canvasRef, editorRef } = useContext(StoreContext);

    // whether we are currently drawing
    const drawing = useSignal<boolean>(false);

    // as we drag the mouse, track positions to draw lines
    const previousX = useSignal(0);
    const currentX = useSignal(0);
    const previousY = useSignal(0);
    const currentY = useSignal(0);

    // Toggle on drawing
    const startDrawing = $((event: MouseEvent) => {
        previousX.value = currentX.value;
        previousY.value = currentY.value;

        // work out mouse position
        currentX.value = event.clientX - canvasRef.value.offsetLeft + editorRef.value.scrollLeft;
        currentY.value = event.clientY - canvasRef.value.offsetTop + editorRef.value.scrollTop;
    
        // start drawing
        drawing.value = true;
    });

    // Toggle off drawing
    const stopDrawing = $(() => drawing.value = false);

    // Draw lines
    const handleDrawing = $((event: MouseEvent): void => {
        const canvasContext = canvasRef.value.getContext("2d");
        if (!canvasContext) return;

        // if it's pressed down, draw lines
        if (drawing.value) {
            previousX.value = currentX.value;
            previousY.value = currentY.value;
            currentX.value = event.clientX - canvasRef.value.offsetLeft + editorRef.value.scrollLeft;
            currentY.value = event.clientY - canvasRef.value.offsetTop + editorRef.value.scrollTop;
                
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
            const ctx = canvasRef.value.getContext("2d");
            imageWidth.value = img.width;
            imageHeight.value = img.height;
            canvasRef.value.width = imageWidth.value;
            canvasRef.value.height = imageHeight.value;
            requestAnimationFrame(() => {
                ctx?.drawImage(img, 0, 0, imageWidth.value, imageHeight.value);
            });
        };
        img.src = imageSrc.value;
    });

    return (
        <canvas
            class="border border-slate-400 cursor-crosshair shadow-xl"
            ref={canvasRef}
            width={imageWidth.value}
            height={imageHeight.value}
            preventdefault:mouseup
            onMouseUp$={stopDrawing}
            preventdefault:mouseout
            onMouseOut$={stopDrawing}
            preventdefault:mousemove
            onMouseMove$={handleDrawing}
            preventdefault:mousedown
            onMouseDown$={startDrawing}
        />
    );
});
