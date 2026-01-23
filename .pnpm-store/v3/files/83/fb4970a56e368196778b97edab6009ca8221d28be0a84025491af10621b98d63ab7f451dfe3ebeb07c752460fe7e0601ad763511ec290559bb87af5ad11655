/**
 * Base types and helpers for server-side user app singletons
 * (AdminApp, ClientApp, ProviderApp).
 *
 * Centralizes common env-flag handling and logging so individual
 * user apps can "inherit" shared behavior.
 */
/**
 * Optional multi-role env flag.
 * Example: AGENTIC_TRUST_APP_ROLES="provider|client"
 */
const ROLE_LIST_ENV_VAR = 'AGENTIC_TRUST_APP_ROLES';
/**
 * Check if a given user app role is enabled based on its environment flag.
 *
 * Legacy (still supported for backwards-compatibility):
 * - admin    → AGENTIC_TRUST_IS_ADMIN_APP
 * - client   → AGENTIC_TRUST_IS_CLIENT_APP
 * - provider → AGENTIC_TRUST_IS_PROVIDER_APP
 *
 * Preferred: use AGENTIC_TRUST_APP_ROLES with a '|'‑separated list
 * of roles (e.g. "provider|client"). Falls back to legacy flags.
 */
export function isUserAppEnabled(role) {
    // New style: AGENTIC_TRUST_APP_ROLES="provider|client"
    const rolesRaw = process.env[ROLE_LIST_ENV_VAR];
    if (rolesRaw && rolesRaw.trim().length > 0) {
        const roles = rolesRaw
            .split('|')
            .map((r) => r.trim().toLowerCase())
            .filter(Boolean);
        const roleName = role.toLowerCase();
        if (roles.includes(roleName)) {
            return true;
        }
    }
    // Backwards-compatible: legacy boolean-ish flags per role
    const legacyEnvVarName = role === 'admin'
        ? 'AGENTIC_TRUST_IS_ADMIN_APP'
        : role === 'client'
            ? 'AGENTIC_TRUST_IS_CLIENT_APP'
            : role === 'provider'
                ? 'AGENTIC_TRUST_IS_PROVIDER_APP'
                : 'AGENTIC_TRUST_IS_VALIDATOR_APP';
    const raw = process.env[legacyEnvVarName];
    if (!raw)
        return false;
    const value = raw.trim().toLowerCase();
    return value === 'true' || value === '1';
}
function roleLabel(role) {
    switch (role) {
        case 'admin':
            return 'AdminApp';
        case 'client':
            return 'ClientApp';
        case 'provider':
            return 'ProviderApp';
        case 'validator':
            return 'ValidatorApp';
        default:
            return 'UserApp';
    }
}
export function logUserAppInitStart(role, extra) {
    const label = roleLabel(role);
    if (extra) {
        console.log(`🔧 ${label}: starting initialization...`, extra);
    }
    else {
        console.log(`🔧 ${label}: starting initialization...`);
    }
}
export function logUserAppInitSuccess(role, detail) {
    const label = roleLabel(role);
    if (detail) {
        console.log(`✅ ${label} initialized:`, detail);
    }
    else {
        console.log(`✅ ${label} initialized`);
    }
}
export function logUserAppInitFailure(role, error) {
    const label = roleLabel(role);
    console.error(`❌ Failed to initialize ${label}:`, error);
}
//# sourceMappingURL=userApp.js.map