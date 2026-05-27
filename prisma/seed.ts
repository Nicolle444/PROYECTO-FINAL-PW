import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('Limpiando base de datos...')
  await prisma.stockMovement.deleteMany()
  await prisma.stockAlert.deleteMany()
  await prisma.product.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  // ── Usuarios ──────────────────────────────────────────────────────────────
  console.log('Creando usuarios...')
  const [adminHash, gerenteHash, operarioHash] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('gerente123', 10),
    bcrypt.hash('operario123', 10),
  ])

  const adminId = uuidv4()
  await prisma.user.createMany({
    data: [
      { id: adminId,    name: 'Administrador',  email: 'admin@pyme.com',    password: adminHash,    role: 'ADMIN' },
      { id: uuidv4(),   name: 'Gerente Compras', email: 'gerente@pyme.com',  password: gerenteHash,  role: 'GERENTE' },
      { id: uuidv4(),   name: 'Operario Bodega', email: 'operario@pyme.com', password: operarioHash, role: 'OPERARIO' },
    ],
  })

  // ── Proveedores ───────────────────────────────────────────────────────────
  console.log('Creando proveedores...')
  const supplierId1 = uuidv4()
  const supplierId2 = uuidv4()

  await prisma.supplier.createMany({
    data: [
      {
        id: supplierId1,
        name: 'TechSupplies S.A.S',
        contactName: 'Juan Pérez',
        email: 'juan@techsupplies.co',
        phone: '+57 310 555 0101',
        address: 'Cra 15 #45-20, Bogotá',
      },
      {
        id: supplierId2,
        name: 'Ferretería Industrial Ltda',
        contactName: 'María García',
        email: 'maria@ferreteriaindustrial.co',
        phone: '+57 312 555 0202',
        address: 'Av. 68 #13-42, Bogotá',
      },
    ],
  })

  // ── Productos ─────────────────────────────────────────────────────────────
  console.log('Creando productos...')
  const prodLaptopId  = uuidv4()
  const prodMouseId   = uuidv4()
  const prodTecladoId = uuidv4()
  const prodHddId     = uuidv4()
  const prodHerramId  = uuidv4()

  await prisma.product.createMany({
    data: [
      {
        id: prodLaptopId,
        sku: 'LAP-001',
        name: 'Laptop HP 15"',
        description: 'Laptop HP Core i5, 8GB RAM, 256GB SSD, pantalla 15.6"',
        supplierId: supplierId1,
        location: 'Estante A-01',
        stock: 5,
        minStock: 10,           // ⚠ BAJO MÍNIMO
        acquisitionCost: 2800000,
      },
      {
        id: prodMouseId,
        sku: 'MOU-001',
        name: 'Mouse Logitech Inalámbrico',
        description: 'Mouse inalámbrico Logitech M185, receptor USB nano',
        supplierId: supplierId1,
        location: 'Estante A-02',
        stock: 25,
        minStock: 5,
        acquisitionCost: 65000,
      },
      {
        id: prodTecladoId,
        sku: 'TEC-001',
        name: 'Teclado Mecánico RGB',
        description: 'Teclado mecánico USB retroiluminado, switches Blue',
        supplierId: supplierId1,
        location: 'Estante A-03',
        stock: 8,
        minStock: 3,
        acquisitionCost: 180000,
      },
      {
        id: prodHddId,
        sku: 'HDD-001',
        name: 'Disco Duro Externo 1TB',
        description: 'Disco duro externo Seagate 1TB USB 3.0',
        supplierId: supplierId1,
        location: 'Estante B-01',
        stock: 2,
        minStock: 5,            // ⚠ BAJO MÍNIMO
        acquisitionCost: 220000,
      },
      {
        id: prodHerramId,
        sku: 'HER-001',
        name: 'Destornillador Eléctrico',
        description: 'Destornillador eléctrico inalámbrico 3.6V con set de puntas',
        supplierId: supplierId2,
        location: 'Estante C-01',
        stock: 15,
        minStock: 10,
        acquisitionCost: 95000,
      },
    ],
  })

  // ── Alertas iniciales (productos bajo mínimo) ─────────────────────────────
  console.log('Creando alertas de stock bajo...')
  await prisma.stockAlert.createMany({
    data: [
      {
        id: uuidv4(),
        productId: prodLaptopId,
        currentStock: 5,
        minStock: 10,
        resolved: false,
      },
      {
        id: uuidv4(),
        productId: prodHddId,
        currentStock: 2,
        minStock: 5,
        resolved: false,
      },
    ],
  })

  // ── Movimientos de ejemplo ────────────────────────────────────────────────
  console.log('Creando movimientos de ejemplo...')
  await prisma.stockMovement.createMany({
    data: [
      {
        id: uuidv4(),
        productId: prodMouseId,
        type: 'ENTRY',
        quantity: 25,
        previousStock: 0,
        balanceAfter: 25,
        reason: 'Compra inicial a proveedor TechSupplies',
        userId: adminId,
      },
      {
        id: uuidv4(),
        productId: prodLaptopId,
        type: 'ENTRY',
        quantity: 5,
        previousStock: 0,
        balanceAfter: 5,
        reason: 'Compra inicial a proveedor TechSupplies',
        userId: adminId,
      },
      {
        id: uuidv4(),
        productId: prodMouseId,
        type: 'EXIT',
        quantity: 3,
        previousStock: 25,
        balanceAfter: 22,
        reason: 'Despacho a cliente corporativo ABC',
        userId: adminId,
      },
    ],
  })

  console.log('\n✅ Seed completado:')
  console.log('   Usuarios:     admin@pyme.com / gerente@pyme.com / operario@pyme.com')
  console.log('   Proveedores:  TechSupplies S.A.S, Ferretería Industrial Ltda')
  console.log('   Productos:    5 (LAP-001, MOU-001, TEC-001, HDD-001, HER-001)')
  console.log('   Alertas:      2 productos bajo mínimo (LAP-001, HDD-001)')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => { void prisma.$disconnect() })
