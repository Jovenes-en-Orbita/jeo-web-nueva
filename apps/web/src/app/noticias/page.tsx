import type { Metadata } from "next";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { NewsCatalog } from "@/components/features/NewsCatalog";
import { CatalogPageHeader } from "@/components/ui/CatalogPageHeader";
import { getNewsCategories, getNewsTags, searchNews } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Noticias Espaciales — JEO (Jóvenes en Órbita)",
  description:
    "Explora todas las noticias, artículos y novedades de astronomía y ciencias espaciales.",
};

export default async function NoticiasPage() {
  const [initialResponse, categories, tags] = await Promise.all([
    searchNews({
      status: "PUBLISHED",
      sortBy: "date",
      sortOrder: "desc",
      page: 1,
      limit: 6,
      include: "categories",
    }),
    getNewsCategories(),
    getNewsTags(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <CatalogPageHeader
          titlePrefix="NOTICIAS"
          titleHighlight="ESPACIALES"
          subtitle="Artículos, informes y novedades del ecosistema espacial argentino e internacional."
          maxWidthClass="max-w-6xl"
        />

        <NewsCatalog
          initialResponse={initialResponse}
          categories={categories}
          tags={tags}
        />
      </main>

      <Footer />
    </div>
  );
}
