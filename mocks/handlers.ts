import { http, HttpResponse } from 'msw'

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const handlers = [
  http.get('http://localhost:3000/api/doclist', async () => {
    const data: DocList = [
      { name: 'React', url: 'https://react.dev/' },
      { name: 'Vite', url: 'https://vitejs.dev/' },
      {
        name: 'React Router',
        url: 'https://reactrouter.com/en/main/start/overview',
      },
      { name: 'MSW', url: 'https://mswjs.io/' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' },
    ]

    await sleep(2000)

    return HttpResponse.json(data)
  }),
  http.get(
    'nzfbnmwahjgduwqtelhy.supabase.co/rest/v1/pokemon_data?select=*&room_code=eq.LC47MB',
    async () => {
      const data = [
        {
          id: 934,
          room_code: 'VUEM5F',
          user_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          pokemon_id: 37,
          hp: 38,
          max_hp: 38,
          selected_moves: [
            {
              pp: 15,
              name: 'headbutt',
              type: 'normal',
              power: 70,
              accuracy: 100,
            },
            {
              pp: 35,
              name: 'tackle',
              type: 'normal',
              power: 40,
              accuracy: 100,
            },
            {
              pp: 15,
              name: 'body-slam',
              type: 'normal',
              power: 85,
              accuracy: 100,
            },
            {
              pp: 20,
              name: 'take-down',
              type: 'normal',
              power: 90,
              accuracy: 85,
            },
            {
              pp: 15,
              name: 'double-edge',
              type: 'normal',
              power: 120,
              accuracy: 100,
            },
            {
              pp: 30,
              name: 'tail-whip',
              type: 'normal',
              power: null,
              accuracy: 100,
            },
          ],
          created_at: '2025-09-15T12:41:47.995578+00:00',
          updated_at: '2025-09-15T12:41:46.615+00:00',
        },
      ]
      await sleep(2000)

      return HttpResponse.json(data)
    },
  ),
]
