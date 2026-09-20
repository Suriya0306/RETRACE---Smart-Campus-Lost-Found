import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'retrace.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          department TEXT,
          year TEXT,
          role TEXT DEFAULT 'student',
          phone TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Items table
      db.run(`
        CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY,
          reportId TEXT UNIQUE NOT NULL,
          userId TEXT,
          type TEXT NOT NULL CHECK (type IN ('lost', 'found', 'recovered')),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          brand TEXT,
          color TEXT,
          description TEXT,
          uniqueFeatures TEXT,
          date TEXT NOT NULL,
          time TEXT,
          location TEXT NOT NULL,
          storageLocation TEXT,
          status TEXT DEFAULT 'active',
          image TEXT,
          contactName TEXT,
          contactEmail TEXT,
          contactPhone TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Journeys table
      db.run(`
        CREATE TABLE IF NOT EXISTS journeys (
          id TEXT PRIMARY KEY,
          userId TEXT,
          itemId TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Journey Points table
      db.run(`
        CREATE TABLE IF NOT EXISTS journey_points (
          id TEXT PRIMARY KEY,
          journeyId TEXT NOT NULL,
          location TEXT NOT NULL,
          arrivalTime TEXT,
          departureTime TEXT,
          notes TEXT,
          orderIndex INTEGER DEFAULT 0,
          FOREIGN KEY (journeyId) REFERENCES journeys(id) ON DELETE CASCADE
        )
      `);

      // Matches table
      db.run(`
        CREATE TABLE IF NOT EXISTS matches (
          id TEXT PRIMARY KEY,
          lostItemId TEXT NOT NULL,
          foundItemId TEXT NOT NULL,
          score INTEGER NOT NULL,
          categoryScore INTEGER NOT NULL,
          locationScore INTEGER NOT NULL,
          dateScore INTEGER NOT NULL,
          timeScore INTEGER NOT NULL,
          descriptionScore INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Claims table
      db.run(`
        CREATE TABLE IF NOT EXISTS claims (
          id TEXT PRIMARY KEY,
          itemId TEXT NOT NULL,
          userId TEXT NOT NULL,
          userBeliefReason TEXT,
          uniqueFeatureAnswer TEXT,
          lastSeenLocationAnswer TEXT,
          status TEXT DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating database tables:', err);
          return reject(err);
        }
        seedDatabase().then(resolve).catch(reject);
      });
    });
  });
};

const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM items', (err, row) => {
      if (err) return reject(err);
      if (row && row.count > 0) {
        console.log('Database already contains records. Skipping seed.');
        return resolve();
      }

      console.log('Seeding demo data into SQLite database...');

      const stmtUser = db.prepare(`
        INSERT INTO users (id, name, email, password, department, year, role, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmtUser.run('u1', 'Alex Vance', 'student@campus.edu', 'password123', 'Computer Science & Engineering', 'Year 3', 'student', '+1 555-0192');
      stmtUser.run('u2', 'Prof. Sarah Jenkins', 'admin@campus.edu', 'admin123', 'Campus Security', 'Faculty/Admin', 'admin', '+1 555-0100');
      stmtUser.finalize();

      const itemsData = [
        {
          id: 'item-101',
          reportId: 'RET-L-2026-001',
          userId: 'u1',
          type: 'lost',
          name: 'Black Backpack',
          category: 'Bags',
          brand: 'Swissgear',
          color: 'Black',
          description: 'Black Swissgear laptop backpack containing CSE textbooks and notebook.',
          uniqueFeatures: 'Keychain with blue turtle and slight scratch on front pocket zipper.',
          date: '2026-09-18',
          time: '09:30 AM',
          location: 'CSE Block',
          storageLocation: null,
          status: 'pending_match',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
          contactName: 'Alex Vance',
          contactEmail: 'alex@campus.edu',
          contactPhone: '+1 555-0192'
        },
        {
          id: 'item-102',
          reportId: 'RET-F-2026-001',
          userId: 'u2',
          type: 'found',
          name: 'Black College Backpack',
          category: 'Bags',
          brand: 'Swissgear',
          color: 'Black',
          description: 'Found black laptop backpack on 3rd floor CSE Block near Lab 4.',
          uniqueFeatures: 'Has a blue turtle keychain attached to side ring.',
          date: '2026-09-18',
          time: '11:15 AM',
          location: 'CSE Block',
          storageLocation: 'Campus Security Office, Admin Room 102',
          status: 'claimed',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
          contactName: 'Officer Ryan',
          contactEmail: 'security@campus.edu',
          contactPhone: '+1 555-0100'
        },
        {
          id: 'item-103',
          reportId: 'RET-L-2026-002',
          userId: 'u1',
          type: 'lost',
          name: 'Blue Water Bottle',
          category: 'Accessories',
          brand: 'Hydro Flask',
          color: 'Blue',
          description: 'Matte cobalt blue 32oz Hydro Flask with stainless steel lid.',
          uniqueFeatures: 'Oracle Hackathon sticker pasted near the top rim.',
          date: '2026-09-17',
          time: '01:00 PM',
          location: 'Canteen',
          storageLocation: null,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
          contactName: 'Alex Vance',
          contactEmail: 'alex@campus.edu',
          contactPhone: '+1 555-0192'
        },
        {
          id: 'item-104',
          reportId: 'RET-F-2026-002',
          userId: 'u2',
          type: 'found',
          name: 'Blue Bottle',
          category: 'Accessories',
          brand: 'Hydro Flask',
          color: 'Blue',
          description: 'Insulated blue water bottle left at Canteen table 12.',
          uniqueFeatures: 'Has tech hackathon sticker.',
          date: '2026-09-17',
          time: '02:30 PM',
          location: 'Canteen',
          storageLocation: 'Canteen Lost & Found Box',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
          contactName: 'Canteen Staff',
          contactEmail: 'canteen@campus.edu',
          contactPhone: '+1 555-0144'
        },
        {
          id: 'item-105',
          reportId: 'RET-L-2026-003',
          userId: 'u1',
          type: 'lost',
          name: 'Student ID Card',
          category: 'ID Cards',
          brand: 'Campus ID',
          color: 'White',
          description: 'Official Campus Student ID Card belonging to Computer Science Department.',
          uniqueFeatures: 'ID No: CS-2024-8841 with lanyard attached.',
          date: '2026-09-19',
          time: '10:00 AM',
          location: 'Library',
          storageLocation: null,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
          contactName: 'Alex Vance',
          contactEmail: 'alex@campus.edu',
          contactPhone: '+1 555-0192'
        },
        {
          id: 'item-106',
          reportId: 'RET-F-2026-003',
          userId: 'u2',
          type: 'found',
          name: 'Student ID Card (CSE)',
          category: 'ID Cards',
          brand: 'Campus ID',
          color: 'White',
          description: 'Found CS student ID card on 2nd floor silent reading zone.',
          uniqueFeatures: 'Black campus logo lanyard.',
          date: '2026-09-19',
          time: '10:45 AM',
          location: 'Library',
          storageLocation: 'Library Front Desk',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
          contactName: 'Library Staff',
          contactEmail: 'library@campus.edu',
          contactPhone: '+1 555-0188'
        },
        {
          id: 'item-107',
          reportId: 'RET-L-2026-004',
          userId: 'u1',
          type: 'lost',
          name: 'Wireless Earbuds',
          category: 'Electronics',
          brand: 'Apple',
          color: 'White',
          description: 'AirPods Pro in white charging case.',
          uniqueFeatures: 'Transparent silicone case cover with small scratch on back hinge.',
          date: '2026-09-16',
          time: '04:00 PM',
          location: 'Sports Ground',
          storageLocation: null,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
          contactName: 'Alex Vance',
          contactEmail: 'alex@campus.edu',
          contactPhone: '+1 555-0192'
        },
        {
          id: 'item-108',
          reportId: 'RET-F-2026-004',
          userId: 'u2',
          type: 'found',
          name: 'White Earbuds Case',
          category: 'Electronics',
          brand: 'Apple',
          color: 'White',
          description: 'AirPods case found near basketball court bleachers.',
          uniqueFeatures: 'Clear outer sleeve cover.',
          date: '2026-09-16',
          time: '05:30 PM',
          location: 'Sports Ground',
          storageLocation: 'Sports Complex Desk',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
          contactName: 'Coach Dave',
          contactEmail: 'sports@campus.edu',
          contactPhone: '+1 555-0167'
        },
        {
          id: 'item-109',
          reportId: 'RET-L-2026-005',
          userId: 'u1',
          type: 'lost',
          name: 'Mathematics Book',
          category: 'Books',
          brand: 'Pearson',
          color: 'Blue',
          description: 'Discrete Mathematics 8th Edition textbook.',
          uniqueFeatures: 'Highlighter marks on Chapter 3 & student name inside cover.',
          date: '2026-09-15',
          time: '11:00 AM',
          location: 'Hostel',
          storageLocation: null,
          status: 'recovered',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          contactName: 'Alex Vance',
          contactEmail: 'alex@campus.edu',
          contactPhone: '+1 555-0192'
        },
        {
          id: 'item-110',
          reportId: 'RET-F-2026-005',
          userId: 'u2',
          type: 'found',
          name: 'Engineering Mathematics Book',
          category: 'Books',
          brand: 'Pearson',
          color: 'Blue',
          description: 'Found textbook in Hostel Block B common study hall.',
          uniqueFeatures: 'Has yellow post-it note bookmarks.',
          date: '2026-09-15',
          time: '01:00 PM',
          location: 'Hostel',
          storageLocation: 'Hostel Warden Office',
          status: 'recovered',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          contactName: 'Warden Office',
          contactEmail: 'hostel@campus.edu',
          contactPhone: '+1 555-0122'
        }
      ];

      const stmtItem = db.prepare(`
        INSERT INTO items (
          id, reportId, userId, type, name, category, brand, color,
          description, uniqueFeatures, date, time, location, storageLocation,
          status, image, contactName, contactEmail, contactPhone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      itemsData.forEach(item => {
        stmtItem.run(
          item.id, item.reportId, item.userId, item.type, item.name, item.category, item.brand, item.color,
          item.description, item.uniqueFeatures, item.date, item.time, item.location, item.storageLocation,
          item.status, item.image, item.contactName, item.contactEmail, item.contactPhone
        );
      });
      stmtItem.finalize();

      // Seed Initial Claims
      const stmtClaim = db.prepare(`
        INSERT INTO claims (id, itemId, userId, userBeliefReason, uniqueFeatureAnswer, lastSeenLocationAnswer, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmtClaim.run(
        'claim-101',
        'item-102',
        'u1',
        'The Swissgear backpack matched all my lost item details exactly and has my turtle keychain.',
        'Blue turtle keychain with minor zipper scratch',
        'Left on chair in CSE Block Lab 4',
        'pending'
      );
      stmtClaim.finalize();

      console.log('Database seeded successfully.');
      resolve();
    });
  });
};

export default db;
