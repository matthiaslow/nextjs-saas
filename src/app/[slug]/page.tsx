import { readItems } from '@directus/sdk';
import { directus } from '@/lib/directus';
import { Page } from '@/lib/schema';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const pages = await directus.request(readItems<Page>('pages', { filter: { published: { _eq: true } } }));
  return pages.map((page) => ({ slug: page.slug }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPage(slug: string) {
  const res = await directus.request(
    readItems<Page>('pages', {
      filter: { slug: { _eq: slug }, published: { _eq: true } },
      limit: 1,
    })
  );
  return res[0];
}

export default async function Page({ params }: PageProps) {
  const page = await getPage(params.slug);

  if (!page) return notFound();

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{page.meta_title || 'Untitled Page'}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
