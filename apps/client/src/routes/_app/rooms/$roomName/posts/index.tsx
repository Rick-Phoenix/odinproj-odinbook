import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/rooms/$roomName/posts/')({
  component: RouteComponent,
  beforeLoad: (ctx) => {
    const { room } = ctx.params
    throw redirect({
      to: '/rooms/$room',
      params: { room },
    })
  },
})

function RouteComponent() {
  return <div></div>
}
