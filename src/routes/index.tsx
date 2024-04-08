import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas } from "../components/Canvas/Canvas";
import { Upload } from "../components/Upload/Upload";

export default component$(() => {
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
