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

interface Brands {
  desc: string
  id_brands: number
}

interface Models {
  desc: string
  id_models: number
}

interface Styles {
  desc: string
  id_styles: number
}

interface Transmissions {
  desc: number
  id_transmissions: number
}

interface Displacements {
  desc: string
  id_displacements: number
}

interface Fuel {
  desc: string
  id_fuel: number
}

interface Years {
  desc: string
  id_years: number
}

interface Audit {
  id_audit: number
  created_at: string
  updated_at: string
}

interface Users {
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

interface CarsImage {
  images: Images
}

interface Images {
  image: string
  id_audit: any
  id_images: number
}
