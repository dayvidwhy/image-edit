import { component$, useContextProvider, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas } from "../components/Canvas/Canvas";
import { Upload } from "../components/Upload/Upload";
import { StoreContext } from "../utils/store";

export default component$(() => {
    const imageSrc = useSignal("");
    useContextProvider(StoreContext, imageSrc);
    return (
        <div class="container mx-auto">
            <Canvas />
            <Upload />
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
