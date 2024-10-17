// Schema.tsx
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
    id: serial('id').primaryKey(),
    inputdata: varchar('inputdata').notNull(),
    templateslug: varchar('templateslug').notNull(),
    airesponse: text('airesponse'),
    useremail: varchar('useremail').notNull(), // Changed to useremail
    createdat: varchar('createdat').notNull(),
});
