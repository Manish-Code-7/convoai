"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [filters,setFilters]=useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    ...filters
  }));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
     <DataTable
     data={data.items} 
     columns={columns}
     onRowClick={(row) => {router.push(`/agents/${row.id}`)}}
     />  
     <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters ({page})}
     />
     {data.items.length === 0 && (
      <EmptyState
      title="Create your first agent"
      description="Create an agent to join your meetings. Each Agent will follow your instructions and 
      you can interact with participants duroing the call" />
     )}
    </div> 
  );
};
