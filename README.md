# BrightLink
A professional networking dApp built on Stacks blockchain for managing contacts and follow-ups.

## Features
- Create and manage professional profiles with tags and categories
- Add and manage contacts with custom notes and categories
- Archive and restore contacts
- Set and track follow-up reminders with timestamp validation
- Control profile visibility and connection permissions
- Track contact relationship status
- Event logging for important actions

## Setup and Installation
1. Clone the repository
2. Install Clarinet (if not already installed)
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to run test suite

## Usage Examples
```clarity
;; Create a profile
(contract-call? .brightlink create-profile "John Doe" "Software Engineer" "About me")

;; Add a contact with category
(contract-call? .brightlink add-contact 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM "Met at conference" "professional")

;; Archive a contact
(contract-call? .brightlink archive-contact 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Set a follow-up reminder
(contract-call? .brightlink set-reminder 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM u1642147200 "Schedule meeting")
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment

## Contract Events
The contract emits events for important actions:
- Profile creation and updates
- Contact additions and updates
- Reminder creation
- Contact archiving
