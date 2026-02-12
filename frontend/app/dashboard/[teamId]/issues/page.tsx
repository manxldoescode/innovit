"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Simplified main dashboard view for AutoSight.
 * Shows a "video player" style area where your live stream or video
 * will appear. The selected stream URL is read from localStorage key
 * "autosight_active_stream_url", which is set from the sidebar form.
 */
export default function LiveMonitorPage() {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = localStorage.getItem("autosight_active_stream_url");
      if (url) {
        setStreamUrl(url);
      }
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Soft animated background for the video area */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-slate-900/80" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl px-4 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Live Monitor
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Paste your stream URL in the sidebar. Your live video or recording will
            appear here once you wire it up to a real player.
          </p>
        </div>

        <Card className="bg-black/60 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.6)]">
          <CardContent className="p-0">
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-slate-900 via-black to-slate-950 flex items-center justify-center">
              {streamUrl ? (
                <p className="text-xs md:text-sm text-muted-foreground px-4 text-center">
                  Stream URL detected:
                  <br />
                  <span className="font-mono text-purple-200 break-all">
                    {streamUrl}
                  </span>
                  <br />
                  Replace this placeholder with your actual video player
                  (e.g. &lt;video&gt;, HLS player, or iframe).
                </p>
              ) : (
                <p className="text-xs md:text-sm text-muted-foreground px-4 text-center">
                  Waiting for a stream URL... Add a stream in the sidebar to connect
                  your camera or video source. This area will become your live view.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

