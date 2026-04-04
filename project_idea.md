# Trace — Donation Impact Tracking Platform

## Overview
A platform that allows donors to track exactly where their money goes, with direct impact metrics provided by nonprofits (NPOs).

---

## Problem
- Low donor retention due to lack of transparency
- Donors often do not know how their contributions are used
- Limited visibility into real-world impact of donations
- Trust gap between donors and organizations

---

## Solution
Trace provides:
- Clear tracking of how each donation is allocated
- Impact metrics tied to real spending
- Improved transparency for nonprofit financial usage
- A more engaging and trust-driven donor experience

---

## Key Features

### Donor Dashboard
- Personalized view based on:
  - Donation amount
  - Supported organizations
- Breakdown of where funds were allocated
- Visual representation (icons/images) of funded items
- Donation history and receipts

### Organization Dashboard
- Track incoming donations
- Manage financial records
- Upload spending receipts:
  - What the money was used for
  - Amount spent
- Allocate expenses to donor funds

### Authentication
- Donor login:
  - Tracks donation amount and organization
- Organization login:
  - Tracks financial activity and reporting

### Receipts
- Automatic email receipts sent to donors after donation

---

## Allocation System (Matching Algorithm)
**Approach: First-In, First-Out (FIFO)**

Example:
- Organization spends:
  - $500 on X
  - $300 on Y
- Donors:
  - Donor A donates $400 (first)
  - Donor B donates $400 (second)

**Result:**
- Donor A:
  - $400 → X
- Donor B:
  - $100 → X
  - $300 → Y

### UI Considerations
- Clear mapping of donor funds to expenses
- Visual elements for each expense (icons/images)
- Simple, intuitive breakdown of split allocations

---

## Challenges / Limitations
- Multiple donors funding the same expense
- Need to generalize across diverse nonprofit missions
- Ensuring accurate and honest reporting from organizations
- Complexity in presenting partial allocations clearly

---

## Future Opportunities
- Impact scoring system
- Real-time updates on fund usage
- Integration with payment platforms
- Public transparency pages for organizations