import { SidebarProvider } from "@/components/ui/sidebar";
import { Dashboardsidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props{
    children: React.ReactNode;
}
const Layout = ({children}: Props) => {
    return(
      <SidebarProvider>
        <Dashboardsidebar/>
        <main className="flex flex-col h-screen">
        {children}
        </main>      
      </SidebarProvider>
    )
}

export default Layout;