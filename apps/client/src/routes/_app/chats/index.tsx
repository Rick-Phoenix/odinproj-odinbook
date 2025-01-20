import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/chats/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>chats</div>
}
