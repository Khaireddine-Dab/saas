import { NextRequest, NextResponse } from 'next/server'

// Mock data for posts - replace with your preferred storage solution
const mockPosts = [
  {
    id: '1',
    title: 'Welcome to Our SaaS Platform',
    content: 'This is our first blog post introducing our amazing SaaS platform...',
    slug: 'welcome-to-our-saas-platform',
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    author: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      image: null,
    },
    categories: [
      {
        category: {
          id: '1',
          name: 'Company News',
        },
      },
    ],
    tags: [
      {
        tag: {
          id: '1',
          name: 'Announcement',
        },
      },
    ],
    _count: {
      comments: 3,
    },
  },
  {
    id: '2',
    title: 'Product Updates: New Features Released',
    content: 'We are excited to announce several new features...',
    slug: 'product-updates-new-features',
    published: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    author: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      image: null,
    },
    categories: [
      {
        category: {
          id: '2',
          name: 'Product Updates',
        },
      },
    ],
    tags: [
      {
        tag: {
          id: '2',
          name: 'Feature',
        },
      },
    ],
    _count: {
      comments: 7,
    },
  },
]

// GET /api/posts - Get all published posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const publishedPosts = mockPosts.filter(post => post.published)
    
    // Apply pagination
    const paginatedPosts = publishedPosts.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        limit,
        offset,
        hasMore: paginatedPosts.length === limit,
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, slug, authorId, categoryIds = [], tagIds = [] } = body

    if (!title || !content || !slug || !authorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, content, slug, authorId',
        },
        { status: 400 }
      )
    }

    // Create new post with mock data
    const newPost = {
      id: (mockPosts.length + 1).toString(),
      title,
      content,
      slug,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: authorId,
        name: 'Admin User',
        email: 'admin@example.com',
        image: null,
      },
      categories: categoryIds.map((categoryId: string) => ({
        category: {
          id: categoryId,
          name: 'Category',
        },
      })),
      tags: tagIds.map((tagId: string) => ({
        tag: {
          id: tagId,
          name: 'Tag',
        },
      })),
      _count: {
        comments: 0,
      },
    }

    // Add to mock data (you can replace this with your preferred storage solution)
    mockPosts.unshift(newPost)

    // Log the post creation (you can replace this with your preferred storage solution)
    console.log('New post created:', {
      title,
      slug,
      authorId,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: newPost,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
      },
      { status: 500 }
    )
  }
}

