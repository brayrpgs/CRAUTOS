import React from 'react';
import styles from '../../styles/banner/styles.module.css';
import { Background } from '../background/Background';

interface BannerSection {
  id: string
  image: string
  title: string
}

const sections: BannerSection[] = [
  {
    id: 'nuevos',
    image: '/',
    title: 'NUEVOS',
  },
  {
    id: 'usados',
    image: '/',
    title: 'USADOS',
  },
  {
    id: 'zona-verde',
    image: '/',
    title: 'ZONA VERDE',
  },
  {
    id: 'premium',
    image: '/',
    title: 'PREMIUM',
  },
  {
    id: 'bluebook',
    image: '/',
    title: 'BLUEBOOK',
  }
]

export const PromoBanner: React.FC = () => {
  return (
    <>
      <Background />
      <section className={styles.bannerContainer}>

        <div className={styles.bannerHeader}>
          <h1 className={styles.bannerTitle}>
            EXPLORA LAS SIGUIENTES CATEGORÍAS
          </h1>
          <p className={styles.bannerSubtitle}>
            Puedes comprar tu carro soñado o vender el tuyo. ¡Anímate!
          </p>
        </div>

        <div className={styles.bannerGrid}>
          {sections.map((section) => (
            <a
              key={section.id}
              className={`${styles.bannerCard} ${styles[section.id]}`}
            >
              <div className={styles.bannerCardOverlay}>
                <span className={styles.bannerCardTitle}>{section.title}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
};