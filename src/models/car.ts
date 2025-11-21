export interface Cars {
  id_cars: number
  id_brands: number
  id_models: number
  id_styles: number
  exterior_color: string
  interior_color: string
  id_transmission: number
  id_displacement: number
  id_fuel: number
  receives: boolean
  negotiable: boolean
  number_of_doors: number
  id_year: number
  price: number
  id_audit: number
  sold: boolean
  id_users: number
  brands: Brands
  models: Models
  styles: Styles
  transmissions: Transmissions
  displacements: Displacements
  fuel: Fuel
  years: Years
  audit: Audit
  users: Users
  cars_images: CarsImage[]
}

export interface Brands {
  desc: string
  id_brands: number
}

export interface Models {
  desc: string
  id_models: number
}

export interface Styles {
  desc: string
  id_styles: number
}

export interface Transmissions {
  desc: number
  id_transmissions: number
}

export interface Displacements {
  desc: string
  id_displacements: number
}

export interface Fuel {
  desc: string
  id_fuel: number
}

export interface Years {
  desc: string
  id_years: number
}

export interface Audit {
  id_audit: number
  created_at: string
  updated_at: string
}

export interface Users {
  age: number
  rol: number
  name: string
  email: string
  phone: string
  idcard: string
  id_user: number
  id_audit: any
  id_images: number
  last_name: string
}

export interface CarsImage {
  images: Images
}

export interface Images {
  image: string
  id_audit: any
  id_images: number
}
