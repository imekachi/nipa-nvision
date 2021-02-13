import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faCube } from '@fortawesome/free-solid-svg-icons'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons/faBasketballBall'
import { faCar } from '@fortawesome/free-solid-svg-icons/faCar'
import { faCouch } from '@fortawesome/free-solid-svg-icons/faCouch'
import { faHamburger } from '@fortawesome/free-solid-svg-icons/faHamburger'
import { faPaw } from '@fortawesome/free-solid-svg-icons/faPaw'
import { faPlug } from '@fortawesome/free-solid-svg-icons/faPlug'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faSink } from '@fortawesome/free-solid-svg-icons/faSink'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'

export type ObjectCategoryName =
  | 'human'
  | 'animal'
  | 'object'
  | 'furniture'
  | 'sport'
  | 'food'
  | 'electronic'
  | 'kitchenware'
  | 'accessory'
  | 'vehicle'

export interface ObjectCategoryConfig {
  icon: IconDefinition
  colors: {
    text: string
    bg: string
    border: string
  }
}

export const defaultObjectCategoryConfig: ObjectCategoryConfig = {
  icon: faQuestion,
  colors: {
    bg: 'bg-gray-600',
    text: 'text-gray-600',
    border: 'border-gray-600',
  },
}

export const objectCategory: Readonly<
  Record<ObjectCategoryName, ObjectCategoryConfig>
> = Object.freeze({
  human: {
    icon: faUser,
    colors: {
      text: 'text-pink-400',
      bg: 'bg-pink-400',
      border: 'border-pink-400',
    },
  },
  animal: {
    icon: faPaw,
    colors: {
      text: 'text-blue-500',
      bg: 'bg-blue-500',
      border: 'border-blue-500',
    },
  },
  object: {
    icon: faCube,
    colors: {
      text: 'text-green-500',
      bg: 'bg-green-500',
      border: 'border-green-500',
    },
  },
  furniture: {
    icon: faCouch,
    colors: {
      text: 'text-yellow-800',
      bg: 'bg-yellow-800',
      border: 'border-yellow-800',
    },
  },
  sport: {
    icon: faBasketballBall,
    colors: {
      text: 'text-red-500',
      bg: 'bg-red-500',
      border: 'border-red-500',
    },
  },
  food: {
    icon: faHamburger,
    colors: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-400',
      border: 'border-yellow-400',
    },
  },
  electronic: {
    icon: faPlug,
    colors: {
      text: 'text-purple-500',
      bg: 'bg-purple-500',
      border: 'border-purple-500',
    },
  },
  kitchenware: {
    icon: faSink,
    colors: {
      text: 'text-blue-400',
      bg: 'bg-blue-400',
      border: 'border-blue-400',
    },
  },
  accessory: {
    icon: faSink,
    colors: {
      text: 'text-red-500',
      bg: 'bg-red-500',
      border: 'border-red-500',
    },
  },
  vehicle: {
    icon: faCar,
    colors: {
      text: 'text-red-500',
      bg: 'bg-red-500',
      border: 'border-red-500',
    },
  },
})
