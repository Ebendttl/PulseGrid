import { NextRequest, NextResponse } from "next/server";
import db from "@/db.json";

type CollectionKey = keyof typeof db;

const ALLOWED: CollectionKey[] = [
  "users",
  "students",
  "classSessions",
  "attendanceRecords",
  "auditLogs",
  "invoices",
  "transactions",
  "announcements",
];

// GET  /api/data/[resource]        → return full collection
// GET  /api/data/[resource]?id=x   → return single item
// POST /api/data/[resource]        → append item (in-memory only; stateless on Vercel)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!ALLOWED.includes(resource as CollectionKey)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const collection = db[resource as CollectionKey] as Record<string, unknown>[];
  const { searchParams } = new URL(request.url);

  // Support ?id= single-item lookup
  const id = searchParams.get("id");
  if (id) {
    const item = collection.find((r) => String(r["id"]) === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }

  // Support query-string filtering (e.g. ?studentId=s1)
  let results = [...collection];
  searchParams.forEach((value, key) => {
    if (key !== "_page" && key !== "_limit" && key !== "_sort") {
      results = results.filter((r) => String(r[key]) === value);
    }
  });

  // Pagination
  const page = parseInt(searchParams.get("_page") ?? "1", 10);
  const limit = parseInt(searchParams.get("_limit") ?? "1000", 10);
  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + limit);

  return NextResponse.json(paginated, {
    headers: {
      "X-Total-Count": String(results.length),
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!ALLOWED.includes(resource as CollectionKey)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  // Return the item as if it was persisted (stateless mock)
  const newItem = { id: `mock-${Date.now()}`, ...body };
  return NextResponse.json(newItem, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!ALLOWED.includes(resource as CollectionKey)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  return NextResponse.json(body);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  return PATCH(request, { params });
}
