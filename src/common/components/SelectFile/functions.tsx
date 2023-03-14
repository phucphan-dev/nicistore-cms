import { useEffect, useState } from 'react';
import {
  DraggableLocation, DraggingStyle, Droppable, DroppableProps, NotDraggingStyle
} from 'react-beautiful-dnd';

/**
 * Reorder item in one list
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

/**
 * Moves an item from one list to another list.
 */
export function move<T>(
  source: T[],
  destination: T[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: {
    [x: string]: T[];
  } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
}

/**
 * Workaround component for React 18 StrictMode.
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

/**
 * Style for draggable components.
 */
export const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'whitesmoke' : 'transparent',
});

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
) => ({
  // change style if dragging
  boxShadow: isDragging ? 'rgba(#000, 0.1) 0 1px 4px' : 'none',
  // styles we need to apply on draggables
  ...draggableStyle,
});
