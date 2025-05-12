CREATE TABLE "Modul"(
  id INTEGER NOT NULL,
  "Name" TEXT NOT NULL,
  "Verantwortlicher" TEXT NOT NULL,
  "Workload" INTEGER NOT NULL,
  "Credits" INTEGER NOT NULL,
  "Lernergebnisse" TEXT NOT NULL,
  "Inhalte" TEXT NOT NULL,
  "Prüfungsform" TEXT NOT NULL,
  "User_Matnr" INTEGER NOT NULL,
  PRIMARY KEY(id)
);


CREATE TABLE "User"(
  "Matnr" INTEGER NOT NULL,
  "Vorname" TEXT NOT NULL,
  "Nachname" TEXT NOT NULL,
  "PasswdHash" TEXT NOT NULL,
  "Salt" TEXT NOT NULL,
  "ETCS" FLOAT NOT NULL DEFAULT 0.0,
  "Notenschnitt" FLOAT,
  PRIMARY KEY("Matnr")
);


CREATE TABLE "Bewertung"(
  id INTEGER NOT NULL,
  "User_Matnr" INTEGER NOT NULL,
  "Score" FLOAT NOT NULL,
  "Inhalt" FLOAT NOT NULL,
  "Modul" FLOAT NOT NULL,
  "Modul_id" INTEGER NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT "User_Bewertung"
    FOREIGN KEY ("User_Matnr") REFERENCES "User" ("Matnr") ON DELETE Cascade
      ON UPDATE Cascade,
  CONSTRAINT "Modul_Bewertung"
    FOREIGN KEY ("Modul_id") REFERENCES "Modul" (id) ON DELETE Cascade
      ON UPDATE Cascade
);


CREATE TABLE "UserToModul"(
  "User_Matnr" INTEGER NOT NULL,
  "Modul_id" INTEGER NOT NULL,
  PRIMARY KEY("User_Matnr", "Modul_id"),
  CONSTRAINT "User_UserToModul"
    FOREIGN KEY ("User_Matnr") REFERENCES "User" ("Matnr"),
  CONSTRAINT "Modul_UserToModul" FOREIGN KEY ("Modul_id") REFERENCES "Modul" (id)
);


CREATE TABLE "Dozent"(
  id INTEGER NOT NULL,
  "Vorname" TEXT NOT NULL,
  "Nachname" TEXT NOT NULL,
  "Titel_id" INTEGER NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT "Titel_Dozent" FOREIGN KEY ("Titel_id") REFERENCES "Titel" (id)
);


CREATE TABLE "DozentToModul"(
  "Dozent_id" INTEGER NOT NULL,
  "Modul_id" INTEGER NOT NULL,
  PRIMARY KEY("Dozent_id", "Modul_id"),
  CONSTRAINT "Dozent_DozentToModul"
    FOREIGN KEY ("Dozent_id") REFERENCES "Dozent" (id),
  CONSTRAINT "Modul_DozentToModul"
    FOREIGN KEY ("Modul_id") REFERENCES "Modul" (id)
);


CREATE TABLE "Titel"
  (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "Bezeichnung" TEXT NOT NULL)
;

