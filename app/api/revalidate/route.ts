import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path } = body

    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }

    // Revalidate all locale paths if no specific path provided
    revalidatePath('/en')
    revalidatePath('/es')
    revalidatePath('/fr')

    return NextResponse.json({ revalidated: true, paths: ['/en', '/es', '/fr'] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
