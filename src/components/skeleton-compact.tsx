import { cn } from "@/lib/utils"

interface FormSkeletonProps {
  className?: string
  fields?: number
  showSubmitButton?: boolean
  showTitle?: boolean
  variant?: "default" | "compact" | "detailed"
}

export function FormSkeleton({
  className,
  fields = 4,
  showSubmitButton = true,
  showTitle = true,
  variant = "default",
}: FormSkeletonProps) {
  const getFieldHeight = () => {
    switch (variant) {
      case "compact":
        return "h-8"
      case "detailed":
        return "h-12"
      default:
        return "h-10"
    }
  }

  const getSpacing = () => {
    switch (variant) {
      case "compact":
        return "space-y-3"
      case "detailed":
        return "space-y-6"
      default:
        return "space-y-4"
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Title skeleton */}
      {showTitle && (
        <div className="mb-6">
          <div className="h-8 bg-muted rounded-md w-3/4 animate-pulse" />
          {variant === "detailed" && <div className="h-4 bg-muted rounded-md w-full mt-2 animate-pulse" />}
        </div>
      )}

      {/* Form fields skeleton */}
      <div className={cn("space-y-4", getSpacing())}>
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            {/* Label skeleton */}
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />

            {/* Input skeleton */}
            <div className={cn("bg-muted rounded-md animate-pulse", getFieldHeight())} />

            {/* Helper text skeleton (only for some fields) */}
            {variant === "detailed" && index % 2 === 0 && (
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse opacity-60" />
            )}
          </div>
        ))}

        {/* Checkbox/Radio skeleton (optional) */}
        {variant !== "compact" && (
          <div className="flex items-center space-x-2 pt-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        )}

        {/* Submit button skeleton */}
        {showSubmitButton && (
          <div className="pt-4">
            <div className={cn("bg-muted rounded-md animate-pulse w-full", variant === "compact" ? "h-8" : "h-10")} />
          </div>
        )}
      </div>
    </div>
  )
}

// Skeleton específico para formularios de login
export function LoginFormSkeleton({ className }: { className?: string }) {
  return <FormSkeleton className={className} fields={2} showTitle={true} variant="default" />
}

// Skeleton específico para formularios de registro
export function RegisterFormSkeleton({ className }: { className?: string }) {
  return <FormSkeleton className={className} fields={4} showTitle={true} variant="detailed" />
}

// Skeleton específico para formularios de contacto
export function ContactFormSkeleton({ className }: { className?: string }) {
  return <FormSkeleton className={className} fields={5} showTitle={true} variant="detailed" />
}
