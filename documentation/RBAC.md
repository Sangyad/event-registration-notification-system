# Role-Based Access Control (RBAC)

> This document is the human-readable mirror of the permission matrix in
> [`src/lib/security/rbac.ts`](../src/lib/security/rbac.ts). The two are the
> single source of truth for authorization and must be edited **together** -
> change a cell in the code matrix and the matching table here in the same
> change. Server Actions, the sidebar navigation, and any other UI gate all
> read from that one object.

## Roles

> **Dev accounts** are temporary and not part of the standard workflow. Admins
> should remove Dev accounts once initial setup is complete. Dev is pinned to
> **YES** on every row in code and is not listed in the tables below.

```
DEV - initial user

ADMIN
  -> OFFICER
    -> STUDENT
```

---

## Access Legend

| Code    | Access Level | Meaning                                                     |
| ------- | ------------ | ----------------------------------------------------------- |
| **YES** | Granted      | The role can perform this action everywhere.                |
| **NO**  | Denied       | The role cannot perform this action under any circumstance. |

**CRUD:**

| Code | Meaning       |
| ---- | ------------- |
| `C`  | Create/Add    |
| `R`  | Read/View     |
| `U`  | Update/Edit   |
| `D`  | Delete/Remove |

---

## Global Data Actions

### User

> Role assignment and user provisioning are managed here. Users with `CREATE`
> permission are responsible for adding new users.

| Action | Admin | Officer | Student |
| :----- | :---: | :-----: | :-----: |
| CREATE |  YES  |   NO    |   NO    |
| READ   |  YES  |   NO    |   NO    |
| UPDATE |  YES  |   NO    |   NO    |
| DELETE |  YES  |   NO    |   NO    |

### Club

> Admins provision clubs used for club-scoped notifications and user
> assignment. A club cannot be deleted while members, events, or notifications
> still reference it.

| Action | Admin | Officer | Student |
| :----- | :---: | :-----: | :-----: |
| CREATE |  YES  |   NO    |   NO    |
| READ   |  YES  |   NO    |   NO    |
| UPDATE |  YES  |   NO    |   NO    |
| DELETE |  YES  |   NO    |   NO    |

### Notification

> Sending notifications is an Officer and Admin capability. Reading one's own
> notifications (global announcements plus those scoped to the reader's club) is
> available to every authenticated role and is **not** gated by this matrix.
> Seeing **every** notification regardless of club is an Admin capability.

| Action   | Admin | Officer | Student |
| :------- | :---: | :-----: | :-----: |
| CREATE   |  YES  |   YES   |   NO    |
| READ ALL |  YES  |   NO    |   NO    |

---

## Implementation Notes

- Every exported Server Action verifies the session and evaluates its
  permission(s) at the top of the execution flow via `requirePermission(...)`
  from `src/lib/security/auth-guards.ts`. The guard accepts one or more
  permissions and authorizes when the user holds **at least one**.
- The club options read (`getClubOptionsAction`) is shared by the notification
  composer (Officers and up) and the user-assignment flows (Admins), so it uses
  the variadic guard: `requirePermission("notification.create", "user.update")`.
  It is intentionally **not** gated by `club.read`, which stays management-only
  so Officers cannot reach the Manage Clubs page.
- Client-side checks (e.g. sidebar visibility) are presentation-only and never
  a security boundary; the server re-checks every request.
