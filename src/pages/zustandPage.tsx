import { Input } from '@/components/ui/input'
import { useZusterStore } from '@/store/zusterStore'

export default () => {
  const { person, updatePerson } = useZusterStore((state) => state)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'firstName' | 'lastName' | 'age',
  ) => {
    if (field === 'age') {
      updatePerson({
        ...person,
        age: parseInt(event.target.value, 10) || 0,
      })
    } else {
      updatePerson({
        ...person,
        name: { ...person.name, [field]: event.target.value },
      })
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Zustand Example</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Person Data:</h2>
          <pre className="bg-gray-100 p-4 rounded-md text-amber-600">
            {JSON.stringify(person, null, 2)}
          </pre>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2">First Name: {person.name.firstName}</p>
            <Input
              value={person.name.firstName}
              onChange={(e) => handleInputChange(e, 'firstName')}
              placeholder="Enter first name"
              className="w-full"
            />
          </div>

          <div>
            <p className="mb-2">Last Name: {person.name.lastName}</p>
            <Input
              value={person.name.lastName}
              onChange={(e) => handleInputChange(e, 'lastName')}
              placeholder="Enter last name"
              className="w-full"
            />
          </div>

          <div>
            <p className="mb-2">Age: {person.age}</p>
            <Input
              type="number"
              value={person.age}
              onChange={(e) => handleInputChange(e, 'age')}
              placeholder="Enter age"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
