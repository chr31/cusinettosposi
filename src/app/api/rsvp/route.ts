import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'rsvps.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, presenze, messaggio } = body || {}

    if (!nome || !email || !presenze || presenze < 1) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
    }

    await fs.mkdir(DATA_DIR, { recursive: true })
    let list: any[] = []
    try {
      const content = await fs.readFile(FILE, 'utf-8')
      list = JSON.parse(content)
    } catch {}

    const entry = {
      id: Date.now().toString(36),
      nome,
      email,
      presenze,
      messaggio: messaggio || '',
      createdAt: new Date().toISOString(),
    }
    list.push(entry)
    await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8')

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

