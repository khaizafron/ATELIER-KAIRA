export interface Item {
  id: string
  title: string
  slug: string
  description: string | null
  price: number
  status: 'available' | 'sold' | 'offline_sold'
  offline_location: string | null
  created_at: string
  updated_at: string
}

export interface ItemImage {
  id: string
  item_id: string
  image_url: string
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface ItemMeasurement {
  id: string
  item_id: string
  pit_to_pit: number | null
  body_length: number | null
  shoulder_width: number | null
  sleeve_length: number | null
  armhole: number | null
  bottom_hem: number | null
  created_at: string
}

export interface ItemWithDetails extends Item {
  images: ItemImage[]
  measurements: ItemMeasurement | null
}

export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}
