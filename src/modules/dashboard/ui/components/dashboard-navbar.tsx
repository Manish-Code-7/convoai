"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
    const {state, toggleSidebar, isMobile} =useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);
    useEffect (()=>{
        const down =(e:KeyboardEvent) =>{
            if(e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setCommandOpen((open)=> !open)
            }
        };
        document.addEventListener("keydown", down);
        return()=>document.removeEventListener("keydown",down);
    },[]);
    return(
        <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <nav className="flex px-4 gap-x-2 items-center py-3 border-3 bg-background">
                <Button className="size-9" variant="outline" onClick={toggleSidebar}>
                    {(state === "collapsed" || isMobile) 
                    ? <PanelLeftIcon className="size-4"/> :
                    <PanelLeftCloseIcon className="size-4" />
                    }
                </Button>
                <Button 
                className="h-9 w-[240px] justify-start font-normal text-muted-foreground
                hover:text-muted-foreground "
                variant='outline'
                size="sm"
                onClick={()=>setCommandOpen((open) => !open)}>
                    <SearchIcon />
                        Search
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border
                        bg-muted px-1.5 font-mono text-[10px0 font font-medium text-muted-foreground">
                            <span className="text-xs">&#8984;</span>k
                        </kbd>
                </Button>
            </nav>
        </>
    )
} 