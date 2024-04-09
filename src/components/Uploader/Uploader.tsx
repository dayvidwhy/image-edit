import { $, sync$, component$, useContext, useSignal } from "@builder.io/qwik";
import { StoreContext } from "~/utils/store";

/**
     * https://qwik.dev/tutorial/events/synchronous-sync/
     * File drop needs to be `sync$` to access the file list.
     * Since sync$ event handlers can't access state, we pass
     * out the file data using the `data-preview-src` attribute.
     */
const syncFileDropHandler = sync$(
    (ev: DragEvent, target: HTMLElement) => {
        ev.preventDefault();

        if (ev.dataTransfer?.items) {
            // Use DataTransferItemList interface
            if (ev.dataTransfer.items.length === 0 ) return;
            const item = ev.dataTransfer.items[0];
            if (item.kind === "file") {
                const file = ev.dataTransfer.files[0];
                const imageUrl = URL.createObjectURL(file);
                target.setAttribute("data-preview-src", imageUrl);
                const fileData = item.getAsFile();
                console.log(file, item, fileData);

                // get image dimensions
                const img = new Image();
                img.onload = function() {
                    target.setAttribute("data-preview-width", img.width + "");
                    target.setAttribute("data-preview-height", img.height + "");
                };
                img.src = imageUrl;
            }
        } else if (ev.dataTransfer?.files) {
            // Otherwise use DataTransfer interface
            if (ev.dataTransfer.files.length === 0 ) return;
            const file = ev.dataTransfer.files[0];
            target.setAttribute("data-preview-src", URL.createObjectURL(file));
        }
    }
);

export const Uploader = component$(() => {
    // Drag over needs to be defined for drop to fire.
    const fileDraggedOver = useSignal<boolean>(false);
    const onDragOver = $(() => {
        fileDraggedOver.value = true;
    });
    const onDragLeave = $(() => {
        fileDraggedOver.value = false;
    });
    const { imageSrc, imageHeight, imageWidth } = useContext(StoreContext);
    return (
        <div
            /** https://qwik.dev/tutorial/events/preventdefault/ */
            preventdefault:dragover
            data-preview-src={imageSrc.value}
            onDrop$={[
                syncFileDropHandler,
                /**
                 * Runs after the sync$ event handler.
                 * At this stage the attribute is updated so we can
                 * update the previews image src.
                 */
                $(function asyncFileDropHandler(ev, target) {
                    imageHeight.value = target.getAttribute("data-preview-height")!;
                    imageWidth.value = target.getAttribute("data-preview-width")!;
                    imageSrc.value = target.getAttribute("data-preview-src")!;
                    fileDraggedOver.value = false;
                })
            ]}
            onDragOver$={onDragOver}
            onDragLeave$={onDragLeave}
            class={`
                    w-full
                    border border-slate-400
                    px-2 py-8
                    flex flex-col justify-center
                    ${fileDraggedOver.value ? "border-dashed border-2 bg-slate-200" : ""}
                `}
        >
            <p class="text-lg text-center text-slate-600">
                {
                    `${fileDraggedOver.value ? 
                        "Drop your image here!" : 
                        "Drag an image here to edit"
                    }`
                }
            </p>
        </div>
    );
});
