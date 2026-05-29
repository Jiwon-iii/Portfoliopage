import { MongoClient, type Db } from "mongodb"

/**
 * MongoDB connection 캐싱 (Next.js dev hot reload + Vercel serverless 양쪽 대응).
 * - dev: globalThis 에 캐싱해서 모듈 재로딩 시 연결 누수 방지
 * - prod (serverless): 함수 인스턴스가 살아있는 동안 동일 connection 재사용
 */
const dbName = process.env.MONGODB_DB ?? "portfolio"

declare global {
  var _mongoClient: Promise<MongoClient> | undefined
}

let productionClientPromise: Promise<MongoClient> | undefined

function getMongoUri() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI 환경변수가 설정되지 않았습니다. .env.local 확인.")
  }
  return uri
}

export function getClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri()

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri).connect()
    }
    return global._mongoClient
  }

  if (!productionClientPromise) {
    productionClientPromise = new MongoClient(uri).connect()
  }
  return productionClientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(dbName)
}
