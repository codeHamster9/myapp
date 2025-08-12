import { FlightTicket } from '@/components/flight-ticket'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="space-y-6">
        <FlightTicket
          origin="TLV"
          destination="Rome"
          status="ontime"
          carrier="American Airlines HG405"
          dateTime="12/08/2025 16:20"
        />

        <FlightTicket
          origin="JFK"
          destination="London"
          status="delayed"
          carrier="British Airways BA178"
          dateTime="12/08/2025 18:45"
        />

        <FlightTicket
          origin="LAX"
          destination="Tokyo"
          status="canceled"
          carrier="Japan Airlines JL061"
          dateTime="12/08/2025 22:30"
        />
      </div>
    </div>
  )
}
