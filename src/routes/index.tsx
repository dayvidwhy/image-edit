import { component$, useContextProvider, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Editor } from "../components/Editor/Editor";
import { Uploader } from "../components/Uploader/Uploader";
import { Controls } from "../components/Controls/Controls";
import { StoreContext } from "../utils/store";

export default component$(() => {
    const editorRef = useSignal<HTMLDivElement>();
    useContextProvider(StoreContext, {
        imageSrc: useSignal(""),
        imageWidth: useSignal(0),
        imageHeight: useSignal(0),
        strokeSize: useSignal(10),
        strokeColor: useSignal("#000"),
        canvasRef: useSignal(),
        editorRef
    });
    return (
        <div class="flex flex-row h-full">
            <div class="w-48 overflow-y-auto border-r border-slate-400">
                <Controls />
                <div class="mx-2">
                    <Uploader />
                </div>
            </div>
            <div ref={editorRef} class="flex-1 overflow-auto bg-slate-100">
                <div class="mt-2 ml-2">
                    <Editor />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Image Edit",
    meta: [
        {
            name: "description",
            content: "In browser image editing.",
        },
    ],
};
