// Firebase client configuration identifies the project; it is not an administrator credential.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, reload, signOut } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
const app = initializeApp({apiKey:'AIzaSyBS55SAF6OSu6RLFlK1uzMperZmiVIHlAQ',authDomain:'cfj-management-system.firebaseapp.com',projectId:'cfj-management-system',storageBucket:'cfj-management-system.firebasestorage.app',messagingSenderId:'1014794356097',appId:'1:1014794356097:web:1b64ca8c5e758bb5ee1480'});
const auth = getAuth(app);
const el = id => document.getElementById(id);
let busy = false;
function render(user) {
 el('signed-in').hidden = !user;
 el('account-form').hidden = !!user;
 el('google').hidden = !!user;
 el('identity').textContent = user ? `${user.email || 'Google account'} · ${user.emailVerified ? 'Email verified' : 'Email verification pending'}` : '';
 el('verify').hidden = !!user?.emailVerified;
}
async function run(action) {
 if(busy) return;
 busy = true; document.querySelectorAll('button').forEach(b=>b.disabled=true);
 el('status').textContent='Contacting account service…';
 try { el('status').textContent=await action(); }
 catch(error) {
  const messages={'auth/unauthorized-domain':'This website domain must be added to Firebase Authorized domains.','auth/popup-blocked':'Allow the Google sign-in popup and retry.','auth/popup-closed-by-user':'Google sign-in was cancelled.','auth/operation-not-allowed':'Enable this sign-in provider in Firebase.','auth/weak-password':'Choose a stronger password with at least six characters.','auth/too-many-requests':'Too many attempts. Please wait before retrying.'};
  el('status').textContent=messages[error.code] || 'Request failed. Check your details and internet connection, then retry.';
 } finally { busy=false; el('password').value=''; document.querySelectorAll('button').forEach(b=>b.disabled=false); render(auth.currentUser); }
}
// Wait for session persistence before accepting credentials. No demo role is granted by this page.
try {
 await setPersistence(auth,browserSessionPersistence);
 onAuthStateChanged(auth,user=>render(user));
 el('status').textContent='Ready to sign in.';
 el('account-form').onsubmit=e=>{e.preventDefault();run(async()=>{await signInWithEmailAndPassword(auth,el('email').value.trim(),el('password').value);return 'Signed in. Check your verification status above.';});};
 el('register').onclick=()=>{if(!el('account-form').reportValidity())return;run(async()=>{const result=await createUserWithEmailAndPassword(auth,el('email').value.trim(),el('password').value);try{await sendEmailVerification(result.user);return 'Account created. Check your inbox for verification.';}catch{return 'Account created, but the verification email failed. Use Send verification email to retry.';}});};
 el('google').onclick=()=>run(async()=>{await signInWithPopup(auth,new GoogleAuthProvider());return 'Signed in with Google.';});
 el('verify').onclick=()=>run(async()=>{if(!auth.currentUser)throw Error();await sendEmailVerification(auth.currentUser);return 'Verification email sent. Check your inbox.';});
 el('reload').onclick=()=>run(async()=>{if(!auth.currentUser)throw Error();await reload(auth.currentUser);return auth.currentUser.emailVerified?'Email verified.':'Email is not verified yet. Open the link in your inbox, then check again.';});
 el('reset').onclick=()=>{if(!el('email').reportValidity())return;run(async()=>{await sendPasswordResetEmail(auth,el('email').value.trim());return 'If this account is eligible, a reset email will arrive.';});};
 el('logout').onclick=()=>run(async()=>{await signOut(auth);return 'Signed out.';});
} catch { el('status').textContent='Account service could not initialise. Check browser storage permissions and reload.'; document.querySelectorAll('button').forEach(b=>b.disabled=true); }
