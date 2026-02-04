
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

// Load .env manually
const envPath = path.resolve(process.cwd(), ".env")
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8")
  envConfig.split("\n").forEach((line) => {
    const [key, value] = line.split("=")
    if (key && value && !process.env[key.trim()]) {
      let val = value.trim()
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1)
      }
      process.env[key.trim()] = val
    }
  })
}

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ 
  connectionString,
  ssl: true 
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("☔ Iniciando testes do RainDrive...\n")

  // --- CLEANUP ---
  console.log("🧹 Limpando dados de teste...")
  await prisma.file.deleteMany({ where: { user: { email: { contains: "test@" } } } })
  await prisma.folder.deleteMany({ where: { user: { email: { contains: "test@" } } } })
  await prisma.user.deleteMany({ where: { email: { contains: "test@" } } })
  console.log("✅ Limpeza concluída.\n")

  // --- AUTH SCENARIOS ---
  console.log("🔐 Testando Auth...")
  
  // 1. Signup user A
  const emailA = "testA@raindrive.com"
  const passwordA = "password123"
  const hashA = await bcrypt.hash(passwordA, 10)
  
  const userA = await prisma.user.create({
    data: { email: emailA, passwordHash: hashA }
  })
  console.log(`✅ Usuário A criado: ${userA.id}`)

  // 2. Duplicate email
  try {
    await prisma.user.create({
      data: { email: emailA, passwordHash: "whatever" }
    })
    console.error("❌ Falha: Permitiu email duplicado")
  } catch {
    console.log("✅ Sucesso: Bloqueou email duplicado")
  }

  // 3. Create user B
  const emailB = "testB@raindrive.com"
  const userB = await prisma.user.create({
    data: { email: emailB, passwordHash: hashA }
  })
  console.log(`✅ Usuário B criado: ${userB.id}\n`)


  // --- FOLDERS SCENARIOS ---
  console.log("📂 Testando Pastas...")

  // 1. Create root folder for A
  const folderRootA = await prisma.folder.create({
    data: { name: "Root A", userId: userA.id, parentId: null }
  })
  console.log(`✅ Pasta raiz criada: ${folderRootA.id}`)

  // 2. Create subfolder for A
  const folderSubA = await prisma.folder.create({
    data: { name: "Sub A", userId: userA.id, parentId: folderRootA.id }
  })
  console.log(`✅ Subpasta criada: ${folderSubA.id}`)

  // 3. Move subfolder to root (already is, move to null just to test update)
  await prisma.folder.update({
    where: { id: folderSubA.id },
    data: { parentId: null }
  })
  console.log("✅ Pasta movida para raiz")

  // Restore hierarchy
  await prisma.folder.update({
    where: { id: folderSubA.id },
    data: { parentId: folderRootA.id }
  })

  // 4. Circular dependency check (Simulating logic from storage.ts)
  console.log("🔄 Testando Ciclo de Pastas...")
  // Tentar mover Root A para Sub A (que é filha de Root A)
  const targetFolderId = folderSubA.id
  const itemId = folderRootA.id
  
  let currentId: string | null = targetFolderId
  let hasCycle = false
  
  while (currentId) {
     if (currentId === itemId) {
         hasCycle = true
         break
     }
     const parent = await prisma.folder.findUnique({
        where: { id: currentId },
        select: { parentId: true }
     })
     if (!parent) break 
     currentId = parent.parentId
  }

  if (hasCycle) {
      console.log("✅ Sucesso: Detectou ciclo ao tentar mover Pai para Filho")
  } else {
      console.error("❌ Falha: Não detectou ciclo")
  }


  // --- FILES SCENARIOS ---
  console.log("\n📄 Testando Arquivos...")

  // 1. Create file in Root A
  const fileA = await prisma.file.create({
    data: {
      name: "doc.pdf",
      sizeBytes: BigInt(1024),
      storageUrl: "http://fake.url/doc.pdf",
      storageKey: "doc.pdf",
      mimeType: "application/pdf",
      userId: userA.id,
      folderId: folderRootA.id
    }
  })
  console.log(`✅ Arquivo criado: ${fileA.id}`)

  // 2. Move file to Sub A
  await prisma.file.update({
    where: { id: fileA.id },
    data: { folderId: folderSubA.id }
  })
  console.log("✅ Arquivo movido para subpasta")


  // --- MULTI-USER ISOLATION ---
  console.log("\n🛡️ Testando Isolamento Multi-usuário...")

  // 1. User B tries to see User A's files
  const filesVisibleToB = await prisma.file.findMany({
    where: { userId: userB.id } // Query correta que o app faria
  })
  
  if (filesVisibleToB.length === 0) {
      console.log("✅ Sucesso: Usuário B não vê arquivos de A")
  } else {
      console.error("❌ Falha: Usuário B viu arquivos de A")
  }

  // 2. User B tries to delete User A's file (simulation of logic)
  const fileToDelete = await prisma.file.findFirst({
      where: { id: fileA.id, userId: userB.id }
  })

  if (!fileToDelete) {
      console.log("✅ Sucesso: Usuário B não conseguiu acessar arquivo de A para deletar")
  } else {
      console.error("❌ Falha: Usuário B acessou arquivo de A")
  }

  // --- CLEANUP END ---
  console.log("\n🧹 Limpeza final...")
  await prisma.file.deleteMany({ where: { user: { email: { contains: "test@" } } } })
  await prisma.folder.deleteMany({ where: { user: { email: { contains: "test@" } } } })
  await prisma.user.deleteMany({ where: { email: { contains: "test@" } } })
  console.log("✅ Testes concluídos.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
