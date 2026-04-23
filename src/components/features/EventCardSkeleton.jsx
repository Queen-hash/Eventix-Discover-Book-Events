import React from "react";

export default function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col animate-pulse shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
        </div>
        
        {/* Info */}
        <div className="space-y-3 pt-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
        </div>
        
        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
}
