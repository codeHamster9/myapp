import { useDndContext } from '@dnd-kit/core'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import type { Move } from '../types/pokemon'

interface MoveButtonProps {
  move: Move
  onClick?: (move: Move) => void
  onDoubleClick?: (move: Move) => void
  disabled?: boolean
  className?: string
  draggable?: boolean
}

export function MoveButton({
  move,
  onClick,
  onDoubleClick,
  disabled = false,
  className = '',
  draggable = false,
}: MoveButtonProps) {
  const { active, over } = useDndContext()
  const isDragging = active?.id === move.name
  const isHoveringDropZone =
    isDragging && over && over.id.toString().startsWith('moves-')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onClick?.(move)}
            onDoubleClick={() => onDoubleClick?.(move)}
            disabled={disabled}
            className={`h-9 w-full px-2 py-1 rounded capitalize transition-all text-white shadow-lg border-b-4 ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed border-gray-600'
                : draggable
                  ? `bg-gray-500 hover:bg-gray-600 border-gray-800 hover:-translate-y-0.5 hover:shadow-xl active:border-b-2 active:translate-y-1 ${
                      isHoveringDropZone
                        ? 'shadow-2xl shadow-green-400/50 ring-2 ring-green-400'
                        : ''
                    }`
                  : 'bg-blue-500 hover:bg-blue-600 border-blue-700 hover:-translate-y-0.5 hover:shadow-xl active:border-b-2 active:translate-y-0.5'
            } ${className}`}
          >
            {move.name} {draggable && move.power ? `(${move.power})` : ''}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-semibold">{move.name}</div>
            <div>Power: {move.power || 'N/A'}</div>
            <div>Accuracy: {move.accuracy || 'N/A'}%</div>
            <div>Type: {move.type?.name || 'Normal'}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
