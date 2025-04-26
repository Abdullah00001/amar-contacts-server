const fs = require('fs');
const path = require('path');

// Function to create the directories and test files
const createTestFiles = (moduleName) => {
  const baseDir = path.join(__dirname, '..', '__tests__'); // Assuming __tests__ is in the project root

  // Directory paths
  const unitDir = path.join(baseDir, moduleName, 'unit');
  const integrationDir = path.join(baseDir, moduleName, 'integration');

  // Create directories if they don't exist
  if (!fs.existsSync(unitDir)) {
    fs.mkdirSync(unitDir, { recursive: true });
    console.log(`📁 Created folder: ${unitDir}`);
  } else {
    console.log(`📁 Folder already exists: ${unitDir}`);
  }

  if (!fs.existsSync(integrationDir)) {
    fs.mkdirSync(integrationDir, { recursive: true });
    console.log(`📁 Created folder: ${integrationDir}`);
  } else {
    console.log(`📁 Folder already exists: ${integrationDir}`);
  }

  // Test file content template
  const testContentTemplate = (testType, fileName) => `
describe('${testType} - ${fileName}', () => {
  it('should test ${fileName} functionality', async () => {
    // Add test logic for ${fileName}
  });
});
`;

  // Define test file names for controllers, repositories, services, and middleware
  const testFiles = [
    {
      type: 'controller',
      fileName: `${moduleName.toLowerCase()}.controllers.test.ts`,
    },
    {
      type: 'repository',
      fileName: `${moduleName.toLowerCase()}.repositories.test.ts`,
    },
    {
      type: 'service',
      fileName: `${moduleName.toLowerCase()}.services.test.ts`,
    },
    {
      type: 'middleware',
      fileName: `${moduleName.toLowerCase()}.middleware.test.ts`,
    },
  ];

  // Create unit test files
  testFiles.forEach(({ type, fileName }) => {
    const filePath = path.join(unitDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, testContentTemplate('Unit Test', fileName));
      console.log(`📄 Created file: ${filePath}`);
    } else {
      console.log(`⚠️ File already exists: ${filePath}`);
    }
  });

  // Create integration test files
  testFiles.forEach(({ type, fileName }) => {
    const filePath = path.join(integrationDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        testContentTemplate('Integration Test', fileName)
      );
      console.log(`📄 Created file: ${filePath}`);
    } else {
      console.log(`⚠️ File already exists: ${filePath}`);
    }
  });

  // Final completion message
  console.log(`✅ Module '${moduleName}' setup complete.`);
};

// Get the module name from the command line argument
const moduleName = process.argv[2];

if (!moduleName) {
  console.error(`❌ Please provide a module name (e.g., user)`);
  process.exit(1);
}

// Call the function to create test files
createTestFiles(moduleName);
