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
        imageWidth: useSignal(""),
        imageHeight: useSignal(""),
        strokeSize: useSignal(10),
        strokeColor: useSignal("#000"),
        canvasRef: useSignal(),
        editorRef
    });
    return (
        <div class="flex flex-row h-full">
            <div class="w-48 mr-2 overflow-y-auto border-r border-slate-400">
                <Controls />
                <Uploader />
            </div>
            <div ref={editorRef} class="flex-1 overflow-auto">
                <div class="mt-2">
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
