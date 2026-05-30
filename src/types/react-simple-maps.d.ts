declare module 'react-simple-maps' {
  import { ReactNode, CSSProperties } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    style?: CSSProperties
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string
    children: (props: { geographies: Geography[] }) => ReactNode
  }

  export interface Geography {
    rsmKey: string
    [key: string]: unknown
  }

  export interface GeographyProps {
    key?: string
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    className?: string
    style?: Record<string, CSSProperties>
  }

  export interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
  export function Marker(props: MarkerProps): JSX.Element
}
