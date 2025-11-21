import React from 'react';
import styles from '../../styles/banner/styles.module.css';

interface BannerSection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const sections: BannerSection[] = [
  {
    id: 'seguridad',
    title: 'COMPRA SEGURA',
    description: 'Verificación de vendedores, historial del vehículo y protección de datos.',
    imageUrl: '/seguridad.png',
  },
  {
    id: 'soporte',
    title: 'SOPORTE AL CLIENTE',
    description: 'Acompañamiento durante todo el proceso de compra o venta, 24/7.',
    imageUrl: '/soporte.png',
  },
  {
    id: 'innovacion',
    title: 'CATÁLOGO MODERNO',
    description: 'Miles de vehículos con fotos en alta calidad y datos completos.',
    imageUrl: '/innovacion.png',
  },
  {
    id: 'escalabilidad',
    title: 'PUBLICA SIN LÍMITES',
    description: 'Sube todos los carros que quieras con rapidez y excelente rendimiento.',
    imageUrl: '/escalabilidad.jpg',
  },
  {
    id: 'analytics',
    title: 'ANÁLISIS DE MERCADO',
    description: 'Precios, demanda y tendencias para ayudarte a tomar mejores decisiones.',
    imageUrl: '/analytics.png',
  },
];

export const PromoBanner: React.FC = () => {
  return (
    <section className={styles.bannerContainer}>
      <div className={styles.bannerHeader}>
        <h1 className={styles.bannerTitle}>
          TODO LO QUE NECESITAS PARA COMPRAR Y VENDER CARROS
        </h1>
        <p className={styles.bannerSubtitle}>
          Tecnología, seguridad y herramientas avanzadas para una experiencia confiable.
        </p>
      </div>

      <div className={styles.bannerGrid}>
        {sections.map((section) => (
          <div
            key={section.id}
            className={`${styles.bannerCard} ${styles[section.id]}`}
            style={{
              backgroundImage: `url(${section.imageUrl})`,
            }}
          >
            <div className={styles.bannerCardOverlay}>
              <span className={styles.bannerCardTitle}>{section.title}</span>
              <p className={styles.bannerCardDescription}>{section.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};