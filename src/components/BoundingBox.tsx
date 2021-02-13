import {
  defaultObjectCategoryConfig,
  objectCategory,
  ObjectCategoryName,
} from '../config/nvision'
import { getBoundingBoxStyle } from '../operations/nvision'
import { ObjectDetectionResult } from '@nipacloud/nvision/dist/models/NvisionRequest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface BoundingBoxProps {
  detectedObject: ObjectDetectionResult
  scalingFactor?: number
}
export default function BoundingBox({
  detectedObject,
  scalingFactor = 1,
}: BoundingBoxProps) {
  const categoryConfig =
    objectCategory[detectedObject.parent as ObjectCategoryName] ??
    defaultObjectCategoryConfig
  return (
    <div
      className={`absolute border-solid border-2 text-xs rounded ${categoryConfig.colors.border}`}
      style={getBoundingBoxStyle(detectedObject.bounding_box, scalingFactor)}
    >
      <span
        className={`inline-block text-white shadow rounded-br pr-0.5 ${categoryConfig.colors.bg}`}
      >
        <FontAwesomeIcon icon={categoryConfig.icon} />
      </span>
    </div>
  )
}
