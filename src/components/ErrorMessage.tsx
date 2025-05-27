interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export default function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-500/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-red-400 text-xl">⚠️</div>
          <div>
            <div className="text-red-300 font-medium">出现错误</div>
            <div className="text-red-200 text-sm">{message}</div>
          </div>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            重试
          </button>
        )}
      </div>
    </div>
  )
} 