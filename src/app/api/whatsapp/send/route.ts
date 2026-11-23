import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientPhone, message, listingTitle, requesterName, pickupPointName, requestId } = body;

    if (!recipientPhone) {
      return NextResponse.json({ success: false, error: 'Recipient phone number is required.' }, { status: 400 });
    }

    // Clean phone number (strip whitespace, hyphens, and non-digit characters except +)
    let cleanNumber = recipientPhone.replace(/[^\d+]/g, '');
    // If 10-digit Indian phone without country code, prefix with 91
    if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    } else if (cleanNumber.startsWith('+')) {
      cleanNumber = cleanNumber.substring(1);
    }

    const whatsappApiKey = process.env.WHATSAPP_API_KEY || process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const formattedMessage = message || `Hello! I saw your resource "${listingTitle}" on CampusLoop. I would like to borrow it for this semester. Can we meet at ${pickupPointName || 'Central Library'}?`;
    const waLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedMessage)}`;

    let apiSent = false;
    let apiResponse = null;

    // If real WhatsApp Cloud API Key and Phone Number ID are provided
    if (whatsappApiKey && phoneNumberId) {
      try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${whatsappApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanNumber,
            type: 'text',
            text: {
              preview_url: true,
              body: formattedMessage,
            },
          }),
        });

        apiResponse = await res.json();
        apiSent = res.ok;
      } catch (err) {
        console.warn('WhatsApp Cloud API call error, falling back to direct link:', err);
      }
    }

    return NextResponse.json({
      success: true,
      apiConfigured: Boolean(whatsappApiKey && phoneNumberId),
      apiSent,
      cleanNumber,
      waLink,
      message: formattedMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in WhatsApp API route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error processing WhatsApp message.' }, { status: 500 });
  }
}
