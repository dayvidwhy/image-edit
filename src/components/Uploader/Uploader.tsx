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
                target.setAttribute("data-preview-src", URL.createObjectURL(file));
                const fileData = item.getAsFile();
                console.log(fileData, item);
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
    const imageSrc = useContext(StoreContext);
    return (
        <div class="w-full flex justify-between">
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
                        imageSrc.value = target.getAttribute("data-preview-src")!;
                        fileDraggedOver.value = false;
                    })
                ]}
                onDragOver$={onDragOver}
                onDragLeave$={onDragLeave}
                class={`
                    rounded
                    w-full
                    border-2 border-slate-400
                    px-2 py-8
                    flex flex-col justify-center
                    ${fileDraggedOver.value ? "border-dashed bg-slate-200" : ""}
                `}
            >
                <p class="text-2xl text-center">
                    {
                        `${fileDraggedOver.value ? "Drop your image here!" : "Drag an image here to edit"}`
                    }
                </p>
            </div>
        </div>
    );
});
