// src/app/[slug]/page.tsx
import { readItems }       from '@directus/sdk';
import { directus }        from '@/lib/directus';
import type { Page as PageType } from '@/lib/schema';
import { notFound }        from 'next/navigation';

type Params = Promise<{ slug: string }>;

/** Build the HTML <head> metadata for each slug */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<{ title: string; description?: string }> {
  const { slug } = await params;

  // ⚠️ now *using* PageType in the generic here
  const [page] = await directus.request<PageType[]>(
    readItems('pages', {
      filter: { slug: { _eq: slug }, published: { _eq: true } },
      limit: 1,
    })
  );

  if (!page) {
    return { title: '404 – Page Not Found' };
  }

  return {
    title: page.meta_title ?? 'Untitled Page',
    description: page.meta_description ?? undefined,
  };
}

/** Server‐route component to render a single page by slug */
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  // ⚠️ PageType used again here
  const [page] = await directus.request<PageType[]>(
    readItems('pages', {
      filter: { slug: { _eq: slug }, published: { _eq: true } },
      limit: 1,
    })
  );

  if (!page) {
    notFound();
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {page.meta_title ?? 'Untitled Page'}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
