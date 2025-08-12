import { Check, Clock } from 'lucide-react'

import styles from './status-indicator.module.css'

type Status = 'ontime' | 'delayed' | 'canceled'

interface StatusIndicatorProps {
  status: Status
}

const statusConfig = {
  ontime: {
    icon: Check,
    className: styles.ontime,
  },
  delayed: {
    icon: Clock,
    className: styles.delayed,
  },
  canceled: {
    icon: null,
    className: null,
  },
} as const

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status]
  const IconComponent = config.icon

  if (status === ('canceled' as const)) return null

  return (
    <div className={styles.statusContainer}>
      {IconComponent && <IconComponent className={styles.statusIcon} />}
      <span className={`${styles.statusText} ${config.className}`}>
        {status}
      </span>
    </div>
  )
}
