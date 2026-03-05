// Simple auth utilities for localStorage-based authentication
import crypto from 'crypto';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  avgCycleLength: number;
  lastPeriodDate: string;
  createdAt: string;
}

interface AuthToken {
  userId: string;
  email: string;
  expiresAt: number;
}

const USERS_KEY = 'cycle_users';
const AUTH_TOKEN_KEY = 'cycle_auth_token';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple password hashing simulation (in production, use bcrypt on backend)
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + 'cycle_app_salt')
    .digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function generateUserId(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  age: number;
  avgCycleLength: number;
  lastPeriodDate: string;
}): User | null {
  if (typeof window === 'undefined') return null;

  const users = getUsersFromStorage();

  // Check if email already exists
  if (users.some((u) => u.email === userData.email)) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    id: generateUserId(),
    name: userData.name,
    email: userData.email,
    age: userData.age,
    avgCycleLength: userData.avgCycleLength,
    lastPeriodDate: userData.lastPeriodDate,
    createdAt: new Date().toISOString(),
  };

  users.push({
    ...newUser,
    // Store password hash (in production, never store in localStorage!)
    passwordHash: hashPassword(userData.password),
  } as any);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
}

export function loginUser(email: string, password: string): { user: User; token: string } | null {
  if (typeof window === 'undefined') return null;

  const users = getUsersFromStorage();
  const user = users.find((u) => u.email === email) as any;

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid email or password');
  }

  // Create auth token
  const token: AuthToken = {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + TOKEN_EXPIRY,
  };

  const encodedToken = Buffer.from(JSON.stringify(token)).toString('base64');
  localStorage.setItem(AUTH_TOKEN_KEY, encodedToken);

  // Return user without password hash
  const { passwordHash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: encodedToken };
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken(): AuthToken | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.expiresAt < Date.now()) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const token = getAuthToken();
  if (!token) return null;

  const users = getUsersFromStorage();
  return users.find((u) => u.id === token.userId) || null;
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

function getUsersFromStorage(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  if (typeof window === 'undefined') return null;

  const users = getUsersFromStorage();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return users[userIndex];
}

// Demo data initialization
export function initializeDemoData(): void {
  if (typeof window === 'undefined') return;

  const existingUsers = localStorage.getItem(USERS_KEY);
  if (existingUsers) return; // Don't overwrite existing data

  const demoUser: User & { passwordHash: string } = {
    id: 'demo-user-001',
    name: 'Demo User',
    email: 'demo@example.com',
    age: 28,
    avgCycleLength: 28,
    lastPeriodDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword('password123'),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([demoUser]));
}
