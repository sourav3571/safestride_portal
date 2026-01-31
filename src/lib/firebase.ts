import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  addDoc, 
  collection, 
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  QueryConstraint
} from "firebase/firestore";

// Firebase project configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// ==================== INCIDENT REPORTS ====================

export type IncidentReport = {
  id?: string;
  location: string;
  latitude: number;
  longitude: number;
  incidentType: string;
  description?: string;
  isAnonymous: boolean;
  severity: "low" | "medium" | "high" | "critical";
  createdAt?: unknown;
  updatedAt?: unknown;
};

export const saveIncidentReport = async (data: IncidentReport) => {
  const docRef = await addDoc(collection(db, "incidentReports"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef;
};

export const getIncidentReports = async (filters?: {
  incidentType?: string;
  severity?: string;
  radiusKm?: number;
  center?: { lat: number; lng: number };
}): Promise<(IncidentReport & { id: string })[]> => {
  const constraints: QueryConstraint[] = [];
  
  if (filters?.incidentType) {
    constraints.push(where("incidentType", "==", filters.incidentType));
  }
  if (filters?.severity) {
    constraints.push(where("severity", "==", filters.severity));
  }

  const q = query(collection(db, "incidentReports"), ...constraints);
  const snapshot = await getDocs(q);
  
  let reports = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (IncidentReport & { id: string })[];

  // Client-side radius filtering if needed
  if (filters?.radiusKm && filters?.center) {
    const radiusInDegrees = filters.radiusKm / 111; // 1 degree ≈ 111 km
    reports = reports.filter(report => {
      const distance = Math.sqrt(
        Math.pow(report.latitude - filters.center!.lat, 2) +
        Math.pow(report.longitude - filters.center!.lng, 2)
      );
      return distance <= radiusInDegrees;
    });
  }

  return reports;
};

export const updateIncidentReport = async (id: string, data: Partial<IncidentReport>) => {
  const docRef = doc(db, "incidentReports", id);
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteIncidentReport = async (id: string) => {
  return deleteDoc(doc(db, "incidentReports", id));
};

// ==================== SAFE ZONES ====================

export type SafeZone = {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  type: "police_station" | "hospital" | "community_center" | "safe_house" | "public_space";
  description?: string;
  createdAt?: unknown;
};

export const saveSafeZone = async (data: SafeZone) => {
  return addDoc(collection(db, "safeZones"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getSafeZones = async (): Promise<(SafeZone & { id: string })[]> => {
  const snapshot = await getDocs(collection(db, "safeZones"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (SafeZone & { id: string })[];
};

export const getSafeZonesNearby = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<(SafeZone & { id: string })[]> => {
  const zones = await getSafeZones();
  const radiusInDegrees = radiusKm / 111;
  
  return zones.filter(zone => {
    const distance = Math.sqrt(
      Math.pow(zone.latitude - latitude, 2) +
      Math.pow(zone.longitude - longitude, 2)
    );
    return distance <= radiusInDegrees;
  });
};

export const deleteSafeZone = async (id: string) => {
  return deleteDoc(doc(db, "safeZones", id));
};

// ==================== SOS LOGS ====================

export type SOSLog = {
  id?: string;
  type: "HOLD_COMPLETE" | "CLICK_NUMBER" | "ACTIVATED" | "CANCELLED";
  label?: string;
  number?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: unknown;
};

export const logSOSAction = async (data: SOSLog) => {
  return addDoc(collection(db, "sosLogs"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getSOSLogs = async (limit: number = 100): Promise<(SOSLog & { id: string })[]> => {
  const q = query(collection(db, "sosLogs"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .slice(-limit)
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (SOSLog & { id: string })[];
};

// ==================== USER PREFERENCES ====================

export type UserPreference = {
  id?: string;
  userId: string;
  trustedContacts?: string[];
  emergencyNumbers?: string[];
  notificationPreferences?: {
    incidentAlerts: boolean;
    safetyTips: boolean;
    tripUpdates: boolean;
  };
  createdAt?: unknown;
  updatedAt?: unknown;
};

export const saveUserPreference = async (data: UserPreference) => {
  const constraints = [where("userId", "==", data.userId)];
  const q = query(collection(db, "userPreferences"), ...constraints);
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return addDoc(collection(db, "userPreferences"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    const docId = snapshot.docs[0].id;
    await updateDoc(doc(db, "userPreferences", docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return doc(db, "userPreferences", docId);
  }
};

export const getUserPreference = async (userId: string): Promise<(UserPreference & { id: string }) | null> => {
  const q = query(collection(db, "userPreferences"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as UserPreference & { id: string };
};

// ==================== TRIP SHARES ====================

export type TripShare = {
  id?: string;
  contacts: string[];
  startedAt?: unknown;
  startLatitude?: number;
  startLongitude?: number;
};

export const logTripShareStart = async (data: {
  contacts: string[];
  startLatitude?: number;
  startLongitude?: number;
}) => {
  return addDoc(collection(db, "tripShares"), {
    contacts: data.contacts,
    startLatitude: data.startLatitude ?? null,
    startLongitude: data.startLongitude ?? null,
    startedAt: serverTimestamp(),
  });
};
