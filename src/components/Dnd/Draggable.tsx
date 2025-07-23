import { useDraggable } from '@dnd-kit/core'
import React from 'react'

export function Draggable({
  id = 'draggable',
  disabled = false,
  children,
}: {
  id?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    disabled: disabled,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}
