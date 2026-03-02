import { NextRequest, NextResponse } from 'next/server'

// Mock storage for newsletter subscriptions
const newsletterSubscriptions = new Set<string>()

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      )
    }

    // Check if email already exists
    if (newsletterSubscriptions.has(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already subscribed',
        },
        { status: 409 }
      )
    }

    // Add new subscription
    newsletterSubscriptions.add(email)
    
    // Log the subscription (you can replace this with your preferred storage solution)
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email,
        active: true,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to subscribe to newsletter',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      )
    }

    if (!newsletterSubscriptions.has(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email not found in newsletter subscriptions',
        },
        { status: 404 }
      )
    }

    newsletterSubscriptions.delete(email)
    
    // Log the unsubscription (you can replace this with your preferred storage solution)
    console.log('Newsletter unsubscription:', {
      email,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    })
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unsubscribe from newsletter',
      },
      { status: 500 }
    )
  }
}

