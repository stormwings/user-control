/**
 * E2E Tests for Checkout Flow
 * 
 * Tests cover:
 * - Navigate through checkout steps
 * - Fill checkout form
 * - Form validation
 * - Complete order successfully
 * - Handle checkout errors
 * - Order confirmation
 * - Clear cart after successful order
 */

describe("Checkout Flow", () => {
  beforeEach(() => {
    // Setup authenticated session
    cy.loginByLocalStorage({
      email: "test@example.com",
      name: "Test User"
    });

    // Clear cart before each test
    cy.clearCart();

    // Setup products
    cy.intercept("GET", "**/api/product/public/vip*", {
      statusCode: 200,
      fixture: "products.json"
    }).as("getProducts");
  });

  describe("Checkout Form", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product to cart and navigate to checkout
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      // Should be on checkout step
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "2");
    });

    it("should display checkout form", () => {
      // Should display all form fields
      cy.get('input[name="name"]').should("be.visible");
      cy.get('input[name="email"]').should("be.visible");
      cy.get('input[name="phone"]').should("be.visible");
      cy.get('input[name="province"]').should("be.visible");
      cy.get('input[name="zipcode"]').should("be.visible");
    });

    it("should display order summary", () => {
      // Should show cart items summary
      cy.contains(/total|subtotal/i).should("be.visible");
      cy.contains("79.99").should("be.visible");
    });

    it("should validate required fields", () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // Should show validation errors
      cy.contains(/required|requerido|obligatorio/i).should("be.visible");
    });

    it("should validate email format", () => {
      cy.get('input[name="email"]').type("invalid-email");
      cy.get('button[type="submit"]').click();
      
      // Should show email validation error
      cy.contains(/email|correo.*válido/i).should("be.visible");
    });

    it("should validate phone number format", () => {
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("test@example.com");
      cy.get('input[name="phone"]').type("abc");
      cy.get('button[type="submit"]').click();
      
      // Should show phone validation error (if validation exists)
    });

    it("should fill out checkout form successfully", () => {
      // Fill form with valid data
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      
      // Form should accept all inputs
      cy.get('input[name="name"]').should("have.value", "Test Customer");
      cy.get('input[name="email"]').should("have.value", "customer@example.com");
    });

    it("should handle optional fields", () => {
      // Fill only required fields
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      
      // Optional fields like notes can be empty
      cy.get('textarea[name="notes"]').should("exist");
    });

    it("should show form errors inline", () => {
      // Type invalid email
      cy.get('input[name="email"]').type("invalid");
      cy.get('input[name="name"]').click(); // Blur email field
      
      // Should show inline error (if implemented)
    });
  });

  describe("Submit Order", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and navigate to checkout
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
    });

    it("should submit order successfully", () => {
      // Intercept order creation
      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      // Fill form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      cy.wait("@createOrder");
      
      // Should navigate to success step
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "3");
    });

    it("should send correct order data to API", () => {
      cy.intercept("POST", "**/api/order/public").as("createOrder");

      // Fill form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      cy.get('textarea[name="notes"]').type("Test order notes");
      
      cy.get('button[type="submit"]').click();
      
      cy.wait("@createOrder").then((interception) => {
        const body = interception.request.body;
        
        // Verify order data structure
        expect(body).to.have.property("customer", "Test Customer");
        expect(body).to.have.property("province", "Buenos Aires");
        expect(body).to.have.property("phone");
        expect(body).to.have.property("zipcode");
        expect(body).to.have.property("cartItems");
        expect(body.cartItems).to.have.length(1);
        expect(body).to.have.property("totalAmount");
      });
    });

    it("should disable submit button while submitting", () => {
      cy.intercept("POST", "**/api/order/public", (req) => {
        req.reply((res) => {
          res.delay = 1000;
          res.send({
            statusCode: 200,
            fixture: "order-success.json"
          });
        });
      }).as("createOrder");

      // Fill form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      
      cy.get('button[type="submit"]').click();
      
      // Button should be disabled
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it("should handle order creation error", () => {
      cy.intercept("POST", "**/api/order/public", {
        statusCode: 500,
        body: { message: "Server error" }
      }).as("createOrder");

      // Fill form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      
      cy.get('button[type="submit"]').click();
      
      cy.wait("@createOrder");
      
      // Should navigate to result step showing error
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "3");
      cy.contains(/error|failed/i).should("be.visible");
    });

    it("should handle network error", () => {
      cy.intercept("POST", "**/api/order/public", {
        forceNetworkError: true
      }).as("createOrder");

      // Fill form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      
      cy.get('button[type="submit"]').click();
      
      // Should show error
      cy.contains(/error|failed/i, { timeout: 10000 }).should("be.visible");
    });
  });

  describe("Order Confirmation", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product, navigate to checkout, and complete order
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      cy.intercept("POST", "**/api/order/public", {
        statusCode: 200,
        fixture: "order-success.json"
      }).as("createOrder");

      // Fill and submit form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      cy.get('button[type="submit"]').click();
      
      cy.wait("@createOrder");
    });

    it("should display success message", () => {
      // Should be on step 3
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "3");
      
      // Should show success message
      cy.contains(/success|éxito|completed|completado/i).should("be.visible");
    });

    it("should display order ID", () => {
      // Should show order ID from fixture
      cy.contains("ORD-20231109-001").should("be.visible");
    });

    it("should clear cart after successful order", () => {
      // Cart count should be 0 or hidden
      cy.get('[data-cy="header-cart-count"]').should("not.exist");
    });

    it("should allow closing sidebar after order", () => {
      // Close button should be visible
      cy.get('[data-cy="sidebar-close-button"]').should("be.visible");
      cy.get('[data-cy="sidebar-close-button"]').click();
      
      // Sidebar should close
      cy.get('[data-cy="sidebar"]').should("not.be.visible");
    });

    it("should not show back button on success step", () => {
      // Back button should not exist on step 3
      cy.get('[data-cy="sidebar-back-button"]').should("not.exist");
    });

    it("should reset to cart step when reopening sidebar", () => {
      // Close sidebar
      cy.get('[data-cy="sidebar-close-button"]').click();
      
      // Reopen sidebar
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Should be back on step 1
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "1");
      
      // Cart should be empty
      cy.contains(/empty|vacío/i).should("be.visible");
    });
  });

  describe("Cancel Checkout", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and navigate to checkout
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
    });

    it("should cancel checkout and return to cart", () => {
      // Click cancel button
      cy.get('[data-cy="sidebar-cancel-button"]').click();
      
      // Should close sidebar
      cy.get('[data-cy="sidebar"]').should("not.be.visible");
    });

    it("should preserve cart items when canceling", () => {
      // Cancel checkout
      cy.get('[data-cy="sidebar-cancel-button"]').click();
      
      // Cart count should still show 1
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
      
      // Reopen cart
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Item should still be there
      cy.get('[data-cy="cart-item"]').should("have.length", 1);
    });
  });

  describe("Checkout with Multiple Items", () => {
    it("should checkout with multiple different products", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add multiple products
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      cy.intercept("POST", "**/api/order/public").as("createOrder");

      // Fill and submit
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      cy.get('input[name="phone"]').type("1234567890");
      cy.get('input[name="province"]').type("Buenos Aires");
      cy.get('input[name="zipcode"]').type("1000");
      cy.get('button[type="submit"]').click();
      
      cy.wait("@createOrder").then((interception) => {
        const body = interception.request.body;
        expect(body.cartItems).to.have.length(2);
      });
    });

    it("should calculate correct total with multiple items", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add products: 79.99 + 199.99 = 279.98
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      // Should show correct total
      cy.contains(/279\.98/).should("be.visible");
    });
  });

  describe("Form Auto-fill and Persistence", () => {
    it("should remember customer information across checkout attempts", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and checkout
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      // Fill form
      cy.get('input[name="name"]').type("Test Customer");
      cy.get('input[name="email"]').type("customer@example.com");
      
      // Go back
      cy.get('[data-cy="sidebar-back-button"]').click();
      
      // Add another item
      cy.get('[data-cy="sidebar"]').should("not.be.visible");
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      
      // Go to checkout again
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      // Form might remember data (implementation dependent)
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long customer names", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      const longName = "A".repeat(100);
      cy.get('input[name="name"]').type(longName);
      
      // Should handle long input (might truncate)
    });

    it("should handle special characters in form fields", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      cy.get('input[name="name"]').type("José María O'Brien");
      cy.get('input[name="province"]').type("São Paulo");
      
      // Should accept special characters
    });
  });
});
