import { component$, useContextProvider, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Editor } from "../components/Editor/Editor";
import { Uploader } from "../components/Uploader/Uploader";
import { StoreContext } from "../utils/store";

export default component$(() => {
    const imageSrc = useSignal("");
    useContextProvider(StoreContext, imageSrc);
    return (
        <div class="container mx-auto flex flex-col mt-4">
            <div class="mt-2">
                <Editor />
            </div>
            <div class="mt-2">
                <Uploader />
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
