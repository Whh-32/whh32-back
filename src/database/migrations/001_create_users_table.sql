-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        first_name NVARCHAR(50) NULL,
        last_name NVARCHAR(50) NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        last_login DATETIME2 NULL,
        CONSTRAINT CHK_Email CHECK (email LIKE '%_@_%._%')
    );

    -- Create indexes
    CREATE INDEX IDX_Users_Username ON Users(username);
    CREATE INDEX IDX_Users_Email ON Users(email);
    
    PRINT 'Users table created successfully';
END
ELSE
BEGIN
    PRINT 'Users table already exists';
END
GO
