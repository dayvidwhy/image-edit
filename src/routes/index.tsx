import { component$, useContextProvider, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas } from "../components/Canvas/Canvas";
import { Upload } from "../components/Upload/Upload";
import { StoreContext } from "../utils/store";

export default component$(() => {
    const imageSrc = useSignal("");
    useContextProvider(StoreContext, imageSrc);
    return (
        <div class="container mx-auto flex flex-col mt-4">
            <div class="mt-2">
                <Canvas />
            </div>
            <div class="mt-2">
                <Upload />
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
