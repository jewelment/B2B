import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// This function recursively scans the 'app' directory for any folder containing a 'page.tsx'
function getRoutes(dir: string, basePath: string = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Skip API routes and Next.js internal folders (like .next or folders starting with _)
      if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name === 'api') continue;
      
      const fullPath = path.join(dir, entry.name);
      const routePath = `${basePath}/${entry.name}`;
      
      // If a page.tsx exists in this folder, it is an active frontend URL
      if (fs.existsSync(path.join(fullPath, 'page.tsx')) || fs.existsSync(path.join(fullPath, 'page.jsx'))) {
        // Clean up Next.js route groups (folders with parentheses like (admin))
        const cleanRoute = routePath.replace(/\/\([^)]+\)/g, '');
        routes.push(cleanRoute);
      }
      
      // Continue scanning deeper folders
      routes = routes.concat(getRoutes(fullPath, routePath));
    }
  }
  
  // Remove duplicates and filter out empty strings
  return Array.from(new Set(routes)).filter(Boolean);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000';
  const appDirectory = path.join(process.cwd(), 'app');
  
  const routes = getRoutes(appDirectory);
  
  // Map the found routes to the XML Sitemap format
  const sitemapUrls: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Always manually insert the root homepage if it exists
  if (fs.existsSync(path.join(appDirectory, 'page.tsx'))) {
    sitemapUrls.unshift({
      url: `${baseUrl}/`,
      lastModified: new Date(),
    });
  }

  return sitemapUrls;
}