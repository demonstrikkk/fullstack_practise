"use client"
export function SkeletonPost() {
  return (
    <div className="post-card p-4 my-6 rounded-xl border border-gray-300 shadow-sm animate-pulse bg-zinc-900">
      
      {/* — User Info Skeleton — */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-700" />
        <div>
          <div className="h-3 w-24 bg-gray-700 rounded postbuttontoprelative   "></div>
          <div className="h-2 w-16 bg-gray-700 rounded "></div>
        </div>
        <div className='relative left-1/2 h-2 w-32 bg-gray-700 rounded' />
      </div>

      {/* — Text Skeleton — */}
      <div className="h-4 w-3/4 bg-gray-700 rounded my-4 onepercentmargin " />

      {/* — Media Skeleton — */}
      <div className="flex justify-center mt-6">
        <div className="videobox border rounded-md max-w-2/3 w-full h-40 bg-gray-700" />
      </div>

      

      {/* — Actions Skeleton — */}
      <div className="flex justify-between relative right-2 post-card mt-6">
        <div className="flex justify-between items-center gap-4 space-x-5 relative left-5 py-10">
          {[1, 2,  4].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-700 rounded-full" />
          ))}
        </div>
        <div className="w-6 h-6 bg-gray-700 rounded-full bookmark" />
      </div>

      {/* — Liked By Skeleton — */}
    </div>
  );
}


// components/SkeletonProfile.js
export function SkeletonProfile() {
  return (
    <div className="flex items-center py-6 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
      <div className="ml-3 space-y-2">
        {/* <div className="h-4 w-32 bg-gray-700 rounded"></div> */}
        {/* <div className="h-3 w-24 bg-gray-700 rounded"></div> */}
      </div>
    </div>
  );
}
