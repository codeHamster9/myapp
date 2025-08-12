import { ArrowRight } from 'lucide-react'

import styles from './flight-ticket.module.css'
import { StatusIndicator } from './status-indicator'

interface FlightTicketProps {
  origin: string
  destination: string
  status: 'ontime' | 'delayed' | 'canceled'
  carrier: string
  dateTime: string
}

export function FlightTicket({
  origin,
  destination,
  status,
  carrier,
  dateTime,
}: FlightTicketProps) {
  return (
    <div
      className={`${styles.ticket} ${status === 'canceled' ? styles.canceled : ''}`}
    >
      {/* Flight Route */}
      <div className={styles.routeContainer}>
        <span className={styles.airport}>{origin}</span>
        <ArrowRight className={styles.arrowIcon} />
        <span className={styles.airport}>{destination}</span>

        <StatusIndicator status={status} />
      </div>

      {/* Flight Details */}
      <div className={styles.carrier}>{carrier}</div>

      {/* Date and Time */}
      <div className={styles.dateTime}>{dateTime}</div>
    </div>
  )
}
