import React from 'react'

const SkeletonText = ({ width = 'w-32', height = 'h-4' }) => {
  return (
    <div
      className={`${width} ${height} bg-gray-200 rounded-md animate-pulse`}
    />
  )
}

export default SkeletonText
