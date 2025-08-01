"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * EmptyState component displays a message when there is no content to show
 * It can include an icon, title, description, and action button
 */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-8">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-4 max-w-md">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
