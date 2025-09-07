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
  return (
    <div 
      ref={setNodeRef} 
      className={`border-2 border-dashed p-2 rounded-lg transition-all ${
        isOver 
          ? 'border-green-400 bg-green-50 dark:bg-green-950 shadow-lg shadow-green-400/20' 
          : 'border-border bg-card'
      }`}
    >
      {children}
    </div>
  )
}
