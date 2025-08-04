interface HpBarProps {
  hp: number
  maxHp: number
}
export function HpBar({ hp, maxHp }: HpBarProps) {
  if (hp < 0) hp = 0
  const percent = (hp / maxHp) * 100
  const barColor = hp < maxHp * 0.2 ? '#ef4444' : undefined
  return (
    <div className="mt-2">
      <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
      <p className="text-center mt-1 text-black">
        HP: {hp}/{maxHp}
      </p>
    </div>
  )
}
