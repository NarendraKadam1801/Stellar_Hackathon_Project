#!/usr/bin/env node

/**
 * AidBridge Test Runner
 * Comprehensive test execution script for the AidBridge server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  // Test suites to run
  suites: [
    'auth',
    'posts', 
    'stellar',
    'payment',
    'ipfs',
    'expenses'
  ],
  
  // Test modes
  modes: {
    unit: 'Unit tests only',
    integration: 'Integration tests only',
    e2e: 'End-to-end tests only',
    all: 'All tests'
  },
  
  // Output formats
  formats: {
    console: 'Console output',
    json: 'JSON report',
    html: 'HTML report',
    junit: 'JUnit XML report'
  }
};

// Test statistics
let testStats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  duration: 0
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class TestRunner {
  constructor(options = {}) {
    this.options = {
      mode: options.mode || 'all',
      format: options.format || 'console',
      verbose: options.verbose || false,
      watch: options.watch || false,
      coverage: options.coverage || false,
      timeout: options.timeout || 30000,
      ...options
    };
    
    this.startTime = Date.now();
    this.results = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logHeader(message) {
    this.log(`\n${'='.repeat(60)}`, 'cyan');
    this.log(`  ${message}`, 'bright');
    this.log(`${'='.repeat(60)}`, 'cyan');
  }

  logSection(message) {
    this.log(`\n${'-'.repeat(40)}`, 'blue');
    this.log(`  ${message}`, 'blue');
    this.log(`${'-'.repeat(40)}`, 'blue');
  }

  async checkPrerequisites() {
    this.logSection('Checking Prerequisites');
    
    // Check if Node.js is installed
    try {
      const nodeVersion = process.version;
      this.log(`✅ Node.js: ${nodeVersion}`, 'green');
    } catch (error) {
      this.log('❌ Node.js not found', 'red');
      return false;
    }

    // Check if test dependencies are installed
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      this.log('❌ package.json not found', 'red');
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = ['jest', 'supertest', 'mongodb-memory-server'];
    
    for (const dep of requiredDeps) {
      if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        this.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`, 'green');
      } else {
        this.log(`❌ ${dep} not found in devDependencies`, 'red');
        return false;
      }
    }

    // Check if server is built
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      this.log('⚠️  Server not built. Building now...', 'yellow');
      await this.buildServer();
    } else {
      this.log('✅ Server built', 'green');
    }

    return true;
  }

  async buildServer() {
    return new Promise((resolve, reject) => {
      this.log('Building server...', 'yellow');
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: __dirname,
        stdio: 'pipe'
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          this.log('✅ Server built successfully', 'green');
          resolve();
        } else {
          this.log('❌ Server build failed', 'red');
          reject(new Error('Build failed'));
        }
      });

      buildProcess.on('error', (error) => {
        this.log(`❌ Build error: ${error.message}`, 'red');
        reject(error);
      });
    });
  }

  async runTestSuite(suite) {
    this.logSection(`Running ${suite} tests`);
    
    const testFile = path.join(__dirname, 'test', `${suite}.test.js`);
    if (!fs.existsSync(testFile)) {
      this.log(`⚠️  Test file not found: ${testFile}`, 'yellow');
      return { passed: 0, failed: 0, skipped: 0 };
    }

    return new Promise((resolve) => {
      const startTime = Date.now();
      const jestArgs = [
        '--testPathPattern',
        testFile,
        '--verbose',
        '--no-cache'
      ];

      if (this.options.coverage) {
        jestArgs.push('--coverage');
      }

      if (this.options.watch) {
        jestArgs.push('--watch');
      }

      const testProcess = spawn('npx', ['jest', ...jestArgs], {
        cwd: __dirname,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      testProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        if (this.options.verbose) {
          process.stdout.write(text);
        }
      });

      testProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        if (this.options.verbose) {
          process.stderr.write(text);
        }
      });

      testProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        const result = this.parseJestOutput(output, errorOutput, code);
        result.duration = duration;
        
        this.log(`✅ ${suite} tests completed in ${duration}ms`, 'green');
        if (result.failed > 0) {
          this.log(`❌ ${result.failed} tests failed`, 'red');
        }
        
        resolve(result);
      });

      testProcess.on('error', (error) => {
        this.log(`❌ Test process error: ${error.message}`, 'red');
        resolve({ passed: 0, failed: 1, skipped: 0, duration: 0 });
      });
    });
  }

  parseJestOutput(output, errorOutput, exitCode) {
    const lines = output.split('\n');
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    // Parse Jest output for test results
    for (const line of lines) {
      if (line.includes('✓') || line.includes('PASS')) {
        passed++;
      } else if (line.includes('✗') || line.includes('FAIL')) {
        failed++;
      } else if (line.includes('○') || line.includes('SKIP')) {
        skipped++;
      }
    }

    // If parsing failed, use exit code
    if (passed === 0 && failed === 0 && skipped === 0) {
      if (exitCode === 0) {
        passed = 1; // Assume at least one test passed
      } else {
        failed = 1; // Assume at least one test failed
      }
    }

    return { passed, failed, skipped };
  }

  async runAllTests() {
    this.logHeader('AidBridge Test Suite');
    this.log(`Mode: ${this.options.mode}`, 'blue');
    this.log(`Format: ${this.options.format}`, 'blue');
    this.log(`Coverage: ${this.options.coverage ? 'Yes' : 'No'}`, 'blue');
    this.log(`Watch: ${this.options.watch ? 'Yes' : 'No'}`, 'blue');

    // Check prerequisites
    const prerequisitesOk = await this.checkPrerequisites();
    if (!prerequisitesOk) {
      this.log('❌ Prerequisites check failed', 'red');
      process.exit(1);
    }

    // Determine which test suites to run
    let suitesToRun = TEST_CONFIG.suites;
    if (this.options.mode !== 'all') {
      suitesToRun = [this.options.mode];
    }

    // Run test suites
    for (const suite of suitesToRun) {
      try {
        const result = await this.runTestSuite(suite);
        this.results.push({ suite, ...result });
        
        testStats.total += result.passed + result.failed + result.skipped;
        testStats.passed += result.passed;
        testStats.failed += result.failed;
        testStats.skipped += result.skipped;
        
      } catch (error) {
        this.log(`❌ Error running ${suite} tests: ${error.message}`, 'red');
        this.results.push({ 
          suite, 
          passed: 0, 
          failed: 1, 
          skipped: 0, 
          duration: 0,
          error: error.message 
        });
        testStats.failed++;
      }
    }

    // Calculate total duration
    testStats.duration = Date.now() - this.startTime;

    // Generate report
    this.generateReport();
  }

  generateReport() {
    this.logHeader('Test Results Summary');
    
    // Overall statistics
    this.log(`Total Tests: ${testStats.total}`, 'bright');
    this.log(`Passed: ${testStats.passed}`, 'green');
    this.log(`Failed: ${testStats.failed}`, 'red');
    this.log(`Skipped: ${testStats.skipped}`, 'yellow');
    this.log(`Duration: ${testStats.duration}ms`, 'blue');
    
    // Success rate
    const successRate = testStats.total > 0 ? (testStats.passed / testStats.total * 100).toFixed(2) : 0;
    this.log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');

    // Detailed results by suite
    this.logSection('Results by Test Suite');
    for (const result of this.results) {
      const status = result.failed > 0 ? '❌' : '✅';
      this.log(`${status} ${result.suite}: ${result.passed} passed, ${result.failed} failed, ${result.skipped} skipped (${result.duration}ms)`);
    }

    // Generate reports based on format
    switch (this.options.format) {
      case 'json':
        this.generateJsonReport();
        break;
      case 'html':
        this.generateHtmlReport();
        break;
      case 'junit':
        this.generateJunitReport();
        break;
      default:
        this.generateConsoleReport();
    }

    // Exit with appropriate code
    const exitCode = testStats.failed > 0 ? 1 : 0;
    if (exitCode === 0) {
      this.log('\n🎉 All tests passed!', 'green');
    } else {
      this.log(`\n💥 ${testStats.failed} tests failed!`, 'red');
    }
    
    process.exit(exitCode);
  }

  generateConsoleReport() {
    // Console report is already generated above
  }

  generateJsonReport() {
    const report = {
      summary: testStats,
      results: this.results,
      timestamp: new Date().toISOString(),
      duration: testStats.duration
    };

    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`\n📄 JSON report saved to: ${reportPath}`, 'blue');
  }

  generateHtmlReport() {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>AidBridge Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .stat { text-align: center; padding: 10px; border-radius: 5px; }
        .passed { background: #d4edda; color: #155724; }
        .failed { background: #f8d7da; color: #721c24; }
        .skipped { background: #fff3cd; color: #856404; }
        .results { margin-top: 20px; }
        .suite { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .success { border-left: 5px solid #28a745; }
        .failure { border-left: 5px solid #dc3545; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AidBridge Test Results</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="stat passed">
            <h3>${testStats.passed}</h3>
            <p>Passed</p>
        </div>
        <div class="stat failed">
            <h3>${testStats.failed}</h3>
            <p>Failed</p>
        </div>
        <div class="stat skipped">
            <h3>${testStats.skipped}</h3>
            <p>Skipped</p>
        </div>
    </div>
    
    <div class="results">
        <h2>Test Suites</h2>
        ${this.results.map(result => `
            <div class="suite ${result.failed > 0 ? 'failure' : 'success'}">
                <h3>${result.suite}</h3>
                <p>Passed: ${result.passed} | Failed: ${result.failed} | Skipped: ${result.skipped}</p>
                <p>Duration: ${result.duration}ms</p>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const reportPath = path.join(__dirname, 'test-results.html');
    fs.writeFileSync(reportPath, html);
    this.log(`\n📄 HTML report saved to: ${reportPath}`, 'blue');
  }

  generateJunitReport() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
    <testsuite name="AidBridge" tests="${testStats.total}" failures="${testStats.failed}" skipped="${testStats.skipped}" time="${testStats.duration / 1000}">
        ${this.results.map(result => `
            <testsuite name="${result.suite}" tests="${result.passed + result.failed + result.skipped}" failures="${result.failed}" skipped="${result.skipped}" time="${result.duration / 1000}">
                ${result.failed > 0 ? `<testcase name="test" classname="${result.suite}">
                    <failure message="Test suite failed">${result.error || 'Unknown error'}</failure>
                </testcase>` : ''}
            </testsuite>
        `).join('')}
    </testsuite>
</testsuites>`;

    const reportPath = path.join(__dirname, 'test-results.xml');
    fs.writeFileSync(reportPath, xml);
    this.log(`\n📄 JUnit XML report saved to: ${reportPath}`, 'blue');
  }
}

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--mode':
        options.mode = args[++i];
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--watch':
        options.watch = true;
        break;
      case '--coverage':
        options.coverage = true;
        break;
      case '--timeout':
        options.timeout = parseInt(args[++i]);
        break;
      case '--help':
        console.log(`
AidBridge Test Runner

Usage: node run-tests.js [options]

Options:
  --mode <mode>      Test mode: unit, integration, e2e, all (default: all)
  --format <format>  Output format: console, json, html, junit (default: console)
  --verbose          Verbose output
  --watch            Watch mode
  --coverage         Generate coverage report
  --timeout <ms>     Test timeout in milliseconds (default: 30000)
  --help             Show this help message

Examples:
  node run-tests.js --mode auth --verbose
  node run-tests.js --format html --coverage
  node run-tests.js --watch --mode posts
        `);
        process.exit(0);
        break;
    }
  }

  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const runner = new TestRunner(options);
  
  runner.runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
