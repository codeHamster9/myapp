import { motion, AnimatePresence } from 'motion/react'

import { Draggable } from '@/components/Dnd/Draggable'

import type { Move } from '../types/pokemon'

import { MoveButton } from './MoveButton'

interface MoveButtonsProps {
  moves: Move[]
  pokemonId: number
  onClick: (move: Move) => void
  isVisible: boolean
  onRandomSelectAll: () => void
}

export function PokemonAvailableMoves({
  moves,
  pokemonId,
  onClick,
  isVisible,
  onRandomSelectAll,
}: MoveButtonsProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-4 border rounded-lg bg-white shadow-md p-4 min-h-20"
        >
          <button
            onClick={onRandomSelectAll}
            className="w-full mb-3 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors font-medium"
          >
            Random Select All
          </button>
          <div className="grid grid-cols-2 gap-2 gap-y-2">
            {moves.map((move, index) => (
              <motion.div
                key={`-${pokemonId}-${move.name}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Draggable id={`${move.name}`}>
                  <MoveButton
                    move={move}
                    onDoubleClick={onClick}
                    draggable={true}
                  />
                </Draggable>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
