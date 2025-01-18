import { createFileRoute, Outlet } from '@tanstack/react-router'
import SidebarWrapper from '../../app/dashboard/Sidebar'

export const Route = createFileRoute('/_auth/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SidebarWrapper>
        <Outlet />
      </SidebarWrapper>
    </>
  )
}
