import React, { useEffect, useState } from 'react'
import {
  BRANDS_URL,
  MODELS_URL,
  STYLES_URL,
  TRANSMISSIONS_URL,
  FUEL_URL,
  DISPLACEMENT_URL,
  YEARS_URL
} from '../../common/common'
import styles from '../../styles/announcement/styles.module.css'

interface CarFormProps {
  mode: 'add' | 'edit'
  selected: number | null
  cars: any[]
  resetSignal?: number
  onSubmit: (data: any) => void
}

interface CatalogItem {
  desc: string
  [key: string]: any
}

export const CarForm: React.FC<CarFormProps> = ({
  mode,
  selected,
  cars,
  resetSignal,
  onSubmit
}) => {
  const [tab, setTab] = useState<1 | 2 | 3>(1)

  const [catalogs, setCatalogs] = useState({
    brands: [] as CatalogItem[],
    models: [] as CatalogItem[],
    styles: [] as CatalogItem[],
    transmissions: [] as CatalogItem[],
    fuel: [] as CatalogItem[],
    displacement: [] as CatalogItem[],
    years: [] as CatalogItem[]
  })

  const initialForm = {
    id_brands: 0,
    id_models: 0,
    id_styles: 0,
    exterior_color: '',
    interior_color: '',
    id_transmission: 0,
    id_displacement: 0,
    id_fuel: 0,
    receives: false,
    negotiable: false,
    number_of_doors: 4,
    id_year: 0,
    price: '',
    sold: false,
    images: [] as File[]
  }

  const [form, setForm] = useState<any>(initialForm)

  // ============================
  // CARGAR CATÁLOGOS
  // ============================
  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const urls = [
          BRANDS_URL,
          MODELS_URL,
          STYLES_URL,
          TRANSMISSIONS_URL,
          FUEL_URL,
          DISPLACEMENT_URL,
          YEARS_URL
        ]

        const responses = await Promise.all(urls.map(async url => await fetch(url)))
        const data = await Promise.all(responses.map(async r => await r.json()))

        if (mounted) {
          setCatalogs({
            brands: data[0],
            models: data[1],
            styles: data[2],
            transmissions: data[3],
            fuel: data[4],
            displacement: data[5],
            years: data[6]
          })
        }
      } catch (err) {
        console.error('Error cargando catálogos:', err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  // ============================
  // RESET TOTAL DEL FORMULARIO
  // ============================
  useEffect(() => {
    setForm(initialForm)
    setTab(1)
  }, [resetSignal])

  // ============================
  // CARGAR DATOS AL EDITAR
  // ============================
  useEffect(() => {
    let mounted = true

    if (mode === 'edit' && selected != null) {
      const car = cars.find(c => c.id_cars === selected)
      if (!car) return

      if (mounted) {
        setForm({
          id_brands: car.brands?.id_brands ?? 0,
          id_models: car.models?.id_models ?? 0,
          id_styles: car.styles?.id_styles ?? 0,
          exterior_color: car.exterior_color ?? '',
          interior_color: car.interior_color ?? '',
          id_transmission: car.transmissions?.id_transmission ?? 0,
          id_displacement: car.displacement?.id_displacements ?? 0,
          id_fuel: car.fuel?.id_fuel ?? 0,
          receives: car.receives ?? false,
          negotiable: car.negotiable ?? false,
          number_of_doors: car.number_of_doors ?? 4,
          id_year: car.years?.id_years ?? 0,
          price: car.price?.toString() ?? '',
          sold: car.sold ?? false,
          images: []
        })
      }
    }

    return () => { mounted = false }
  }, [mode, selected, cars])

  // ============================
  // HANDLER UNIVERSAL
  // ============================
  const update = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const filteredModels = catalogs.models

  // ============================
  // SUBMIT (CONVERSIÓN CORRECTA)
  // ============================
  const submit = () => {
    console.log('CATÁLOGO CILINDRAJES:', catalogs.years)
    onSubmit({
      ...form,
      price: Number(form.price) || 0
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* TABS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '.8rem' }}>
        <button type='button' className={`glass ${tab === 1 ? styles.activeTab : ''}`} onClick={() => setTab(1)}>Información</button>
        <button type='button' className={`glass ${tab === 2 ? styles.activeTab : ''}`} onClick={() => setTab(2)}>Especificaciones</button>
        <button type='button' className={`glass ${tab === 3 ? styles.activeTab : ''}`} onClick={() => setTab(3)}>Opciones & Fotos</button>
      </div>

      {/* ====================================== */}
      {/* TAB 1 — INFORMACIÓN */}
      {/* ====================================== */}
      {tab === 1 && (
        <>

          <div className={styles.formGrid}>
            <span>
              <label>Marca</label>
              <select
                className='glass'
                value={form.id_brands}
                onChange={e => update('id_brands', Number(e.target.value))}
              >
                <option value={0}>Seleccione</option>
                {catalogs.brands.map((b, i) => (
                  <option key={b.id_brands ?? i} value={b.id_brands}>{b.desc}</option>
                ))}
              </select>
            </span>

            <span>
              <label>Modelo</label>
              <select
                className='glass'
                value={form.id_models}
                onChange={e => update('id_models', Number(e.target.value))}
              >
                <option value={0}>Seleccione</option>
                {filteredModels.map((m, i) => (
                  <option key={m.id_models ?? i} value={m.id_models}>{m.desc}</option>
                ))}
              </select>
            </span>

            <span>
              <label>Estilo</label>
              <select
                className='glass'
                value={form.id_styles}
                onChange={e => update('id_styles', Number(e.target.value))}
              >
                <option value={0}>Seleccione</option>
                {catalogs.styles.map((s, i) => (
                  <option key={s.id_styles ?? i} value={s.id_styles}>{s.desc}</option>
                ))}
              </select>
            </span>
          </div>

          {/* Inputs FULL WIDTH YA ARREGLADOS */}
          <span className={`${styles.rowWrapper}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <label className={styles.rowWrapperLabel}>Color exterior</label>
            <input
              className={`glass ${styles.fullInput}`}
              type='text'
              value={form.exterior_color}
              onChange={e => update('exterior_color', e.target.value)}
            />
          </span>

          <span className={`${styles.rowWrapper}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <label className={styles.rowWrapperLabel}>Color interior</label>
            <input
              className={`glass ${styles.fullInput}`}
              type='text'
              value={form.interior_color}
              onChange={e => update('interior_color', e.target.value)}
            />
          </span>

          <span className={`${styles.rowWrapper}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Precio</label>
            <input
              className={`glass ${styles.fullInput}`}
              type='number'
              value={form.price}
              onChange={e => update('price', Number(e.target.value))}
            />
          </span>

        </>
      )}

      {/* ====================================== */}
      {/* TAB 2 — ESPECIFICACIONES */}
      {/* ====================================== */}
      {tab === 2 && (
        <div className={styles.formGrid}>

          <span>
            <label>Transmisión</label>
            <select
              className='glass'
              value={form.id_transmission}
              onChange={e => update('id_transmission', Number(e.target.value))}
            >
              <option value={0}>Seleccione</option>
              <option value={1}>Manual</option>
              <option value={2}>Automática</option>
              <option value={3}>Híbrida</option>
            </select>
          </span>

          <span>
            <label>Cilindraje</label>
            <select
              className='glass'
              value={form.id_displacements}
              onChange={e => update('id_displacement', Number(e.target.value))}
            >
              <option value={0}>Seleccione</option>
              {catalogs.displacement.map((d, i) => (
                <option key={i} value={d.id_displacements}>
                  {d.desc}
                </option>
              ))}
            </select>
          </span>

          <span>
            <label>Combustible</label>
            <select
              className='glass'
              value={form.id_fuel}
              onChange={e => update('id_fuel', Number(e.target.value))}
            >
              <option value={0}>Seleccione</option>
              {catalogs.fuel.map((f, i) => (
                <option key={i} value={f.id_fuel}>
                  {f.desc}
                </option>
              ))}
            </select>
          </span>

          <span>
            <label>Puertas</label>
            <select
              className='glass'
              value={form.number_of_doors}
              onChange={e => update('number_of_doors', Number(e.target.value))}
            >
              <option value={2}>2 - 3</option>
              <option value={4}>4 o más</option>
            </select>
          </span>

          <span>
            <label>Año</label>
            <select
              className='glass'
              value={form.id_years}
              onChange={e => update('id_year', Number(e.target.value))}
            >
              <option value={0}>Seleccione</option>
              {catalogs.years.map((y, i) => (
                <option key={i} value={y.id_years}>
                  {y.desc}
                </option>
              ))}
            </select>
          </span>

        </div>
      )}

      {/* ====================================== */}
      {/* TAB 3 — OPCIONES & FOTOS */}
      {/* ====================================== */}
      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <label>
            <input
              type='checkbox' checked={form.receives}
              onChange={e => update('receives', e.target.checked)}
            /> ¿Recibe vehículo?
          </label>

          <label>
            <input
              type='checkbox' checked={form.negotiable}
              onChange={e => update('negotiable', e.target.checked)}
            /> ¿Negociable?
          </label>

          <div>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>
              Imágenes
            </label>

            <div
              className={styles.uploadBox}
              onClick={() => document.getElementById('fileInputCustom')?.click()}
            >
              <p className={styles.uploadText}>Haz clic o arrastra imágenes aquí</p>
            </div>

            <input
              id='fileInputCustom'
              type='file'
              multiple
              accept='image/*'
              style={{ display: 'none' }}
              onChange={e => update('images', [
                ...form.images,
                ...Array.from(e.target.files ?? [])
              ])}
            />

            {form.images.length > 0 && (
              <div
                style={{
                  marginTop: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                  gap: '10px'
                }}
              >
                {form.images.map((img: File, i: number) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '90px'
                    }}
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />

                    <button
                      type='button'
                      onClick={() => update('images',
                        form.images.filter((_, idx) => idx !== i)
                      )}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: '50%',
                        border: 'none',
                        width: '22px',
                        height: '22px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* BOTÓN ENVIAR */}
      <button
        type='button'
        className={`glass ${styles.modalPrimaryBtn}`}
        onClick={submit}
        style={{ marginTop: '1rem' }}
      >
        {mode === 'add' ? 'Publicar' : 'Guardar cambios'}

      </button>

    </div>
  )
}
