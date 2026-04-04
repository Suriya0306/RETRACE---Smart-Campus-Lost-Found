#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests the frontend-backend API connection
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTests() {
  log('\n🧪 Call Analytics - Integration Test Suite\n', 'cyan');

  const tests = [
    testFileStructure,
    testEnvironmentCheck,
    testBackendCORS,
    testAPIService,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (error) {
      log(`  ❌ ${error.message}`, 'red');
      failed++;
    }
  }

  log('\n' + '='.repeat(50), 'cyan');
  log(`Tests Passed: ${passed}/${tests.length}`, passed === tests.length ? 'green' : 'yellow');

  if (failed > 0) {
    process.exit(1);
  }
}

function testFileStructure() {
  return new Promise((resolve, reject) => {
    const files = [
      'frontend/dist/index.html',
      'frontend/src/services/analyticsApi.ts',
      'frontend/src/sections/UploadCall.tsx',
      'backend/app.py',
      'INTEGRATION_GUIDE.md',
    ];

    log('\n1️⃣  File Structure Check', 'cyan');

    let allExist = true;
    for (const file of files) {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) {
        log(`  ✓ ${file}`, 'green');
      } else {
        log(`  ✗ ${file} - NOT FOUND`, 'red');
        allExist = false;
      }
    }

    allExist ? resolve() : reject(new Error('Some required files are missing'));
  });
}

function testEnvironmentCheck() {
  return new Promise((resolve, reject) => {
    log('\n2️⃣  Environment Check', 'cyan');

    const checks = [
      { name: 'Node.js', cmd: 'node --version' },
      { name: 'npm', cmd: 'npm --version' },
    ];

    const { execSync } = require('child_process');

    let allOk = true;
    for (const check of checks) {
      try {
        const version = execSync(check.cmd, { stdio: 'pipe' }).toString().trim();
        log(`  ✓ ${check.name}: ${version}`, 'green');
      } catch (e) {
        log(`  ✗ ${check.name} not found`, 'red');
        allOk = false;
      }
    }

    allOk ? resolve() : reject(new Error('Some required tools are missing'));
  });
}

function testBackendCORS() {
  return new Promise((resolve, reject) => {
    log('\n3️⃣  Backend CORS Configuration', 'cyan');

    const appPyPath = path.join(__dirname, 'backend', 'app.py');
    const content = fs.readFileSync(appPyPath, 'utf-8');

    const hasOpenCORS = content.includes('allow_origins=["*"]');
    const hasCORSMiddleware = content.includes('CORSMiddleware');
    const hasHeaders = content.includes('allow_headers');

    if (hasOpenCORS) {
      log('  ✓ CORS allows all origins (*)', 'green');
    } else {
      log('  ✗ CORS not properly configured', 'red');
      reject(new Error('CORS configuration issue'));
      return;
    }

    if (hasCORSMiddleware) {
      log('  ✓ CORS middleware configured', 'green');
    }

    if (hasHeaders) {
      log('  ✓ CORS headers configured', 'green');
    }

    resolve();
  });
}

function testAPIService() {
  return new Promise((resolve, reject) => {
    log('\n4️⃣  API Service Implementation', 'cyan');

    const apiServicePath = path.join(__dirname, 'frontend', 'src', 'services', 'analyticsApi.ts');
    
    if (!fs.existsSync(apiServicePath)) {
      reject(new Error('API service file not found'));
      return;
    }

    const content = fs.readFileSync(apiServicePath, 'utf-8');

    const checks = [
      { name: 'fileToBase64 function', pattern: /export async function fileToBase64/ },
      { name: 'analyzeCall function', pattern: /export async function analyzeCall/ },
      { name: 'processAudioFile function', pattern: /export async function processAudioFile/ },
      { name: 'processAudioUrl function', pattern: /export async function processAudioUrl/ },
      { name: '/api/call-analytics endpoint', pattern: /\/api\/call-analytics/ },
      { name: 'x-api-key header', pattern: /'x-api-key'/ },
    ];

    let allOk = true;
    for (const check of checks) {
      if (check.pattern.test(content)) {
        log(`  ✓ ${check.name}`, 'green');
      } else {
        log(`  ✗ ${check.name} not found`, 'red');
        allOk = false;
      }
    }

    allOk ? resolve() : reject(new Error('API service not properly implemented'));
  });
}

runTests().catch((error) => {
  log(`\n❌ Tests failed: ${error.message}`, 'red');
  process.exit(1);
});
