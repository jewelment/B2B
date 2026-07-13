# Enterprise Infrastructure Guide: AWS & DevOps Configuration

This document outlines the cloud infrastructure configurations required for Phase 11.0: **Enterprise Infrastructure & Backups**. These configurations must be applied by your DevOps team directly in the AWS Console, AWS CLI, or via Infrastructure-as-Code (Terraform/Pulumi).

## 11.3 Automated PITR Cloud Backups (Point-in-Time Recovery)

Since the B2B portal handles high-value wholesale transactions, standard nightly backups are insufficient. We require **Point-in-Time Recovery (PITR)**, which allows us to restore the database to any exact second in time.

### If using AWS RDS (PostgreSQL):
1. Navigate to the **Amazon RDS Console**.
2. Select the core production database instance.
3. Click **Modify**.
4. Scroll to **Backup**.
5. Set **Backup retention period** to at least `30 days`.
6. Enable **Copy tags to snapshots**.
7. Apply changes immediately.
*(This enables continuous WAL archiving, allowing us to restore to any millisecond within the 30-day window).*

### If using Supabase (PostgreSQL):
1. Navigate to the **Supabase Dashboard** -> **Project Settings** -> **Database**.
2. Navigate to **Backups**.
3. Upgrade from the free/pro tier to **PITR Add-on**.
4. Configure retention policy (7, 14, or 30 days).

## 11.4 Amazon QLDB Tamper-Proof PO Ledger

For enterprise compliance and financial auditing, we must ensure that once a Purchase Order is transmitted, its history cannot be secretly altered by a developer or database admin. Amazon Quantum Ledger Database (QLDB) provides an immutable, cryptographically verifiable ledger.

### Configuration Steps:
1. Navigate to the **Amazon QLDB Console**.
2. Create a new ledger named `B2B_PO_Compliance_Ledger`.
3. Set the Permissions Mode to `STANDARD`.
4. Enable **Deletion Protection**.
5. Once active, create the core table:
   ```sql
   CREATE TABLE PurchaseOrderLedger;
   ```
6. Set up the IAM Role allowing our Next.js application to write to this ledger.
7. Integrate the `amazon-qldb-driver-nodejs` in the codebase (This will be scheduled for the next development sprint, integrating into the `/api/checkout/execute` pipeline).

---
*Note: Ensure the corresponding AWS Access Keys and Region data are injected into the Vercel Production Environment Variables.*
