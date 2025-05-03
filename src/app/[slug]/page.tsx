// src/app/[slug]/page.tsx
import { readItems }     from '@directus/sdk'
import { directus }      from '@/lib/directus'
import { Page as PageSchema } from '@/lib/schema'
import { notFound }      from 'next/navigation'
import { use }           from 'react'

type Params = Promise<{ slug: string }>

export async function generateMetadata(
  { params }: { params: Params }
): Promise<{ title: string; description?: string }> {
  const { slug } = await params

  // You can even fetch your page record here to pull in a real title/description…
  const [page] = await directus.request(
    readItems<PageSchema>('pages', {
      filter: { slug: { _eq: slug }, published: { _eq: true } },
      limit: 1,
    })
  )

  if (!page) {
    return { title: '404 – Page Not Found' }
  }

  return {
    title: page.meta_title || 'Untitled Page',
    description: page.meta_description || undefined,
  }
}

export default function Page({ params }: { params: Params }) {
  // unwrap our params & data with React `use()`
  const { slug } = use(params)
  const [page] = use(
    directus.request(
      readItems<PageSchema>('pages', {
        filter: { slug: { _eq: slug }, published: { _eq: true } },
        limit: 1,
      })
    )
  )

  if (!page) notFound()

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {page.meta_title ?? 'Untitled Page'}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  )
}
