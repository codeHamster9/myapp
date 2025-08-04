import { Input } from '@/components/ui/input'
import { useZusterStore } from '@/store/zusterStore'

export default () => {
  const { name, setName } = useZusterStore((state) => state)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Zustand Example</h1>
      <p className="mb-2">Current Name: {name}</p>
      <Input
        value={name}
        onChange={handleChange}
        placeholder="Enter your name"
        className="w-full"
      />
    </div>
  )
}
