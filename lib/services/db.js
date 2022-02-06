import { db } from "@lib/services/firebase";
import {
  serverTimestamp,
  increment,
  collection,
  query,
  where,
  limit,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  orderBy,
  setDoc,
} from "firebase/firestore";

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

/**
 * Gets a users/{uid} document with uid
 * @param {string} uid
 */
export async function getUserWithUid(uid) {
  return await getDoc(doc(db, "users", uid));
}

/**
 * Gets a users/{uid} document reference
 * @param {string} uid
 */
export function getUserDoc(uid) {
  return doc(db, "users", uid);
}

/**
 * Gets a usernames/{username} document reference
 * @param {string} username
 */
export function getUsernamesDoc(username) {
  return doc(db, "usernames", username);
}

/**
 * Gets a list containing all usernames
 */
export async function getUsernames() {
  const qSnap = await getDocs(query(collection(db, "usernames")));
  return qSnap.docs.map((doc) => doc.id);
}

/**
 * Gets a document snap given a doc reference
 * @param {DocumentReference} ref
 */
export async function getSnap(ref) {
  return await getDoc(ref);
}

/**
 * Creates a batch
 */
export function createBatch() {
  return writeBatch(db);
}

/**
 * Gets the last `n` reviews from user given `uid`
 * @param  {string} uid
 * @param  {number} n
 */
export async function getNReviewsOf(uid, n) {
  const reviewQuery = query(
    collection(db, `users/${uid}/reviews`),
    orderBy("createdAt", "desc"),
    limit(n)
  );

  const snap = await getDocs(reviewQuery);

  return snap.empty ? null : snap.docs.map(reviewToJSON);
}

/**
 * Gets the reviews from user given `uid`
 * @param  {string} uid
 */
export async function getReviewsOf(uid) {
  const reviewQuery = query(
    collection(db, `users/${uid}/reviews`),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(reviewQuery);

  return snap.empty ? null : snap.docs.map(reviewToJSON);
}

/**
 * Save review for username with uid
 * @param  {object} data
 * @param  {string} uid
 * @param  {number} movieId
 */
export async function saveReview(data, uid, movieId) {
  const reviewRef = doc(db, `users/${uid}/reviews/${movieId}`);
  await setDoc(reviewRef, { ...data, createdAt: serverTimestamp() });
}

/**
 * Get review for username with uid and movieId
 * @param  {string} uid
 * @param  {number} movieId
 */
export async function getReview(uid, movieId) {
  const reviewRef = doc(db, `users/${uid}/reviews/${movieId}`);

  return reviewToJSON(await getDoc(reviewRef));
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function reviewToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt?.toMillis() || 0,
    id: doc.id,
  };
}
