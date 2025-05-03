import { readItems } from '@directus/sdk';
import { directus } from '@/lib/directus';
import { Page } from '@/lib/schema';

async function getPage(slug: string) {
  const res = await directus.request(
    readItems<Page>('pages', {
      filter: { slug: { _eq: slug }, published: { _eq: true } },
      limit: 1,
    })
  );

  return res[0];
}

export default async function PageView({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page) return <div>Page not found.</div>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{page.meta_title || 'Untitled Page'}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}

