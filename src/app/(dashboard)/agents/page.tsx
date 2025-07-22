import { getQueryClient, trpc } from "@/trpc/server";
import {
  AgentView,
  AgentsViewLoading,
  AgentsViewError
} from "@/modules/agents/ui/views/agents-view";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";
interface Props{
  searchParams: Promise<SearchParams>
};
const Page = async ({searchParams}:Props) => {
  const filters  = await loadSearchParams(searchParams);
  const session= await auth.api.getSession({
    headers: await headers(),
  });
  if(!session){
    redirect("/sign-in")
  }
  const queryClient = getQueryClient();

  // Prefetch data for hydration
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...filters
  }));

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
              <AgentView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
