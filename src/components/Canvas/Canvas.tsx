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
        <div class="flex justify-between border border-slate-400">
            <div class="w-full flex flex-col justify-center">
                <h2 class="text-2xl text-center w-full">
                    Edit your image here
                </h2>
            </div>
            <canvas class="border border-slate-400" ref={canvasRef} width={375} height={300} />
        </div>
    );
});
