import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Retrieve the encrypted NextAuth JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define route scopes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/request-access');
  const isProtectedRoute = pathname.startsWith('/dashboard') || (pathname.startsWith('/catalog') && !pathname.startsWith('/catalog/flipbook'));
  const isAdminRoute = pathname.startsWith('/admin');

  // 1. Kick unauthenticated traffic out of protected B2B routes
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const loginUrl = new URL('/login', req.url);
    // Append the URL they were trying to access so we can route them back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Prevent logged-in users from seeing the login screen again
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Prevent standard wholesale clients from accessing the Admin CRM & Pricing Engines
  if (isAdminRoute && token?.role === 'CLIENT') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // --- 4. Custom Domain DNS Resolver (Enterprise) ---
  const hostname = req.headers.get('host');
  
  // Prototype Dictionary mapping custom Vanity Domains to internal Tenant IDs
  const domainToTenantMap: Record<string, string> = {
    'wholesale.tiffany.com': 'tenant-tiffany',
    'b2b.cartier.com': 'tenant-cartier'
  };

  if (hostname && domainToTenantMap[hostname]) {
    const mappedTenantId = domainToTenantMap[hostname];
    
    // Inject the mapped tenant ID into the headers so the App Router knows which tenant data to load
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-enterprise-tenant-id', mappedTenantId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Strictly enforce middleware ONLY on specific URL paths to optimize performance
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/catalog/:path*', 
    '/admin/:path*', 
    '/login', 
    '/request-access'
  ],
};