import { $, sync$, component$, useContext } from "@builder.io/qwik";
import { StoreContext } from "~/utils/store";
export interface UploadProps {

}

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

export const Upload = component$<UploadProps>(() => {
    // Drag over needs to be defined for drop to fire.
    const onDragOver = $(() => {});
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
                    })
                ]}
                onDragOver$={onDragOver}
                class="w-full border border-slate-400 p-2 flex flex-col justify-center">
                <h2 class="text-2xl text-center">
                        Drop an image here to edit
                </h2>
            </div>
            <img class="border border-slate-400 block" src={imageSrc.value} width={375} height={300} />
        </div>
    );
});
