import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { SiteContentProvider } from "../context/SiteContentContext.jsx";

export default function PublicLayout() {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<SiteContentProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>, translationLanguage)
  );
}
