const MONGODB_DATA_API_URL = `https://data.mongodb-api.com/app/${process.env.MONGODB_APP_ID}/endpoint/data/v1/action`;
const MONGODB_DATA_API_KEY = process.env.MONGODB_DATA_API_KEY;
const DB_NAME = 'nft_marketplace';

async function fetchMongoAPI(action: string, body: any) {
  const response = await fetch(`${MONGODB_DATA_API_URL}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MONGODB_DATA_API_KEY!,
    },
    body: JSON.stringify({
      dataSource: 'Cluster0',
      database: DB_NAME,
      ...body,
    }),
  });

  if (!response.ok) {
    throw new Error(`MongoDB Data API error: ${response.statusText}`);
  }

  return response.json();
}

export async function findDocuments(collection: string, query: any = {}, options: any = {}) {
  const result = await fetchMongoAPI('find', {
    collection,
    filter: query,
    limit: options.limit || 100,
    projection: options.projection,
  });
  
  return result.documents;
}

export async function insertDocument(collection: string, document: any) {
  const result = await fetchMongoAPI('insertOne', {
    collection,
    document,
  });
  
  return result.insertedId;
}

export async function updateDocument(collection: string, query: any, update: any) {
  const result = await fetchMongoAPI('updateOne', {
    collection,
    filter: query,
    update: { $set: update },
  });
  
  return result.modifiedCount;
}

export async function deleteDocument(collection: string, query: any) {
  const result = await fetchMongoAPI('deleteOne', {
    collection,
    filter: query,
  });
  
  return result.deletedCount;
}