#!/usr/bin/env python3
"""
Backend API testing for SaveStack application
Tests all endpoints for content management, collections, auth, and user stats
"""

import requests
import sys
import json
from datetime import datetime

class SaveStackAPITester:
    def __init__(self, base_url="https://social-hub-687.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"    {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        
        if headers:
            req_headers.update(headers)
            
        if self.session_token:
            req_headers['Authorization'] = f'Bearer {self.session_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers)

            success = response.status_code == expected_status
            
            if success:
                try:
                    resp_data = response.json() if response.content else {}
                    self.log_result(name, True, f"Status: {response.status_code}")
                    return True, resp_data
                except:
                    self.log_result(name, True, f"Status: {response.status_code} (No JSON)")
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                self.log_result(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_result(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        # Test root endpoint with AI version check
        success, data = self.run_test("API Root", "GET", "", 200)
        if success:
            ai_enabled = data.get("ai_enabled", False)
            version = data.get("version", "")
            if ai_enabled and "2.0" in version:
                self.log_result("AI Features Enabled in Root", True, f"ai_enabled: {ai_enabled}, version: {version}")
            else:
                self.log_result("AI Features Enabled in Root", False, f"ai_enabled: {ai_enabled}, version: {version}")
        
        # Test health check with AI status
        success, data = self.run_test("Health Check", "GET", "health", 200)
        if success:
            ai_enabled = data.get("ai_enabled", False)
            if ai_enabled:
                self.log_result("AI Enabled in Health Check", True, f"ai_enabled: {ai_enabled}")
            else:
                self.log_result("AI Enabled in Health Check", False, f"ai_enabled: {ai_enabled}")

    def test_auth_endpoints_basic(self):
        """Test auth endpoints that don't require actual OAuth"""
        print("\n🔍 Testing Auth Endpoints...")
        
        # Test /auth/me without credentials (should fail)
        success, _ = self.run_test("Auth Me (Unauthorized)", "GET", "auth/me", 401)
        
        # Test logout without session
        self.run_test("Logout (No Session)", "POST", "auth/logout", 200)

    def test_collections_unauthorized(self):
        """Test collections endpoints without auth (should fail)"""
        print("\n🔍 Testing Collections (Unauthorized)...")
        
        self.run_test("Get Collections (Unauthorized)", "GET", "collections", 401)
        self.run_test("Create Collection (Unauthorized)", "POST", "collections", 401, 
                     {"name": "Test Collection"})

    def test_content_unauthorized(self):
        """Test content endpoints without auth (should fail)"""
        print("\n🔍 Testing Content (Unauthorized)...")
        
        self.run_test("Get Content (Unauthorized)", "GET", "content", 401)
        self.run_test("Create Content (Unauthorized)", "POST", "content", 401,
                     {"platform": "instagram", "content_type": "post", "title": "Test", "url": "https://example.com"})

    def test_user_stats_unauthorized(self):
        """Test user stats without auth (should fail)"""
        print("\n🔍 Testing User Stats (Unauthorized)...")
        
        self.run_test("Get User Stats (Unauthorized)", "GET", "user/stats", 401)

    def test_ai_endpoints_unauthorized(self):
        """Test AI-specific endpoints without auth (should fail with 401)"""
        print("\n🔍 Testing AI Endpoints (Unauthorized)...")
        
        # Test semantic search endpoint
        self.run_test("Semantic Search (Unauthorized)", "POST", "search", 401,
                     {"query": "test search", "limit": 10})
        
        # Test categories endpoint
        self.run_test("Categories (Unauthorized)", "GET", "categories", 401)
        
        # Test user export endpoint
        self.run_test("User Export (Unauthorized)", "GET", "user/export", 401)
        
        # Test content reprocess endpoint
        self.run_test("Content Reprocess (Unauthorized)", "POST", "content/test123/reprocess", 401)

    def test_cors_headers(self):
        """Test CORS configuration"""
        print("\n🔍 Testing CORS...")
        
        try:
            # Test OPTIONS request
            response = requests.options(f"{self.api_url}/health")
            
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods', 
                'Access-Control-Allow-Headers'
            ]
            
            cors_present = any(header in response.headers for header in cors_headers)
            
            if cors_present or response.status_code in [200, 204]:
                self.log_result("CORS Configuration", True, "CORS headers present or allowed")
            else:
                self.log_result("CORS Configuration", False, "No CORS headers found")
                
        except Exception as e:
            self.log_result("CORS Configuration", False, f"Error: {str(e)}")

    def test_api_endpoint_structure(self):
        """Test that all expected endpoints return proper error codes"""
        print("\n🔍 Testing API Endpoint Structure...")
        
        # Test endpoints that should exist but require auth
        endpoints_requiring_auth = [
            ("collections", "GET"),
            ("content", "GET"), 
            ("user/stats", "GET"),
            ("auth/me", "GET"),
            ("search", "POST"),
            ("categories", "GET"),
            ("user/export", "GET")
        ]
        
        for endpoint, method in endpoints_requiring_auth:
            # These should return 401 (not 404), proving they exist
            success, _ = self.run_test(f"Endpoint Exists: {method} /{endpoint}", 
                                     method, endpoint, 401)

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*50}")
        print(f"📊 TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        if self.tests_passed < self.tests_run:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Run all backend tests"""
    print("🚀 Starting SaveStack Backend API Tests...")
    print("="*50)
    
    tester = SaveStackAPITester()
    
    # Run test suites
    tester.test_health_endpoints()
    tester.test_auth_endpoints_basic()
    tester.test_collections_unauthorized() 
    tester.test_content_unauthorized()
    tester.test_user_stats_unauthorized()
    tester.test_ai_endpoints_unauthorized()
    tester.test_cors_headers()
    tester.test_api_endpoint_structure()
    
    # Print results
    success = tester.print_summary()
    
    # Save detailed results
    try:
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump(tester.test_results, f, indent=2)
        print(f"\n💾 Detailed results saved to /app/backend_test_results.json")
    except Exception as e:
        print(f"\n⚠️ Could not save results: {e}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())