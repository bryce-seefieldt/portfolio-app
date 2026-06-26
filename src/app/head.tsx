import {
  generatePersonSchema,
  generateWebsiteSchema,
  formatSchemaAsScript,
} from "@/lib/structured-data";

const THEME_INIT_SCRIPT =
  "(function(){try{const saved=localStorage.getItem('theme');const isLight=saved==='light';if(isLight){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();";

export default function Head() {
  const jsonLdScripts = [generatePersonSchema(), generateWebsiteSchema()];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

      {jsonLdScripts.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: formatSchemaAsScript(schema) }}
        />
      ))}
    </>
  );
}
