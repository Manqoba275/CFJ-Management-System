# Oracle database setup plan

Oracle Database Free is selected to match the existing Oracle relational design. This setup has not installed/provisioned Oracle or created tables.

Next: create a dedicated development schema, versioned migrations and synthetic seeds with at least ten records per required table. Implement primary/foreign keys and constraints; use transactions for booking capacity and parameterized SQL throughout. Store identity-provider UIDs rather than passwords. Keep private member fields separate from public directory responses. Decide and test backup/restore before deployment.

Record the exact installed Oracle version and connection instructions once provisioned. Keep credentials in ignored environment files, never committed SQL or client code.
