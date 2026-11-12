import { mysqlTable, varchar, boolean, timestamp,int,decimal } from 'drizzle-orm/mysql-core';

// On défini le schéma ici. C'est ce qui sera utilisé pour créer la table dans la base de données.
// On utilise les types de Drizzle pour définir les colonnes de la table.
// Chaque colonne est définie avec un type, une longueur (si applicable) et des contraintes
export const todos = mysqlTable('todos', {
  id: varchar('id', { length: 36 }).primaryKey(),
  text: varchar('text', { length: 500 }).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  passeWord: varchar('passeWord', { length: 255 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  roleId: varchar("role_id", { length: 36 }).notNull()
    .references(() => userRole.id),
  created_At: timestamp('created_At').defaultNow().notNull(),
  updated_At: timestamp('updated_At').defaultNow().onUpdateNow().notNull(),
}); 
export const userRole = mysqlTable('userRole', {
  id: varchar('id', { length: 36 }).primaryKey(),
  description: varchar('description', { length: 100 }).notNull().unique(),
  created_At: timestamp('created_At').defaultNow().notNull(),
  updated_At: timestamp('updated_At').defaultNow().onUpdateNow().notNull(),
}); 
export const bedType = mysqlTable('bedType', {
  id: varchar('id', { length: 36 }).primaryKey(),
  description: varchar('description', { length: 100 }).notNull().unique(),
  created_At: timestamp('created_At').defaultNow().notNull(),
  updated_At: timestamp('updated_At').defaultNow().onUpdateNow().notNull(),
}); 
export const bedRooms = mysqlTable('bedRooms', {
  id: varchar("id", { length: 36 }).primaryKey(),
  bedroomsNumber: int("bedrooms_number").notNull().unique(),
  bedroomType: varchar("bedroom_type", { length: 50 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  nbMaxClients: int("nb_max_clients").notNull(),
  sizeInMeterSquare: decimal("size_in_meter_square", { precision: 6, scale: 2 }).notNull(),
  nbBeds: int("nb_beds").notNull(),
  bed1Id: varchar("bed1_id", { length: 36 })
    .notNull()
    .references(() => bedType.id),
  bed2Id: varchar("bed2_id", { length: 36 })
    .references(() => bedType.id), // nullable
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  nomHotel: varchar("nom_hotel", { length: 100 }).notNull(),

  created_At: timestamp('created_At').defaultNow().notNull(),
  updated_At: timestamp('updated_At').defaultNow().onUpdateNow().notNull(),
  
}); 
