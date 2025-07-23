import { useDroppable } from '@dnd-kit/core'
import React from 'react'

export function Droppable({
  id = 'droppable',
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })
  const style = {
    color: isOver ? 'green' : undefined,
    height: '200px',
    border: '2px dashed gray',
    padding: '10px',
    backgroundColor: isOver ? '#f0fff4' : '#fff',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  )
}
