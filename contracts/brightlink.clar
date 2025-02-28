;; BrightLink Professional Networking Contract

;; Data structures
(define-map profiles
  principal
  {
    name: (string-ascii 64),
    title: (string-ascii 64),
    about: (string-ascii 256),
    visible: bool
  }
)

(define-map contacts
  { owner: principal, contact: principal }
  {
    notes: (string-ascii 256),
    added-at: uint,
    status: (string-ascii 20)
  }
)

(define-map reminders
  { owner: principal, contact: principal }
  {
    timestamp: uint,
    note: (string-ascii 256),
    completed: bool
  }
)

;; Error codes
(define-constant err-profile-exists (err u100))
(define-constant err-profile-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-contact (err u103))

;; Profile management
(define-public (create-profile (name (string-ascii 64)) (title (string-ascii 64)) (about (string-ascii 256)))
  (let ((profile-exists (map-get? profiles tx-sender)))
    (if (is-some profile-exists)
      err-profile-exists
      (ok (map-set profiles tx-sender 
        {
          name: name,
          title: title,
          about: about,
          visible: true
        }
      ))
    )
  )
)

(define-public (update-profile (name (string-ascii 64)) (title (string-ascii 64)) (about (string-ascii 256)))
  (let ((profile (map-get? profiles tx-sender)))
    (if (is-none profile)
      err-profile-not-found
      (ok (map-set profiles tx-sender
        {
          name: name,
          title: title,
          about: about,
          visible: (get visible (unwrap-panic profile))
        }
      ))
    )
  )
)

;; Contact management 
(define-public (add-contact (contact principal) (notes (string-ascii 256)))
  (if (and
    (not (is-eq tx-sender contact))
    (is-some (map-get? profiles contact)))
    (ok (map-set contacts {owner: tx-sender, contact: contact}
      {
        notes: notes,
        added-at: block-height,
        status: "active"
      }))
    err-invalid-contact
  )
)

(define-public (update-contact-notes (contact principal) (notes (string-ascii 256)))
  (let ((contact-entry (map-get? contacts {owner: tx-sender, contact: contact})))
    (if (is-none contact-entry)
      err-invalid-contact
      (ok (map-set contacts {owner: tx-sender, contact: contact}
        (merge (unwrap-panic contact-entry)
          { notes: notes }
        )
      ))
    )
  )
)

;; Reminder management
(define-public (set-reminder (contact principal) (timestamp uint) (note (string-ascii 256)))
  (let ((contact-entry (map-get? contacts {owner: tx-sender, contact: contact})))
    (if (is-none contact-entry)
      err-invalid-contact
      (ok (map-set reminders {owner: tx-sender, contact: contact}
        {
          timestamp: timestamp,
          note: note,
          completed: false
        }
      ))
    )
  )
)

;; Read-only functions
(define-read-only (get-profile (user principal))
  (map-get? profiles user)
)

(define-read-only (get-contact (owner principal) (contact principal))
  (map-get? contacts {owner: owner, contact: contact})
)

(define-read-only (get-reminder (owner principal) (contact principal))
  (map-get? reminders {owner: owner, contact: contact})
)
