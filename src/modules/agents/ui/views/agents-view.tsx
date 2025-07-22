"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
// import { ResponsiveDialog } from "@/components/responsive-dialog";
// import { Button } from "@/components/ui/button";

// Loading state component
export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

// Error state component
export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Failed to Load Agents"
      description="Something went wrong. Please try again later."
    />
  );
};

// Main view
export const AgentView = () => {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(
    trpc.agents.getMany.queryOptions()
  );

  if (isLoading) return <AgentsViewLoading />;
  if (isError) return <AgentsViewError />;

  return (
    <div className="p-4">
      {/* <ResponsiveDialog 
          title="Responsive test "
          description="Responsive description"
          open
          onOpenChange={()=>{}}>
        <Button>
          Some action
        </Button>
      </ResponsiveDialog>  */}

        {JSON.stringify(data, null, 2)}    
    </div> 
  );
};
