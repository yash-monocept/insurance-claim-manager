import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

/**
 * Catches unexpected render errors so a broken screen can never end up blank.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep the details in the console for debugging.
    console.error("Unhandled UI error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="py-10 text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Something went wrong</h1>
              <p className="text-gray-600 dark:text-gray-300">
                This screen hit an unexpected error. Reload to try again — your data is safe.
              </p>
              {this.state.message && (
                <p className="text-xs text-gray-400 dark:text-gray-400 break-words">{this.state.message}</p>
              )}
              <div className="flex justify-center gap-3">
                <Button onClick={() => window.location.reload()}>Reload page</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    this.setState({ hasError: false, message: undefined })
                    window.location.assign("/")
                  }}
                >
                  Go to dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
