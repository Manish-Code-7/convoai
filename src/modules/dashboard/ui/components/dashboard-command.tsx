import { CommandResponsiveDialog, CommandInput, CommandList } from "@/components/ui/command"
import { CommandItem } from "cmdk";
import { Dispatch, SetStateAction } from "react";

interface Props{
    open:boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;

}

export const DashboardCommand = ({open,setOpen}:Props) =>{
    return(
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput 
            placeholder="Find a metting or a agent" />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}