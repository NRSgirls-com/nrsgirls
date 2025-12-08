// pages/sitemap.xml.js
function generateSiteMap() {
  const baseUrl = 'https://nrsgirls.com';
  
  // Last significant update date for the website
  // Update this date when you make significant changes to the content
  const lastModified = new Date('2025-12-08').toISOString();
  
  // List of all pages/routes in the application
  const routes = [
    '', // Home page
    '/pricing',
    '/account',
    '/help',
    '/help/go-live',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return sitemap;
}

function SiteMap() {
  // This component doesn't render anything as the sitemap is generated server-side
  return null;
}

export async function getServerSideProps({ res }) {
  // Generate the XML sitemap
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  // Send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
