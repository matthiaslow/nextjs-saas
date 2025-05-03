import { readItems } from '@directus/sdk';
import { directus } from '@/lib/directus';
import { Page as PageSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [page] = await directus.request(
    readItems<PageSchema>('pages', {
      filter: { slug: { _eq: slug }, published: { _eq: true } },
      limit: 1,
    })
  );

  if (!page) return notFound();

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{page.meta_title || 'Untitled Page'}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
