"""
Backend API Tests for Aleesa Ethnic Wear E-commerce
Tests: Health, Categories, Products, Auth, Cart
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Session for maintaining cookies
session = requests.Session()
session.headers.update({"Content-Type": "application/json"})

# Test data storage
test_data = {
    "product_id": None,
    "variant_id": None,
    "size": None,
    "access_token": None,
    "cart_item_id": None,
    "test_user_email": f"test_{uuid.uuid4().hex[:8]}@example.com"
}


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint(self):
        """Test /api/health returns healthy status"""
        response = session.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "aleesa-api"
        print("✓ Health check passed")

    def test_api_root(self):
        """Test /api root endpoint"""
        response = session.get(f"{BASE_URL}/api")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        print("✓ API root endpoint passed")


class TestCategories:
    """Category endpoint tests"""
    
    def test_get_categories(self):
        """Test GET /api/categories returns list of categories"""
        response = session.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify category structure
        category = data[0]
        assert "id" in category
        assert "name" in category
        assert "slug" in category
        print(f"✓ Got {len(data)} categories")
    
    def test_get_category_by_slug(self):
        """Test GET /api/categories/{slug}"""
        response = session.get(f"{BASE_URL}/api/categories/suits")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "suits"
        assert "name" in data
        print("✓ Category by slug passed")
    
    def test_get_invalid_category(self):
        """Test GET /api/categories/{invalid_slug} returns 404"""
        response = session.get(f"{BASE_URL}/api/categories/invalid-category-xyz")
        assert response.status_code == 404
        print("✓ Invalid category returns 404")


class TestProducts:
    """Product endpoint tests"""
    
    def test_get_products(self):
        """Test GET /api/products returns paginated products"""
        response = session.get(f"{BASE_URL}/api/products?page_size=5")
        assert response.status_code == 200
        data = response.json()
        
        assert "products" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        assert "total_pages" in data
        
        assert len(data["products"]) <= 5
        assert data["total"] > 0
        
        # Store first product for cart tests
        if data["products"]:
            product = data["products"][0]
            test_data["product_id"] = product["id"]
            test_data["product_slug"] = product["slug"]
        
        print(f"✓ Got {len(data['products'])} products, total: {data['total']}")
    
    def test_get_products_with_category_filter(self):
        """Test GET /api/products with category filter"""
        response = session.get(f"{BASE_URL}/api/products?category=suits&page_size=5")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        print(f"✓ Category filter: {len(data['products'])} suits found")
    
    def test_get_products_with_price_filter(self):
        """Test GET /api/products with price filter"""
        response = session.get(f"{BASE_URL}/api/products?min_price=1000&max_price=10000")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        print(f"✓ Price filter: {len(data['products'])} products in range")
    
    def test_get_products_with_sorting(self):
        """Test GET /api/products with different sort options"""
        for sort in ["featured", "price-low", "price-high", "newest"]:
            response = session.get(f"{BASE_URL}/api/products?sort={sort}&page_size=3")
            assert response.status_code == 200
            data = response.json()
            assert "products" in data
        print("✓ All sort options work")
    
    def test_get_product_by_slug(self):
        """Test GET /api/products/{slug}"""
        # First get a product slug
        response = session.get(f"{BASE_URL}/api/products?page_size=1")
        assert response.status_code == 200
        products = response.json()["products"]
        
        if products:
            slug = products[0]["slug"]
            response = session.get(f"{BASE_URL}/api/products/{slug}")
            assert response.status_code == 200
            data = response.json()
            
            assert data["slug"] == slug
            assert "id" in data
            assert "name" in data
            assert "price" in data
            assert "variants" in data
            
            # Store variant info for cart tests
            if data.get("variants"):
                variant = data["variants"][0]
                test_data["variant_id"] = variant["id"]
                if variant.get("sizes"):
                    test_data["size"] = variant["sizes"][0]["size"]
            
            print(f"✓ Product detail: {data['name']}")
    
    def test_get_invalid_product(self):
        """Test GET /api/products/{invalid_slug} returns 404"""
        response = session.get(f"{BASE_URL}/api/products/invalid-product-xyz-123")
        assert response.status_code == 404
        print("✓ Invalid product returns 404")
    
    def test_search_products(self):
        """Test GET /api/search"""
        response = session.get(f"{BASE_URL}/api/search?q=suit")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        print(f"✓ Search returned {len(data['results'])} results")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_with_demo_credentials(self):
        """Test POST /api/auth/login with demo credentials"""
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@example.com",
            "password": "test123"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "test@example.com"
        
        test_data["access_token"] = data["access_token"]
        print(f"✓ Login successful: {data['user']['email']}")
    
    def test_login_invalid_credentials(self):
        """Test POST /api/auth/login with invalid credentials"""
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid login returns 401")
    
    def test_get_me_authenticated(self):
        """Test GET /api/auth/me with valid token"""
        if not test_data["access_token"]:
            pytest.skip("No access token available")
        
        headers = {"Authorization": f"Bearer {test_data['access_token']}"}
        response = session.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "email" in data
        assert data["email"] == "test@example.com"
        print("✓ Get me endpoint works")
    
    def test_get_me_unauthenticated(self):
        """Test GET /api/auth/me without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ Unauthenticated /me returns 401")
    
    def test_register_new_user(self):
        """Test POST /api/auth/register"""
        response = session.post(f"{BASE_URL}/api/auth/register", json={
            "email": test_data["test_user_email"],
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User",
            "phone": "9876543210"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == test_data["test_user_email"]
        print(f"✓ Registration successful: {data['user']['email']}")
    
    def test_register_duplicate_email(self):
        """Test POST /api/auth/register with existing email"""
        response = session.post(f"{BASE_URL}/api/auth/register", json={
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        })
        assert response.status_code == 400
        print("✓ Duplicate email registration returns 400")


class TestCart:
    """Cart endpoint tests"""
    
    def test_get_cart_guest(self):
        """Test GET /api/cart for guest user"""
        # Use a new session to simulate guest
        guest_session = requests.Session()
        guest_session.headers.update({
            "Content-Type": "application/json",
            "X-Session-ID": f"test_session_{uuid.uuid4().hex[:8]}"
        })
        
        response = guest_session.get(f"{BASE_URL}/api/cart")
        assert response.status_code == 200
        data = response.json()
        
        assert "cart" in data
        assert "subtotal" in data
        assert "item_count" in data
        print("✓ Guest cart retrieved")
    
    def test_add_to_cart(self):
        """Test POST /api/cart/items"""
        if not test_data["product_id"] or not test_data["variant_id"] or not test_data["size"]:
            pytest.skip("Product data not available")
        
        cart_session = requests.Session()
        cart_session.headers.update({
            "Content-Type": "application/json",
            "X-Session-ID": f"cart_test_{uuid.uuid4().hex[:8]}"
        })
        
        response = cart_session.post(f"{BASE_URL}/api/cart/items", json={
            "product_id": test_data["product_id"],
            "variant_id": test_data["variant_id"],
            "size": test_data["size"],
            "quantity": 1
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "cart" in data
        assert "subtotal" in data
        assert data["item_count"] >= 1
        
        # Store cart item id for later tests
        if data["cart"]["items"]:
            test_data["cart_item_id"] = data["cart"]["items"][0]["id"]
            test_data["cart_session"] = cart_session
        
        print(f"✓ Added to cart, item count: {data['item_count']}")
    
    def test_add_to_cart_invalid_product(self):
        """Test POST /api/cart/items with invalid product"""
        cart_session = requests.Session()
        cart_session.headers.update({
            "Content-Type": "application/json",
            "X-Session-ID": f"cart_test_{uuid.uuid4().hex[:8]}"
        })
        
        response = cart_session.post(f"{BASE_URL}/api/cart/items", json={
            "product_id": "invalid-product-id",
            "variant_id": "invalid-variant-id",
            "size": "M",
            "quantity": 1
        })
        assert response.status_code == 404
        print("✓ Invalid product returns 404")
    
    def test_update_cart_item_quantity(self):
        """Test PATCH /api/cart/items/{item_id}"""
        if not test_data.get("cart_item_id") or not test_data.get("cart_session"):
            pytest.skip("Cart item not available")
        
        cart_session = test_data["cart_session"]
        response = cart_session.patch(
            f"{BASE_URL}/api/cart/items/{test_data['cart_item_id']}",
            json={"quantity": 2}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify quantity updated
        item = next((i for i in data["cart"]["items"] if i["id"] == test_data["cart_item_id"]), None)
        if item:
            assert item["quantity"] == 2
        print("✓ Cart item quantity updated")
    
    def test_remove_cart_item(self):
        """Test DELETE /api/cart/items/{item_id}"""
        if not test_data.get("cart_item_id") or not test_data.get("cart_session"):
            pytest.skip("Cart item not available")
        
        cart_session = test_data["cart_session"]
        response = cart_session.delete(f"{BASE_URL}/api/cart/items/{test_data['cart_item_id']}")
        assert response.status_code == 200
        data = response.json()
        
        # Verify item removed
        item = next((i for i in data["cart"]["items"] if i["id"] == test_data["cart_item_id"]), None)
        assert item is None
        print("✓ Cart item removed")


class TestCartAuthenticated:
    """Cart tests with authenticated user"""
    
    def test_get_cart_authenticated(self):
        """Test GET /api/cart with authenticated user"""
        if not test_data["access_token"]:
            pytest.skip("No access token available")
        
        headers = {
            "Authorization": f"Bearer {test_data['access_token']}",
            "X-Session-ID": f"auth_cart_{uuid.uuid4().hex[:8]}"
        }
        response = session.get(f"{BASE_URL}/api/cart", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "cart" in data
        assert "subtotal" in data
        print("✓ Authenticated cart retrieved")
    
    def test_add_to_cart_authenticated(self):
        """Test POST /api/cart/items with authenticated user"""
        if not test_data["access_token"] or not test_data["product_id"]:
            pytest.skip("Required data not available")
        
        headers = {
            "Authorization": f"Bearer {test_data['access_token']}",
            "X-Session-ID": f"auth_cart_{uuid.uuid4().hex[:8]}"
        }
        response = session.post(f"{BASE_URL}/api/cart/items", headers=headers, json={
            "product_id": test_data["product_id"],
            "variant_id": test_data["variant_id"],
            "size": test_data["size"],
            "quantity": 1
        })
        assert response.status_code == 200
        data = response.json()
        
        assert data["item_count"] >= 1
        print(f"✓ Authenticated add to cart, items: {data['item_count']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
