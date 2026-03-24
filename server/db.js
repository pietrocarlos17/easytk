const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const path = require("path");

const db = new Database(path.join(__dirname, "data.db"));

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Prepared statements
const stmts = {
  insertUser: db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"),
  findByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  findById: db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?"),
  insertSession: db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"),
  findSession: db.prepare("SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')"),
  deleteSession: db.prepare("DELETE FROM sessions WHERE token = ?"),
  deleteExpired: db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')"),
};

// Clean expired sessions on startup
stmts.deleteExpired.run();

function createUser(name, email, password) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const result = stmts.insertUser.run(name, email.toLowerCase().trim(), hash);
    return { id: result.lastInsertRowid, name, email: email.toLowerCase().trim() };
  } catch (err) {
    if (err.message.includes("UNIQUE constraint")) {
      return null; // email already exists
    }
    throw err;
  }
}

function findUserByEmail(email) {
  return stmts.findByEmail.get(email.toLowerCase().trim()) || null;
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  // Session expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  stmts.insertSession.run(token, userId, expiresAt);
  return token;
}

function validateSession(token) {
  if (!token) return null;
  const session = stmts.findSession.get(token);
  if (!session) return null;
  return stmts.findById.get(session.user_id) || null;
}

function deleteSession(token) {
  stmts.deleteSession.run(token);
}

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
};
