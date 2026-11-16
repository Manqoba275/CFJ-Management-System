import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, sendEmailVerification, sendPasswordResetEmail, signOut, reload } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, doc, getDoc, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const config = {
  apiKey: 'AIzaSyBS55SAF6OSu6RLFlK1uzMperZmiVIHlAQ',
  authDomain: 'cfj-management-system.firebaseapp.com',
  projectId: 'cfj-management-system',
  storageBucket: 'cfj-management-system.firebasestorage.app',
  messagingSenderId: '1014794356097',
  appId: '1:1014794356097:web:1b64ca8c5e758bb5ee1480'
};
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
const status = $('status');
const profileStatus = $('profile-status');
const goals = ['Build strength', 'Weight loss', 'Muscle tone', 'Endurance'];
let loadedVersion = null;
let activeUid = null;
const sayError = error => {
  const code = error?.code || '';
  const messages = {
    'auth/email-already-in-use': 'An account already uses this email. Sign in instead.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/popup-closed-by-user': 'Google sign-in was closed before it finished.',
    'permission-denied': 'Firestore denied this action. Verify your email and make sure the current Firestore rules are published.'
  };
  return messages[code] || error?.message || 'The request could not be completed.';
};
await setPersistence(auth, browserSessionPersistence);

$('account-form').addEventListener('submit', async event => {
  event.preventDefault(); status.textContent = 'Signing in…';
  try { await signInWithEmailAndPassword(auth, $('email').value.trim(), $('password').value); status.textContent = 'Signed in.'; }
  catch (error) { status.textContent = sayError(error); }
});
$('register').addEventListener('click', async () => {
  status.textContent = 'Creating account…';
  try {
    const credential = await createUserWithEmailAndPassword(auth, $('email').value.trim(), $('password').value);
    await sendEmailVerification(credential.user); status.textContent = 'Account created. Check your email, verify it, then return and choose Check verification.';
  } catch (error) { status.textContent = sayError(error); }
});
$('google').addEventListener('click', async () => {
  status.textContent = 'Opening Google sign-in…';
  try { await signInWithPopup(auth, new GoogleAuthProvider()); status.textContent = 'Signed in with Google.'; }
  catch (error) { status.textContent = sayError(error); }
});
$('reset').addEventListener('click', async () => {
  if (!$('email').value.trim()) { status.textContent = 'Enter your email first.'; return; }
  try { await sendPasswordResetEmail(auth, $('email').value.trim()); status.textContent = 'Password reset email sent.'; }
  catch (error) { status.textContent = sayError(error); }
});
$('verify').addEventListener('click', async () => {
  try { await sendEmailVerification(auth.currentUser); status.textContent = 'Verification email sent.'; }
  catch (error) { status.textContent = sayError(error); }
});
$('reload').addEventListener('click', async () => {
  try { await reload(auth.currentUser); onAuthChanged(auth.currentUser); }
  catch (error) { status.textContent = sayError(error); }
});
$('logout').addEventListener('click', () => signOut(auth).catch(error => { status.textContent = sayError(error); }));

function profileRef(uid) { return doc(db, 'members', uid); }
function readForm() {
  const displayName = $('shared-name').value.trim(); const goal = $('shared-goal').value;
  if (displayName.length < 2 || displayName.length > 60 || !goals.includes(goal)) throw new Error('Enter a name of 2–60 characters and choose a listed training goal.');
  return { displayName, goal };
}
function requireVerified() {
  if (!auth.currentUser) throw new Error('Sign in before using your member profile.');
  if (!auth.currentUser.emailVerified) throw new Error('Verify your email before saving a member profile.');
  return auth.currentUser;
}
async function loadProfile() {
  const user = requireVerified(); profileStatus.textContent = 'Loading profile…';
  const snap = await getDoc(profileRef(user.uid));
  if (!snap.exists()) { loadedVersion = null; profileStatus.textContent = 'No shared profile yet. Choose Register with CFJ.'; return; }
  const data = snap.data();
  if (data.uid !== user.uid || !Number.isInteger(data.version) || !goals.includes(data.goal)) throw new Error('The saved profile has invalid data. Contact CFJ support.');
  $('shared-name').value = data.displayName; $('shared-goal').value = data.goal;
  loadedVersion = data.version; $('profile-save').disabled = false;
  profileStatus.textContent = 'Profile loaded from Firestore.';
}
$('profile-register').addEventListener('click', async () => {
  try {
    const user = requireVerified(), value = readForm(); profileStatus.textContent = 'Registering…';
    await runTransaction(db, async tx => {
      const ref = profileRef(user.uid), snap = await tx.get(ref);
      if (snap.exists()) throw new Error('A member profile already exists. Load it before saving changes.');
      tx.set(ref, { uid: user.uid, ...value, version: 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    });
    await loadProfile(); profileStatus.textContent = 'Member profile registered and saved.';
  } catch (error) { profileStatus.textContent = sayError(error); }
});
$('profile-load').addEventListener('click', async () => { try { await loadProfile(); } catch (error) { profileStatus.textContent = sayError(error); } });
$('profile-save').addEventListener('click', async () => {
  try {
    const user = requireVerified(), value = readForm();
    if (loadedVersion === null) throw new Error('Load your profile before saving changes.');
    const expected = loadedVersion; profileStatus.textContent = 'Saving…';
    await runTransaction(db, async tx => {
      const ref = profileRef(user.uid), snap = await tx.get(ref);
      if (!snap.exists() || snap.data().version !== expected) throw new Error('This profile changed elsewhere. Load it again before saving.');
      tx.update(ref, { ...value, version: expected + 1, updatedAt: serverTimestamp() });
    });
    await loadProfile(); profileStatus.textContent = 'Changes saved to your shared profile.';
  } catch (error) { profileStatus.textContent = sayError(error); }
});

function onAuthChanged(user) {
  const signed = Boolean(user);
  $('signed-in').hidden = !signed; $('profile-panel').hidden = !signed;
  $('identity').textContent = signed ? `Signed in as ${user.email || 'Google user'} · ${user.emailVerified ? 'email verified' : 'email not verified'}` : '';
  $('verify').hidden = !signed || user.emailVerified;
  $('reload').hidden = !signed || user.emailVerified;
  if (!signed) { loadedVersion = null; activeUid = null; profileStatus.textContent = ''; return; }
  if (activeUid !== user.uid) { loadedVersion = null; activeUid = user.uid; $('profile-save').disabled = true; $('shared-name').value = user.displayName || ''; }
  status.textContent = user.emailVerified ? 'Signed in. Email verified.' : 'Signed in. Verify your email to use the shared profile.';
  if (user.emailVerified) loadProfile().catch(error => { profileStatus.textContent = sayError(error); });
  else profileStatus.textContent = 'Verify your email before registering or saving a shared profile.';
}
onAuthStateChanged(auth, onAuthChanged);
status.textContent = 'Account service ready.';
