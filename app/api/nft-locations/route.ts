import { NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb';
import { FilterState } from '@/types/marketplace';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100,
});

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    await limiter.check(request, 10); // 10 requests per minute per IP

    const { searchParams } = new URL(request.url);
    const filtersParam = searchParams.get('filters');

    if (!filtersParam) {
      return NextResponse.json(
        { error: 'Filters parameter is required' },
        { status: 400 }
      );
    }

    let filters: FilterState;
    try {
      filters = JSON.parse(filtersParam);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid filters format' },
        { status: 400 }
      );
    }

    // Build query based on filters
    const query: Record<string, any> = {};

    // Apply region filter
    if (filters.region && Object.values(filters.region).some(v => v)) {
      query.region = {
        $in: Object.entries(filters.region)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      };
    }

    // Apply price range filter
    if (filters.priceRange && Array.isArray(filters.priceRange)) {
      query.price = {
        $gte: filters.priceRange[0],
        $lte: filters.priceRange[1]
      };
    }

    // Execute query with projection and pagination
    const locations = await findDocuments('nft_locations', query, {
      limit: 100,
      projection: {
        id: 1,
        title: 1,
        artist: 1,
        price: 1,
        image: 1,
        latitude: 1,
        longitude: 1,
        region: 1,
        voiceType: 1,
        language: 1,
        experienceLevel: 1
      }
    });

    return NextResponse.json(locations, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching NFT locations:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}