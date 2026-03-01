import { NextRequest, NextResponse } from 'next/server'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required: name, email, subject, message',
        },
        { status: 400 }
      )
    }

    // Log the contact form submission (you can replace this with your preferred storage solution)
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: Date.now().toString(),
        name,
        email,
        subject,
        message,
        read: false,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit contact form',
      },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get all contact submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unread') === 'true'

    // Mock data - replace with your preferred storage solution
    const mockContacts = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry about pricing',
        message: 'I would like to know more about your pricing plans.',
        read: false,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Support request',
        message: 'I need help with my account setup.',
        read: true,
        createdAt: new Date('2024-01-14'),
      },
    ]

    let contacts = mockContacts
    if (unreadOnly) {
      contacts = contacts.filter(contact => !contact.read)
    }

    // Apply pagination
    const paginatedContacts = contacts.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedContacts,
      meta: {
        total: contacts.length,
        unreadCount: contacts.filter(contact => !contact.read).length,
        pagination: {
          limit,
          offset,
          hasMore: paginatedContacts.length === limit,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact submissions',
      },
      { status: 500 }
    )
  }
}

