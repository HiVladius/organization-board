import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
// import {CSS} from '@dnd-kit/utilities';

export const Testpage = () => {
    const container = ["A", "B", "C"];

    const [parent, setParent] = useState(null);
    const draggableMarkup = <Draggable>Drag me</Draggable>;

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {parent === null ? draggableMarkup : null}

            {container.map((id) => (
                <Droppable key={id} id={id}>
                    {parent === id ? draggableMarkup : "Drop here"}
                </Droppable>
            ))}
        </DndContext>
    );

    function handleDragEnd(event: any) {
        const { over } = event;
        setParent(over ? over.id : null);
    }
};

const Droppable = (props: any) => {
    const { isOver, setNodeRef } = useDroppable({
        id: "droppable",
    });
    const style = {
        color: isOver ? "green" : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
};
const Draggable = (props: any) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: "draggable",
    });
    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
};
