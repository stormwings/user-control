/**
 * E2E Tests for Complete User Journey
 * 
 * Tests cover complete flows from login to order completion:
 * - Full happy path: Login -> Browse -> Add to Cart -> Checkout -> Order
 * - Mixed scenarios with various user behaviors
 * - Error recovery scenarios
 * - Multiple product purchases
 * - Session management
 */

describe("Complete User Journey", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.clearCart();
  });

  describe("Happy Path - Complete Purchase Flow", () => {
    it("should complete full purchase journey from login to order confirmation", () => {
      // Step 1: Visit site and redirect to login
      cy.visit("/");
      cy.url().should("include", "/login");

      // Step 2: Login
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        fixture: "auth-success.json"
      }).as("loginRequest");

      cy.get('[data-cy="login-input-email"]').type("customer@example.com");
      cy.get('[data-cy="login-input-password"]').type("password123");
      cy.get('[data-cy="login-submit-button"]').click();
      
      cy.wait("@loginRequest");
      cy.url().should("not.include", "/login");

      // Step 3: Browse products
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.wait("@getProducts");
      cy.get('[data-cy="product-grid"]').should("be.visible");

      // Step 4: View product details
      cy.get('[data-cy="product-card"]').first().find("img").click();
      cy.url().should("include", "/product/1");
      cy.get('[data-cy="product-details-title"]').should("be.visible");

      // Step 5: Add product to cart
      cy.get('[data-cy="product-details-add-to-cart"]').click();
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");

      // Step 6: Continue shopping and add another product
      cy.visit("/");
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      cy.get('[data-cy="header-cart-count"]').should("contain", "2");

      // Step 7: Open cart and review
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar"]').should("be.visible");
      cy.get('[data-cy="cart-item"]').should("have.length", 2);

      // Step 8: Proceed to checkout
      cy.get('[data-cy="sidebar-next-button"]').click();
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "2");

      // Step 9: Fill checkout form
      cy.get('input[name="name"]').type("John Doe");
      cy.get('input[name="email"]').type("john.doe@example.com");
      cy.get('input[name="phone"]').type("5551234567");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      cy.get('textarea[name="notes"]').type("Please deliver in the morning");

      // Step 10: Submit order
      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder");

      // Step 11: Verify order confirmation
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "3");
      cy.contains(/success|completed/i).should("be.visible");
      cy.contains("ORD-20231109-001").should("be.visible");

      // Step 12: Verify cart is cleared
      cy.get('[data-cy="sidebar-close-button"]').click();
      cy.get('[data-cy="header-cart-count"]').should("not.exist");
    });
  });

  describe("Authenticated User Shopping Journey", () => {
    it("should allow authenticated user to shop and checkout", () => {
      // Start with authenticated user
      cy.loginByLocalStorage({
        email: "existing@example.com",
        name: "Existing User"
      });

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      // Add multiple products with different quantities
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]')
        .click()
        .click(); // Add same product twice
      
      cy.get('[data-cy="header-cart-count"]').should("contain", "2");

      cy.get('[data-cy="product-card"]').eq(2)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="header-cart-count"]').should("contain", "3");

      // Open cart and adjust quantities
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="cart-item"]').should("have.length", 2);

      // Increase quantity of first item
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="cart-item-increase"]').click();
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "3");
      });

      cy.get('[data-cy="header-cart-count"]').should("contain", "4");

      // Proceed to checkout
      cy.get('[data-cy="sidebar-next-button"]').click();

      // Fill minimal required info
      cy.get('input[name="name"]').type("Existing User");
      cy.get('input[name="email"]').type("existing@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Test Province");
      cy.get('input[name="zipcode"]').type("12345");

      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder");

      // Verify success
      cy.contains(/success/i).should("be.visible");
    });
  });

  describe("Search and Purchase Flow", () => {
    it("should search for product, view details, and purchase", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      // Search for specific product
      cy.intercept("GET", "**/api/product/public/vip?*name=watch*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "2",
              name: "Smart Watch",
              price: 199.99,
              description: "Feature-rich smartwatch",
              audience: "Electronics",
              image: "https://via.placeholder.com/300",
              stock: 8
            }
          ],
          nextCursor: null
        }
      }).as("searchWatch");

      cy.get('[data-cy="search-input"]').type("watch");
      
      // View product details
      cy.get('[data-cy="product-card"]').first().find("img").click();
      cy.url().should("include", "/product/2");

      // Add to cart
      cy.get('[data-cy="product-details-add-to-cart"]').click();

      // Quick checkout
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();

      // Fill form
      cy.get('input[name="name"]').type("Watch Buyer");
      cy.get('input[name="email"]').type("watch@example.com");
      cy.get('input[name="phone"]').type("9876543210");
      cy.get('input[name="province"]').type("Province");
      cy.get('input[name="zipcode"]').type("54321");

      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder");

      cy.contains(/success/i).should("be.visible");
    });
  });

  describe("Error Recovery Scenarios", () => {
    it("should recover from failed login and complete purchase", () => {
      cy.visit("/");

      // First attempt: failed login
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 401,
        body: { message: "Invalid credentials" }
      }).as("failedLogin");

      cy.get('[data-cy="login-input-email"]').type("wrong@example.com");
      cy.get('[data-cy="login-input-password"]').type("wrongpass");
      cy.get('[data-cy="login-submit-button"]').click();
      cy.wait("@failedLogin");

      cy.contains(/invalid/i).should("be.visible");

      // Second attempt: successful login
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        fixture: "auth-success.json"
      }).as("successLogin");

      cy.get('[data-cy="login-input-email"]').clear().type("correct@example.com");
      cy.get('[data-cy="login-input-password"]').clear().type("correctpass");
      cy.get('[data-cy="login-submit-button"]').click();
      cy.wait("@successLogin");

      // Continue with shopping
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.wait("@getProducts");
      
      cy.get('[data-cy="product-card"]').first()
        .find('[data-cy="product-add-to-cart"]').click();

      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();

      cy.get('input[name="name"]').type("Recovered User");
      cy.get('input[name="email"]').type("recovered@example.com");
      cy.get('input[name="phone"]').type("1231231234");
      cy.get('input[name="province"]').type("Province");
      cy.get('input[name="zipcode"]').type("11111");

      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder");

      cy.contains(/success/i).should("be.visible");
    });

    it("should retry failed order submission", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      cy.get('[data-cy="product-card"]').first()
        .find('[data-cy="product-add-to-cart"]').click();

      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();

      // Fill form
      cy.get('input[name="name"]').type("Retry User");
      cy.get('input[name="email"]').type("retry@example.com");
      cy.get('input[name="phone"]').type("5555555555");
      cy.get('input[name="province"]').type("Province");
      cy.get('input[name="zipcode"]').type("99999");

      // First attempt: fail
      cy.intercept("POST", "**/api/order/public", {
        statusCode: 500,
        body: { message: "Server error" }
      }).as("failedOrder");

      cy.get('button[type="submit"]').click();
      cy.wait("@failedOrder");

      // Should show error on step 3
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "3");
      cy.contains(/error|failed/i).should("be.visible");

      // Go back and retry
      cy.get('[data-cy="sidebar-close-button"]').click();
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Cart should still have items
      cy.get('[data-cy="cart-item"]').should("have.length", 1);
      
      cy.get('[data-cy="sidebar-next-button"]').click();

      // Second attempt: success
      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("successOrder");

      // Form should remember values
      cy.get('button[type="submit"]').click();
      cy.wait("@successOrder");

      cy.contains(/success/i).should("be.visible");
    });
  });

  describe("Cart Management During Shopping", () => {
    it("should manage cart while browsing multiple products", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      // Add first product
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();

      // View details of another product
      cy.get('[data-cy="product-card"]').eq(1).find("img").click();
      cy.get('[data-cy="product-details-add-to-cart"]').click();

      // Go back to home
      cy.visit("/");

      // Add third product
      cy.get('[data-cy="product-card"]').eq(2)
        .find('[data-cy="product-add-to-cart"]').click();

      // Cart should have 3 items
      cy.get('[data-cy="header-cart-count"]').should("contain", "3");

      // Open cart and remove one item
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="cart-item"]').should("have.length", 3);

      cy.get('[data-cy="cart-item"]').eq(1).within(() => {
        cy.get('[data-cy="cart-item-remove"]').click();
      });

      cy.get('[data-cy="cart-item"]').should("have.length", 2);
      cy.get('[data-cy="header-cart-count"]').should("contain", "2");

      // Continue to checkout
      cy.get('[data-cy="sidebar-next-button"]').click();

      cy.get('input[name="name"]').type("Multi Shopper");
      cy.get('input[name="email"]').type("multi@example.com");
      cy.get('input[name="phone"]').type("4444444444");
      cy.get('input[name="province"]').type("Province");
      cy.get('input[name="zipcode"]').type("44444");

      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder").then((interception) => {
        // Should only have 2 items in order
        expect(interception.request.body.cartItems).to.have.length(2);
      });

      cy.contains(/success/i).should("be.visible");
    });
  });

  describe("Session Persistence", () => {
    it("should maintain cart across page refreshes", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      // Add products to cart
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]')
        .click()
        .click();
      
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();

      cy.get('[data-cy="header-cart-count"]').should("contain", "3");

      // Reload page
      cy.reload();
      cy.wait("@getProducts");

      // Cart should persist
      cy.get('[data-cy="header-cart-count"]').should("contain", "3");

      // Verify cart contents
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="cart-item"]').should("have.length", 2);
    });

    it("should maintain authentication across navigation", () => {
      cy.loginByLocalStorage({
        email: "persistent@example.com",
        name: "Persistent User"
      });

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      // Visit home
      cy.visit("/");
      cy.wait("@getProducts");
      cy.url().should("not.include", "/login");

      // Navigate to product details
      cy.visit("/product/1");
      cy.url().should("include", "/product/1");

      // Navigate back to home
      cy.visit("/");
      cy.url().should("not.include", "/login");

      // User should still be authenticated
    });
  });

  describe("Multiple Purchase Cycles", () => {
    it("should allow multiple purchase cycles in same session", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      // First purchase
      cy.visit("/");
      cy.wait("@getProducts");

      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();

      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();

      cy.get('input[name="name"]').type("First Purchase");
      cy.get('input[name="email"]').type("first@example.com");
      cy.get('input[name="phone"]').type("1111111111");
      cy.get('input[name="province"]').type("Province1");
      cy.get('input[name="zipcode"]').type("11111");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder");

      cy.contains(/success/i).should("be.visible");
      cy.get('[data-cy="sidebar-close-button"]').click();

      // Cart should be empty
      cy.get('[data-cy="header-cart-count"]').should("not.exist");

      // Second purchase
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();

      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();

      cy.get('input[name="name"]').type("Second Purchase");
      cy.get('input[name="email"]').type("second@example.com");
      cy.get('input[name="phone"]').type("2222222222");
      cy.get('input[name="province"]').type("Province2");
      cy.get('input[name="zipcode"]').type("22222");

      cy.get('button[type="submit"]').click();
      cy.wait("@createOrder");

      cy.contains(/success/i).should("be.visible");
    });
  });

  describe("Edge Case Journeys", () => {
    it("should handle empty cart navigation", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      // Open empty cart
      cy.get('[data-cy="header-cart-button"]').click();
      cy.contains(/empty/i).should("be.visible");

      // Next button should be disabled
      cy.get('[data-cy="sidebar-next-button"]').should("be.disabled");
    });

    it("should handle rapid add to cart clicks", () => {
      cy.loginByLocalStorage();

      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");

      // Rapidly click add to cart
      cy.get('[data-cy="product-card"]').first()
        .find('[data-cy="product-add-to-cart"]')
        .click()
        .click()
        .click()
        .click()
        .click();

      // Should handle gracefully
      cy.get('[data-cy="header-cart-count"]').should("be.visible");
    });
  });
});
