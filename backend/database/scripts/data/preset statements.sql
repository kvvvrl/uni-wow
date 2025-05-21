-- Notenschnitt berechnen
SELECT AVG(UserToModul.Note) FROM UserToModul WHERE UserToModul.User_Matnr = ?;

-- Ein Modul für einen User hinzufügen
INSERT INTO UserToModul(user_matnr, modul_id)
VALUES (? , ?);

-- Eine Note eintragen
UPDATE UserToModul SET Note = ?,

-- Eine Bewertung erstellen
INSERT INTO Bewertung(User_Matnr, Score, Inhalt, Modul_id)
VALUES (?, ?, ?, ?);

-- Eine Bewertung ändern
UPDATE Bewertung
SET Inhalt = ?, Score = ?
WHERE Bewertung.User_Matnr = ? AND Bewertung.Modul_id = ?;

-- Einen User registrieren
INSERT INTO User(Matnr, Vorname, Nachname, PasswdHash, Salt)
VALUES (?, ?, ?, ?, ?);

-- Passwort Hash überprüfen für Login
SELECT User.PasswdHash FROM User
WHERE User.Matnr = ?;

-- Passwort Ändern
UPDATE User
SET PasswdHash = ?
WHERE Matnr = ?;

