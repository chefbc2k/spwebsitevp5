import { NextResponse } from 'next/server';
import { adminDb } from '../../firebase/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const adminDoc = await adminDb.collection('admins').doc(address.toLowerCase()).get();
    
    return NextResponse.json({ isAdmin: adminDoc.exists });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}