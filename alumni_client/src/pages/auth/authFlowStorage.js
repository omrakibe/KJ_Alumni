const VERIFY_EMAIL_KEY = "kjcoemrPendingVerificationEmail";
const RESET_FLOW_KEY = "kjcoemrPasswordResetFlow";

export function storeVerificationEmail(email) {
  try { sessionStorage.setItem(VERIFY_EMAIL_KEY, email); } catch { /* no-op */ }
}

export function readVerificationEmail() {
  try { return sessionStorage.getItem(VERIFY_EMAIL_KEY) || ""; } catch { return ""; }
}

export function clearVerificationEmail() {
  try { sessionStorage.removeItem(VERIFY_EMAIL_KEY); } catch { /* no-op */ }
}

export function storePasswordResetFlow(flow) {
  try { sessionStorage.setItem(RESET_FLOW_KEY, JSON.stringify(flow)); } catch { /* no-op */ }
}

export function readPasswordResetFlow() {
  try { return JSON.parse(sessionStorage.getItem(RESET_FLOW_KEY) || "null") || {}; } catch { return {}; }
}

export function clearPasswordResetFlow() {
  try { sessionStorage.removeItem(RESET_FLOW_KEY); } catch { /* no-op */ }
}
