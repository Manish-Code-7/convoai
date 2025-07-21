"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

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
      <h2 className="text-xl font-semibold mb-4">Agents</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
