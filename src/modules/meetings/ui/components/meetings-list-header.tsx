"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meeting-search-filters";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon size={16} className="mr-2" />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
        {/* Filters Section (Single Row, Scrollable) */}
        <div className="flex items-center gap-x-3 overflow-x-auto p-2 rounded-lg bg-muted/30">
          <MeetingsSearchFilter />
          <StatusFilter />
          <AgentIdFilter />
          {isAnyFilterModified && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-shrink-0 whitespace-nowrap"
            >
              <XCircleIcon className="size-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
