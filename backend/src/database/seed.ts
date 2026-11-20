import bcrypt from "bcrypt";
import { BookModel } from "../modules/books/Book.js";
import { PermissionModel } from "../modules/roles/Permission.js";
import { RoleModel } from "../modules/roles/Role.js";
import { PERMISSIONS, type PermissionCode, type RoleName } from "../modules/roles/role.types.js";
import { UserModel } from "../modules/users/User.js";

const ROLE_PERMISSIONS: Record<RoleName, PermissionCode[]> = {
  admin: [...PERMISSIONS],
  operador: [
    "book:read",
    "book:create",
    "book:update",
    "book:change-status",
    "subscription:create",
    "subscription:delete",
    "notification:read",
  ],
  usuario: ["book:read", "subscription:create", "subscription:delete", "notification:read"],
};

const TEST_USERS: { name: string; email: string; password: string; role: RoleName }[] = [
  { name: "Admin", email: "admin@tp.com", password: "admin123", role: "admin" },
  { name: "Operador", email: "operador@tp.com", password: "operador123", role: "operador" },
  { name: "Usuario", email: "usuario@tp.com", password: "usuario123", role: "usuario" },
];

const TEST_BOOKS = [
  {
    title: "Don Quijote de la Mancha",
    description: "Novela clásica de la literatura española.",
    author: "Miguel de Cervantes",
    isbn: "9788420412146",
  },
  {
    title: "El principito",
    description: "Relato sobre la amistad y la responsabilidad.",
    author: "Antoine de Saint-Exupery",
    isbn: null,
  },
  {
    title: "Ficciones",
    description: "Cuentos de Borges sobre laberintos, espejos y bibliotecas infinitas.",
    author: "Jorge Luis Borges",
    isbn: "9789875666474",
  },
  {
    title: "Rayuela",
    description: "Novela que se puede leer en más de un orden.",
    author: "Julio Cortázar",
    isbn: null,
  },
  {
    title: "Clean Code",
    description: "Buenas prácticas para escribir código legible y mantenible.",
    author: "Robert C. Martin",
    isbn: "9780132350884",
  },
];

// Se puede correr muchas veces: solo crea lo que todavía no existe.
export async function seed(): Promise<void> {
  for (const code of PERMISSIONS) {
    await PermissionModel.findOrCreate({ where: { code } });
  }

  for (const [roleName, codes] of Object.entries(ROLE_PERMISSIONS)) {
    const [role] = await RoleModel.findOrCreate({ where: { name: roleName } });
    const permissions = await PermissionModel.findAll({ where: { code: codes } });
    await role.setPermissions(permissions);
  }

  for (const testUser of TEST_USERS) {
    const role = await RoleModel.findOne({ where: { name: testUser.role } });
    if (!role) continue;
    const exists = await UserModel.findOne({ where: { email: testUser.email } });
    if (exists) continue;
    await UserModel.create({
      name: testUser.name,
      email: testUser.email,
      passwordHash: await bcrypt.hash(testUser.password, 10),
      roleId: role.id,
    });
  }

  if ((await BookModel.count()) === 0) {
    await BookModel.bulkCreate(TEST_BOOKS);
  }
}
