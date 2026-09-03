'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { NewsArticle } from '@jeo/shared';
import { FiSearch, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

interface NewsFeedProps {
  initialArticles: NewsArticle[];
}

const CATEGORIES = ['Todas', 'Misiones Espaciales', 'Astrobiología', 'Ingeniería', 'James Webb', 'NASA', 'SpaceX'];

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      let matchesCat = true;
      if (selectedCategory !== 'Todas') {
        matchesCat = article.tags ? article.tags.includes(selectedCategory) : true;
      }

      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          article.title.toLowerCase().includes(q) ||
          article.summary.toLowerCase().includes(q) ||
          (article.author?.toLowerCase().includes(q) ?? false);
      }

      return matchesCat && matchesSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getArticleImage = (slug: string) => {
    switch (slug) {
      case 'artemis-iii':
        return '/assets/artemis.svg';
      case 'exoplaneta-habitable':
        return '/assets/exoplanet.svg';
      case 'spacex-starship':
        return '/assets/starship.svg';
      default:
        return '/assets/hero-cosmos.svg';
    }
  };

  const featuredArticle = filteredArticles[0];
  const restArticles = filteredArticles.slice(1);

  return (
    <div className="wrap max-w-6xl mx-auto px-4 py-8">
      {/* Search & Filter Controls */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d162a] p-4 rounded-2xl border border-white/10">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar noticias o temáticas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060a17] border border-white/10 pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--color-yellow)] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--color-yellow)] text-[#060a17] shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-[#0d162a] rounded-2xl border border-white/10">
          <p className="text-lg text-slate-300 font-semibold mb-2">No se encontraron noticias</p>
          <p className="text-sm text-slate-400">Intenta buscar con otros términos o seleccionar otra categoría.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todas');
            }}
            className="mt-4 px-4 py-2 bg-[var(--color-yellow)] text-[#060a17] rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Top Article */}
          {featuredArticle && (
            <Link
              href={`/noticias/${featuredArticle.slug}`}
              className="group block bg-[#0d162a] border border-white/10 rounded-3xl overflow-hidden hover:border-[var(--color-yellow)]/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] w-full bg-[#060a17] overflow-hidden">
                  <Image
                    src={getArticleImage(featuredArticle.slug)}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-[var(--color-red)] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Destacado
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-semibold">
                      <span className="text-[var(--color-yellow)]">{formatDate(featuredArticle.date)}</span>
                      <span>•</span>
                      <span>{featuredArticle.readTimeMinutes} min de lectura</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug group-hover:text-[var(--color-yellow)] transition-colors font-[var(--font-montserrat)]">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-4 mb-6 font-[var(--font-poppins)]">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-yellow)] group-hover:text-white transition-colors">
                    <span>Leer artículo completo</span>
                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid of Other Articles */}
          {restArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/noticias/${article.slug}`}
                  className="bg-[#0d162a] border border-white/10 rounded-2xl p-6 group hover:border-[var(--color-yellow)]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-[200px] mb-5 rounded-xl overflow-hidden bg-[#090d1a]">
                      <Image
                        src={getArticleImage(article.slug)}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mb-2.5 uppercase">
                      <span className="text-[var(--color-yellow)]">{formatDate(article.date)}</span>
                      <span>•</span>
                      <span>{article.readTimeMinutes} min</span>
                    </div>

                    <h3 className="font-bold text-xl text-white mb-3 normal-case group-hover:text-[var(--color-yellow)] transition-colors font-[var(--font-montserrat)] line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 font-[var(--font-poppins)] mb-6">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs font-semibold text-[var(--color-yellow)] group-hover:text-white transition-colors flex items-center justify-between">
                    <span>Leer artículo</span>
                    <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
