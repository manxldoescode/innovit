"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import IconSquareChartLine from "@/components/ui/IconSquareChartLine";
import IconMsgs from "@/components/ui/IconMsgs";
import IconUsers from "@/components/ui/IconUsers";
import IconFiles from "@/components/ui/IconFiles";
import IconGearKeyhole from "@/components/ui/IconGearKeyhole";
import IconDocFolder from "@/components/ui/IconDocFolder";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter, usePathname } from "next/navigation";
import { DashboardLoader } from "@/components/ui/dashboard-loader";
import { WorkspaceSelector } from "@/components/shared/workspace-selector";
import { ApiKeyDialog } from "@/components/shared/api-key-dialog";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AIChatbot } from "@/components/ai/ai-chatbot";

function useSegment(basePath: string) {
  const path = usePathname();
  const result = path.slice(basePath.length, path.length);
  return result ? result : "/";
}

type NavigationItem = {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  type: "item" | "label";
  action?: () => void;
};

type Stream = {
  id: string;
  name: string;
  url: string;
  prompt: string;
  intervalSeconds: number;
  active: boolean;
};

// For this project we don't show a second-level navigation list in the sidebar.
// The main content area already contains the monitoring UI (Start/Stop, streams, etc),
// so we return an empty array here to hide the Issues/Projects/Management/People/API Key items.
const navigationItems = (_openApiKeyDialog: () => void): NavigationItem[] => [];

function HeaderBreadcrumb({
  items,
  baseBreadcrumb,
  basePath,
}: {
  items: NavigationItem[];
  baseBreadcrumb?: { title: string; href: string }[];
  basePath: string;
}) {
  const segment = useSegment(basePath);
  const item = items.find(
    (item) => item.type === "item" && item.href === segment,
  );
  const title: string | undefined = item?.name;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {baseBreadcrumb
          ?.map((item, index) => [
            <BreadcrumbItem key={`item-${index}`}>
              <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>,
            <BreadcrumbSeparator key={`separator-${index}`} />,
          ])
          .flat()}
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function AppSidebar({
  items,
  basePath,
  sidebarTop,
}: {
  items: NavigationItem[];
  basePath: string;
  sidebarTop?: React.ReactNode;
}) {
  const [streamName, setStreamName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [detectionPrompt, setDetectionPrompt] = useState("");
  const [intervalSeconds, setIntervalSeconds] = useState("30");
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: "demo-1",
      name: "Front Entrance",
      url: "rtmp://example.com/stream1",
      prompt: "Person detection",
      intervalSeconds: 30,
      active: true,
    },
  ]);
  const [allRunning, setAllRunning] = useState(true);

  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamName.trim() || !streamUrl.trim()) return;

    // Persist the most recently added stream URL so the main dashboard
    // can read it and display the video placeholder.
    if (typeof window !== "undefined") {
      localStorage.setItem("autosight_active_stream_url", streamUrl.trim());
    }

    setStreams((prev) => [
      {
        id: `stream-${Date.now()}`,
        name: streamName.trim(),
        url: streamUrl.trim(),
        prompt: detectionPrompt.trim(),
        intervalSeconds: Number(intervalSeconds) || 30,
        active: allRunning,
      },
      ...prev,
    ]);

    setStreamName("");
    setStreamUrl("");
    setDetectionPrompt("");
    setIntervalSeconds("30");
  };

  const handleStartAll = () => {
    setAllRunning(true);
    setStreams((prev) => prev.map((s) => ({ ...s, active: true })) as Stream[]);
    // Mark streams as active; you can later hook this into your player logic.
  };

  const handleStopAll = () => {
    setAllRunning(false);
    setStreams((prev) => prev.map((s) => ({ ...s, active: false })) as Stream[]);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        {sidebarTop}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="space-y-4 p-3">
              {/* Start / Stop controls */}
              <div className="flex items-center gap-2">
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full"
                  size="sm"
                  onClick={handleStartAll}
                >
                  Start All
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full"
                  size="sm"
                  onClick={handleStopAll}
                >
                  Stop All
                </Button>
              </div>

              {/* Add New Stream */}
              <Card className="bg-card/90 border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Add New Stream
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <form className="space-y-3" onSubmit={handleAddStream}>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Stream Name
                      </Label>
                      <Input
                        placeholder="e.g. Main Door"
                        value={streamName}
                        onChange={(e) => setStreamName(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Stream URL
                      </Label>
                      <Input
                        placeholder="URL (0 for Webcam)"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Detection Prompt
                      </Label>
                      <Input
                        placeholder="e.g. Person detection"
                        value={detectionPrompt}
                        onChange={(e) => setDetectionPrompt(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Interval (seconds)
                      </Label>
                      <Input
                        type="number"
                        min={5}
                        step={1}
                        value={intervalSeconds}
                        onChange={(e) => setIntervalSeconds(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full text-xs py-2"
                    >
                      + Add Stream
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Previous Streams */}
              <Card className="bg-card/90 border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Previous streams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {streams.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No streams added yet.
                    </p>
                  ) : (
                    streams.map((stream) => (
                      <div
                        key={stream.id}
                        className="relative rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium text-foreground">
                              {stream.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground break-all">
                              {stream.url}
                            </div>
                          </div>
                          <span
                            className={`mt-1 h-2 w-2 rounded-full ${
                              stream.active ? "bg-emerald-400" : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Link
          href="https://github.com/manxldoescode/innovit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Proudly Open Source</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function Layout(props: { children: React.ReactNode }) {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const params = useParams<{ teamId: string }>();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // For the special "demo" workspace, don't call the teams API or database
    if (params.teamId === "demo") {
      setTeam({
        id: "demo",
        name: "Demo Workspace",
        displayName: "Demo Workspace",
      });
      setLoading(false);
      setIsRedirecting(false);
      return;
    }

    // Fetch team data from API for real team IDs
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/teams");
        if (response.ok) {
          const teams = await response.json();
          const currentTeam = teams.find((t: any) => t.id === params.teamId);
          if (currentTeam) {
            setTeam(currentTeam);
            setLoading(false);
          } else {
            // If team not found, redirect to dashboard immediately
            setIsRedirecting(true);
            setLoading(false);
            router.replace("/dashboard");
            return; // Exit early to prevent rendering
          }
        } else {
          // If response not ok, redirect to dashboard
          setIsRedirecting(true);
          setLoading(false);
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching team:", error);
        setLoading(false);
        setIsRedirecting(true);
        // Redirect to dashboard on error
        router.replace("/dashboard");
      }
    };
    fetchTeam();
  }, [params.teamId, router]);

  // Detect if user is on Mac
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Add Cmd+K (Mac) or Ctrl+K (Windows/Linux) shortcut to open chatbot
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        // Don't trigger if user is typing in an input, textarea, or contenteditable
        const target = event.target as HTMLElement;
        const isInputElement =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;

        if (!isInputElement) {
          event.preventDefault();
          setChatbotOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  // Don't render anything if redirecting
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DashboardLoader message="Redirecting..." submessage="Team not found" />
      </div>
    );
  }

  // Show loading while team is being fetched
  if (loading || !team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DashboardLoader
          message="Loading team"
          submessage="Fetching team data..."
        />
      </div>
    );
  }

  const items = navigationItems(() => setApiKeyDialogOpen(true));
  const basePath = `/dashboard/${team.id}`;
  const baseBreadcrumb = [
    {
      title: team.displayName || team.name,
      href: basePath,
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar
        items={items}
        basePath={basePath}
        sidebarTop={
          <WorkspaceSelector
            currentTeamId={team.id}
            currentTeamName={team.name}
          />
        }
      />
      <SidebarInset className="overflow-x-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-10">
          <div className="flex items-center justify-between h-full px-6">
            {/* Left side - Sidebar trigger + Breadcrumb */}
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <HeaderBreadcrumb
                baseBreadcrumb={baseBreadcrumb}
                basePath={basePath}
                items={items}
              />
            </div>

            {/* Right side - Chatbot Button + User Button */}
            <div className="flex items-center gap-2">
              {session?.user && (
                <>
                  {/* AI Chatbot Button */}
                  <div className="border border-border/80 rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setChatbotOpen(true)}
                        className="relative"
                        title={`Open AutoSight AI (${isMac ? "⌘" : "Ctrl"}+K)`}
                      >
                        <IconMsgs className="h-8 w-8" />
                      </Button>
                      <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-muted/50 px-2 font-mono text-[11px] font-medium text-muted-foreground opacity-100 whitespace-nowrap shadow-sm">
                        <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
                      </kbd>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={session.user.image || undefined}
                            alt={session.user.name || ""}
                          />
                          <AvatarFallback>
                            {session.user.name?.charAt(0)?.toUpperCase() ||
                              session.user.email?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-background">
          <div className="px-6 py-6 h-full overflow-auto">{props.children}</div>
        </main>
      </SidebarInset>

      {/* AI Chatbot Sheet */}
      <Sheet open={chatbotOpen} onOpenChange={setChatbotOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
          {team?.id && <AIChatbot teamId={team.id} />}
        </SheetContent>
      </Sheet>

      {/* API Key Dialog */}
      <ApiKeyDialog
        open={apiKeyDialogOpen}
        onOpenChange={setApiKeyDialogOpen}
      />
    </SidebarProvider>
  );
}
