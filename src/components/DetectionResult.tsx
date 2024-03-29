import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectDetectionResult } from '@nipacloud/nvision/dist/models/NvisionRequest'
import React from 'react'
import {
  defaultObjectCategoryConfig,
  objectCategory,
  ObjectCategoryName,
} from '../config/nvision'
import { mathRoundDigits } from '../utils/number'

interface DetectionResultProps {
  detectedObjects?: ObjectDetectionResult[]
  filterState: {
    activeObjectIndex: number | null
    activeCategory: ObjectCategoryName | null
  }
  setFilterState: React.Dispatch<
    React.SetStateAction<DetectionResultProps['filterState']>
  >
}
interface DetectedObjectWithId {
  originalIndex: number
  detectedObject: ObjectDetectionResult
}
export default function DetectionResult({
  detectedObjects,
  filterState,
  setFilterState,
}: DetectionResultProps) {
  if (!detectedObjects) return null
  // Using Set to make the category name unique
  const categories = new Set<ObjectCategoryName>()
  const sortedObjects: DetectedObjectWithId[] = detectedObjects
    .map((detectedObject, originalIndex) => {
      // Save category to the categories set
      categories.add(detectedObject.parent as ObjectCategoryName)
      return {
        originalIndex: originalIndex,
        detectedObject,
      }
    })
    .sort((a, b) => b.detectedObject.confidence - a.detectedObject.confidence)

  return (
    <section className="text-gray-600">
      <h2 className="font-bold mb-4">Detection Result</h2>
      {/* Display category filter only when there are 2 or more categories */}
      {categories.size > 1 && (
        <ul className="grid gap-2 py-4 mb-2 grid-cols-[repeat(auto-fill,minmax(80px,1fr))]">
          {Array.from(categories).map((category) => {
            const categoryConfig =
              objectCategory[category] ?? defaultObjectCategoryConfig

            const handleClickCategory = () => {
              setFilterState({
                // Toggle active category to null or the clicked category
                activeCategory:
                  filterState.activeCategory === category ? null : category,
                // Reset active object because it might not in the active category and will cause a bug
                activeObjectIndex: null,
              })
            }

            return (
              <li
                key={category}
                className={`text-center cursor-pointer ${
                  filterState.activeCategory === category
                    ? categoryConfig.colors.text
                    : ''
                }`}
                onClick={handleClickCategory}
              >
                <FontAwesomeIcon
                  className="text-lg"
                  icon={categoryConfig.icon}
                />
                <span className="block text-center text-xs capitalize">
                  {category}
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <div className="pt-2 pb-8 -mx-2 px-2 overflow-y-auto max-h-[400px]">
        <ul className="space-y-4">
          {sortedObjects.map(({ originalIndex, detectedObject }) => {
            // Skip rendering cards that's not in the active if the activeCategory exists
            if (
              filterState.activeCategory &&
              filterState.activeCategory !== detectedObject.parent
            ) {
              return null
            }

            const categoryConfig =
              objectCategory[detectedObject.parent as ObjectCategoryName] ??
              defaultObjectCategoryConfig
            const confidencePercent = mathRoundDigits(
              detectedObject.confidence * 100,
              2
            )

            const handleClickItem = () => {
              // If click on the active index,
              // reverse toggle it by setting activeObjectIndex to null,
              // otherwise, set the originalIndex to be the active one
              setFilterState({
                ...filterState,
                activeObjectIndex:
                  filterState.activeObjectIndex === originalIndex
                    ? null
                    : originalIndex,
              })
            }

            let activeClassName = 'shadow-md'
            if (Number.isFinite(filterState.activeObjectIndex)) {
              if (filterState.activeObjectIndex === originalIndex) {
                activeClassName = 'shadow-xl'
              } else {
                activeClassName = 'shadow-none opacity-50'
              }
            }

            return (
              <li
                key={originalIndex}
                className={`overflow-hidden py-4 p-6 bg-white rounded-2xl flex cursor-pointer transition duration-300 ease-in-out ${activeClassName}`}
                onClick={handleClickItem}
              >
                <div
                  className={`self-center text-xl text-center min-w-[1.5em] ${categoryConfig.colors.text}`}
                >
                  <FontAwesomeIcon icon={categoryConfig.icon} />
                </div>
                <div className="ml-4 flex-1 capitalize">
                  <p className={`font-bold ${categoryConfig.colors.text}`}>
                    {detectedObject.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {detectedObject.parent}
                  </p>
                </div>
                <div className="ml-2 w-14 text-right flex-shrink-0">
                  <div className="mb-2">{confidencePercent}%</div>
                  <div className="h-1 bg-gray-300 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-400"
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
