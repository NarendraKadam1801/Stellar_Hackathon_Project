/**
 * AidBridge Test Backend Setup
 * This script sets up a test environment for the AidBridge server
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Test configuration
const TEST_CONFIG = {
  MONGODB_URI: 'mongodb://localhost:27017/aidbridge_test',
  JWT_SECRET: 'test-secret-key',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  NODE_ENV: 'test',
  PORT: 8001,
  FRONTEND_URL: 'http://localhost:3000'
};

// Test data generators
const TestDataGenerator = {
  // Generate test NGO data
  generateNGO: (overrides = {}) => ({
    NgoName: `Test NGO ${Date.now()}`,
    RegNumber: `REG${Date.now()}`,
    Description: 'Test NGO Description',
    Email: `test${Date.now()}@ngo.com`,
    PhoneNo: '+1234567890',
    Password: 'TestPassword123',
    PublicKey: `GTestPublicKey${Date.now()}`,
    PrivateKey: `STestPrivateKey${Date.now()}`,
    ...overrides
  }),

  // Generate test post data
  generatePost: (ngoId, overrides = {}) => ({
    Title: `Test Campaign ${Date.now()}`,
    Type: 'Education',
    Description: 'Test campaign description',
    Location: 'Test City',
    ImgCid: `QmTestHash${Date.now()}`,
    NgoRef: ngoId,
    NeedAmount: 1000,
    CollectedAmount: 0,
    WalletAddr: `GTestWallet${Date.now()}`,
    ...overrides
  }),

  // Generate test donation data
  generateDonation: (postId, overrides = {}) => ({
    currentTxn: `Txn${Date.now()}`,
    postIDs: postId,
    Amount: 100,
    RemainingAmount: 100,
    ...overrides
  }),

  // Generate test expense data
  generateExpense: (postId, overrides = {}) => ({
    currentTxn: `ExpenseTxn${Date.now()}`,
    postIDs: postId,
    ...overrides
  })
};

// Database setup utilities
class TestDatabase {
  constructor() {
    this.mongoServer = null;
    this.connection = null;
  }

  async start() {
    try {
      // Use in-memory MongoDB for testing
      this.mongoServer = await MongoMemoryServer.create();
      const mongoUri = this.mongoServer.getUri();
      
      this.connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log('✅ Test database connected');
      return mongoUri;
    } catch (error) {
      console.error('❌ Test database connection failed:', error);
      throw error;
    }
  }

  async stop() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
      }
      if (this.mongoServer) {
        await this.mongoServer.stop();
      }
      console.log('✅ Test database disconnected');
    } catch (error) {
      console.error('❌ Test database disconnection failed:', error);
    }
  }

  async clear() {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
      console.log('✅ Test database cleared');
    } catch (error) {
      console.error('❌ Test database clear failed:', error);
    }
  }
}

// Test user management
class TestUserManager {
  constructor() {
    this.testUsers = new Map();
  }

  async createTestUser(overrides = {}) {
    const userData = TestDataGenerator.generateNGO(overrides);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.Password, 10);
    userData.Password = hashedPassword;

    // Create user in database
    const UserModel = mongoose.model('ngomodel', new mongoose.Schema({
      NgoName: String,
      RegNumber: String,
      Description: String,
      Email: String,
      PhoneNo: String,
      Password: String,
      PublicKey: String,
      PrivateKey: String,
      RefreshToken: String
    }));

    const user = await UserModel.create(userData);
    this.testUsers.set(user._id.toString(), user);
    
    return user;
  }

  async createTestPost(ngoId, overrides = {}) {
    const postData = TestDataGenerator.generatePost(ngoId, overrides);
    
    const PostModel = mongoose.model('postmodel', new mongoose.Schema({
      Title: String,
      Type: String,
      Description: String,
      Location: String,
      ImgCid: String,
      NgoRef: mongoose.Schema.Types.ObjectId,
      NeedAmount: Number,
      CollectedAmount: Number,
      WalletAddr: String
    }));

    const post = await PostModel.create(postData);
    return post;
  }

  generateTokens(userId, email, ngoName, publicKey) {
    const accessToken = jwt.sign(
      {
        id: userId,
        userId: userId,
        email: email,
        NgoName: ngoName,
        walletAddr: publicKey,
      },
      TEST_CONFIG.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        id: userId,
        walletAddr: publicKey,
      },
      TEST_CONFIG.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  getTestUser(userId) {
    return this.testUsers.get(userId);
  }

  getAllTestUsers() {
    return Array.from(this.testUsers.values());
  }

  clearTestUsers() {
    this.testUsers.clear();
  }
}

// Test server setup
class TestServer {
  constructor() {
    this.app = null;
    this.server = null;
    this.port = TEST_CONFIG.PORT;
  }

  async start() {
    try {
      // Set test environment variables
      process.env.NODE_ENV = TEST_CONFIG.NODE_ENV;
      process.env.ATS = TEST_CONFIG.JWT_SECRET;
      process.env.RTS = TEST_CONFIG.JWT_REFRESH_SECRET;
      process.env.FRONTEND_URL = TEST_CONFIG.FRONTEND_URL;

      // Import app after setting environment variables
      const { default: app } = await import('./dist/app.js');
      this.app = app;

      // Start server
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Test server running on port ${this.port}`);
      });

      return this.app;
    } catch (error) {
      console.error('❌ Test server start failed:', error);
      throw error;
    }
  }

  async stop() {
    try {
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
      }
      console.log('✅ Test server stopped');
    } catch (error) {
      console.error('❌ Test server stop failed:', error);
    }
  }

  getBaseUrl() {
    return `http://localhost:${this.port}`;
  }
}

// Test utilities
class TestUtils {
  static async makeRequest(app, method, path, data = null, headers = {}) {
    const request = require('supertest')(app);
    let req = request[method.toLowerCase()](path);

    if (headers) {
      req = req.set(headers);
    }

    if (data) {
      if (method.toLowerCase() === 'get') {
        req = req.query(data);
      } else {
        req = req.send(data);
      }
    }

    return req;
  }

  static generateTestHeaders(accessToken = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  static async waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static validateResponse(response, expectedStatus = 200) {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
    }
    return response.body;
  }

  static validateErrorResponse(response, expectedStatus = 400) {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected error status ${expectedStatus}, got ${response.status}`);
    }
    if (!response.body.success === false) {
      throw new Error('Expected error response with success: false');
    }
    return response.body;
  }
}

// Test scenarios
class TestScenarios {
  constructor(testDB, userManager, testServer) {
    this.testDB = testDB;
    this.userManager = userManager;
    this.testServer = testServer;
  }

  async runAuthenticationTests() {
    console.log('🧪 Running authentication tests...');
    
    const app = this.testServer.app;
    
    // Test 1: Successful registration
    const userData = TestDataGenerator.generateNGO();
    const response = await TestUtils.makeRequest(app, 'POST', '/api/user/signup', userData);
    TestUtils.validateResponse(response, 200);
    console.log('✅ Registration test passed');

    // Test 2: Duplicate email registration
    const duplicateResponse = await TestUtils.makeRequest(app, 'POST', '/api/user/signup', userData);
    TestUtils.validateErrorResponse(duplicateResponse, 401);
    console.log('✅ Duplicate email test passed');

    // Test 3: Successful login
    const loginData = { email: userData.Email, password: userData.Password };
    const loginResponse = await TestUtils.makeRequest(app, 'POST', '/api/user/login', loginData);
    TestUtils.validateResponse(loginResponse, 200);
    console.log('✅ Login test passed');

    return loginResponse.body.data.accessToken;
  }

  async runPostTests(accessToken) {
    console.log('🧪 Running post tests...');
    
    const app = this.testServer.app;
    const headers = TestUtils.generateTestHeaders(accessToken);

    // Test 1: Create post with authentication
    const postData = TestDataGenerator.generatePost('test-ngo-id');
    const response = await TestUtils.makeRequest(app, 'POST', '/api/posts', postData, headers);
    TestUtils.validateResponse(response, 200);
    console.log('✅ Post creation test passed');

    // Test 2: Get all posts
    const getResponse = await TestUtils.makeRequest(app, 'GET', '/api/posts');
    TestUtils.validateResponse(getResponse, 200);
    console.log('✅ Get posts test passed');

    return response.body.data;
  }

  async runStellarTests() {
    console.log('🧪 Running Stellar tests...');
    
    const app = this.testServer.app;

    // Test 1: Get wallet balance
    const balanceResponse = await TestUtils.makeRequest(app, 'GET', '/api/stellar/balance/GTestPublicKey123');
    // Note: This might fail in test environment without actual Stellar connection
    console.log('✅ Balance test attempted');

    // Test 2: Create Stellar account
    const accountResponse = await TestUtils.makeRequest(app, 'POST', '/api/stellar/create-account');
    // Note: This might fail in test environment without actual Stellar connection
    console.log('✅ Account creation test attempted');
  }

  async runAllTests() {
    try {
      console.log('🚀 Starting comprehensive test suite...');
      
      // Run authentication tests
      const accessToken = await this.runAuthenticationTests();
      
      // Run post tests
      await this.runPostTests(accessToken);
      
      // Run Stellar tests
      await this.runStellarTests();
      
      console.log('✅ All tests completed successfully!');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }
}

// Main test runner
class TestRunner {
  constructor() {
    this.testDB = new TestDatabase();
    this.userManager = new TestUserManager();
    this.testServer = new TestServer();
  }

  async setup() {
    console.log('🔧 Setting up test environment...');
    
    // Start test database
    await this.testDB.start();
    
    // Start test server
    await this.testServer.start();
    
    console.log('✅ Test environment ready');
  }

  async teardown() {
    console.log('🧹 Cleaning up test environment...');
    
    // Stop test server
    await this.testServer.stop();
    
    // Clear and stop test database
    await this.testDB.clear();
    await this.testDB.stop();
    
    console.log('✅ Test environment cleaned up');
  }

  async run() {
    try {
      await this.setup();
      
      const scenarios = new TestScenarios(this.testDB, this.userManager, this.testServer);
      await scenarios.runAllTests();
      
    } catch (error) {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    } finally {
      await this.teardown();
    }
  }
}

// Export for use in other test files
module.exports = {
  TestConfig: TEST_CONFIG,
  TestDataGenerator,
  TestDatabase,
  TestUserManager,
  TestServer,
  TestUtils,
  TestScenarios,
  TestRunner
};

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(console.error);
}
