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

        // leave early if no items present
        if (ev.dataTransfer?.items.length === 0 || ev.dataTransfer?.files.length === 0) {
            return;
        }
    
        if (ev.dataTransfer?.items) {
            // Use DataTransferItemList interface
            const item = ev.dataTransfer.items[0];
            if (item.kind === "file") {
                const file = ev.dataTransfer.files[0];
                target.setAttribute("data-preview-src", URL.createObjectURL(file));
                const fileData = item.getAsFile();
                console.log(fileData, item);
            }
        } else if (ev.dataTransfer?.files) {
            // Otherwise use DataTransfer interface
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
        <>
            <img src={imageSrc.value} width={200} height={200} />
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
                class="w-48 h-28 border-dotted border">
                Upload
            </div>
        </>
    );
});
