/** Domain used by school-issued email addresses. */
export const SCHOOL_EMAIL_DOMAIN = "@acdeducation.com";

/** User-facing message for an unapproved external email. */
export const SCHOOL_EMAIL_REQUIRED_MESSAGE = `Email must end in ${SCHOOL_EMAIL_DOMAIN} unless an external email is allowed`;

/**
 * Checks whether an email address belongs to the school domain.
 *
 * @param email - The email address to evaluate.
 * @returns `true` when the trimmed, lowercased address ends with
 *          {@link SCHOOL_EMAIL_DOMAIN}.
 */
export function isSchoolEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(SCHOOL_EMAIL_DOMAIN);
}

/**
 * Checks whether an email may be used for an invitation.
 *
 * @param email - The email address to evaluate.
 * @param allowExternalEmail - Whether an explicitly approved external address
 *                             is allowed.
 * @returns `true` for school emails and approved external emails.
 */
export function isAllowedEmail(email: string, allowExternalEmail: boolean): boolean {
  return allowExternalEmail || isSchoolEmail(email);
}
