-- Create Items table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Items')
BEGIN
    CREATE TABLE Items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(500) NULL,
        price DECIMAL(10, 2) NOT NULL,
        category NVARCHAR(50) NULL,
        user_id INT NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Items_Users FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT CHK_Price CHECK (price >= 0)
    );

    -- Create indexes
    CREATE INDEX IDX_Items_UserId ON Items(user_id);
    CREATE INDEX IDX_Items_Category ON Items(category);
    CREATE INDEX IDX_Items_Name ON Items(name);
    CREATE INDEX IDX_Items_CreatedAt ON Items(created_at DESC);
    
    PRINT 'Items table created successfully';
END
ELSE
BEGIN
    PRINT 'Items table already exists';
END
GO
