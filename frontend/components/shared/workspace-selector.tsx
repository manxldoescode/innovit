'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface WorkspaceSelectorProps {
  currentTeamId: string
  currentTeamName: string
}

/**
 * Simplified sidebar header for this project.
 * Replaces the workspace dropdown with a "Monitor / Reports" flip-style toggle.
 */
export function WorkspaceSelector(_: WorkspaceSelectorProps) {
  const [activeTab, setActiveTab] = useState<'monitor' | 'reports'>('reports')

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Product name */}
      <div className="flex items-center gap-2 px-2">
        <div className="font-semibold text-lg">AutoSight</div>
      </div>

      {/* Monitor / Reports segmented control */}
      <div className="w-full px-2">
        <div className="flex items-center bg-muted/50 rounded-full p-1">
          <button
            type="button"
            onClick={() => setActiveTab('monitor')}
            className={cn(
              'flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              activeTab === 'monitor'
                ? 'bg-background text-foreground shadow-[0_0_20px_rgba(0,0,0,0.6)]'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Monitor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={cn(
              'flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              activeTab === 'reports'
                ? 'bg-primary text-primary-foreground shadow-[0_0_25px_rgba(168,85,247,0.8)]'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Reports
          </button>
        </div>
      </div>
    </div>
  )
}

