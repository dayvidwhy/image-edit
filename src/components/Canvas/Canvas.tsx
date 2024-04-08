import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { StoreContext } from "~/utils/store";
import { isServer } from "@builder.io/qwik/build";

export interface CanvasProps {

}

export const Canvas = component$<CanvasProps>(() => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const imageSrc = useContext(StoreContext);
    useTask$(({ track }) => {
        track(() => imageSrc.value);
        console.log("in canvas", imageSrc.value);
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
    return (
        <div>
            <canvas class="border border-slate-400" ref={canvasRef} width={375} height={300} />
        </div>
    );
});
