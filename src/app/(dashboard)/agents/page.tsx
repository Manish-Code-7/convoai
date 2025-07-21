import { getQueryClient, trpc } from "@/trpc/server";
import {
  AgentView,
  AgentsViewLoading,
  AgentsViewError
} from "@/modules/agents/ui/views/agents-view";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
  const queryClient = getQueryClient();

  // Prefetch data for hydration
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
