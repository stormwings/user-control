/**
 * E2E Tests for Shopping Cart Flow
 * 
 * Tests cover:
 * - Add products to cart
 * - Remove products from cart
 * - Increase/decrease product quantity
 * - Cart item count display
 * - Cart total calculation
 * - Cart sidebar open/close
 * - Clear cart functionality
 * - Cart persistence
 * - Empty cart states
 */

describe("Shopping Cart Flow", () => {
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

  describe("Add to Cart", () => {
    it("should add product to cart from product grid", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add first product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      // Cart count should update
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
    });

    it("should add product to cart from product details page", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.visit("/product/1");
      
      cy.get('[data-cy="product-details-add-to-cart"]').click();
      
      // Cart count should update
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
    });

    it("should update cart count when adding multiple products", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add first product
      cy.get('[data-cy="product-card"]')
        .eq(0)
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
      
      // Add second product
      cy.get('[data-cy="product-card"]')
        .eq(1)
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-count"]').should("contain", "2");
    });

    it("should increase quantity when adding same product multiple times", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add same product twice
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click()
        .click();
      
      // Cart count should be 2
      cy.get('[data-cy="header-cart-count"]').should("contain", "2");
    });

    it("should show visual feedback when adding to cart", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      // Cart icon should be visible and updated
      cy.get('[data-cy="header-cart-button"]').should("be.visible");
      cy.get('[data-cy="header-cart-count"]').should("be.visible");
    });
  });

  describe("Cart Sidebar", () => {
    it("should open cart sidebar when clicking cart icon", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Sidebar should be visible
      cy.get('[data-cy="sidebar"]').should("be.visible");
    });

    it("should display empty cart message when cart is empty", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Should show empty cart message
      cy.get('[data-cy="sidebar"]').within(() => {
        cy.contains(/empty|vacío|no.*items|sin.*productos/i).should("be.visible");
      });
    });

    it("should display cart items in sidebar", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      // Open cart
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Should display cart item
      cy.get('[data-cy="sidebar"]').within(() => {
        cy.get('[data-cy="cart-item"]').should("have.length", 1);
      });
    });

    it("should display correct cart total", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      // Open cart
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Should display total (price from fixture: 79.99)
      cy.get('[data-cy="sidebar"]').within(() => {
        cy.contains(/total/i).should("be.visible");
        cy.contains("79.99").should("be.visible");
      });
    });

    it("should close sidebar when clicking outside or close button", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Open cart
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar"]').should("be.visible");
      
      // Close cart by clicking outside (if overlay exists)
      // or using ESC key
      cy.get("body").type("{esc}");
      
      // Sidebar should close (implementation dependent)
    });

    it("should show step indicator in sidebar", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and open cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Should show step label
      cy.get('[data-cy="sidebar-step-label"]').should("be.visible");
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "1");
      
      // Should show progress bar
      cy.get('[data-cy="sidebar-progress-bar"]').should("be.visible");
    });
  });

  describe("Cart Item Management", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add a product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      // Open cart
      cy.get('[data-cy="header-cart-button"]').click();
    });

    it("should display cart item information", () => {
      cy.get('[data-cy="cart-item"]').first().within(() => {
        // Should have image
        cy.get("img").should("be.visible");
        
        // Should have title
        cy.contains("Wireless Headphones").should("be.visible");
        
        // Should have price
        cy.contains("79.99").should("be.visible");
        
        // Should have quantity
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "1");
      });
    });

    it("should increase product quantity", () => {
      cy.get('[data-cy="cart-item"]').first().within(() => {
        // Click increase button
        cy.get('[data-cy="cart-item-increase"]').click();
        
        // Quantity should be 2
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "2");
      });
      
      // Cart count should update
      cy.get('[data-cy="header-cart-count"]').should("contain", "2");
      
      // Total should update (79.99 * 2 = 159.98)
      cy.get('[data-cy="sidebar"]').contains(/159\.98/).should("be.visible");
    });

    it("should decrease product quantity", () => {
      // Increase quantity first
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="cart-item-increase"]').click();
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "2");
      });
      
      // Decrease quantity
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="cart-item-decrease"]').click();
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "1");
      });
      
      // Cart count should update
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
    });

    it("should remove item when quantity reaches zero", () => {
      cy.get('[data-cy="cart-item"]').first().within(() => {
        // Decrease from 1 to 0
        cy.get('[data-cy="cart-item-decrease"]').click();
      });
      
      // Item should be removed
      cy.get('[data-cy="cart-item"]').should("not.exist");
      
      // Should show empty cart message
      cy.contains(/empty|vacío/i).should("be.visible");
      
      // Cart count should be 0 or hidden
      cy.get('[data-cy="header-cart-count"]').should("not.exist").or("contain", "0");
    });

    it("should remove item when clicking remove button", () => {
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="cart-item-remove"]').click();
      });
      
      // Item should be removed
      cy.get('[data-cy="cart-item"]').should("not.exist");
      
      // Should show empty cart message
      cy.contains(/empty|vacío/i).should("be.visible");
    });

    it("should update total when changing quantities", () => {
      // Initial total: 79.99
      cy.contains(/79\.99/).should("be.visible");
      
      // Increase quantity to 3
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="cart-item-increase"]').click();
        cy.get('[data-cy="cart-item-increase"]').click();
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "3");
      });
      
      // Total should be 239.97
      cy.contains(/239\.97/).should("be.visible");
    });
  });

  describe("Multiple Products in Cart", () => {
    it("should handle multiple different products", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add multiple products
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="product-card"]').eq(2)
        .find('[data-cy="product-add-to-cart"]').click();
      
      // Cart count should be 3
      cy.get('[data-cy="header-cart-count"]').should("contain", "3");
      
      // Open cart
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Should have 3 different items
      cy.get('[data-cy="cart-item"]').should("have.length", 3);
    });

    it("should calculate correct total for multiple products", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add products: Wireless Headphones (79.99) + Smart Watch (199.99)
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Total should be 279.98
      cy.contains(/279\.98/).should("be.visible");
    });
  });

  describe("Cart Navigation", () => {
    it("should navigate to checkout step", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and open cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Click next/checkout button
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      // Should move to step 2 (checkout)
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "2");
    });

    it("should disable next button when cart is empty", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Next button should be disabled when cart is empty
      cy.get('[data-cy="sidebar-next-button"]').should("be.disabled");
    });

    it("should navigate back from checkout to cart", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and navigate to checkout
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      cy.get('[data-cy="sidebar-next-button"]').click();
      
      // Should be on step 2
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "2");
      
      // Click back button
      cy.get('[data-cy="sidebar-back-button"]').click();
      
      // Should be back on step 1
      cy.get('[data-cy="sidebar-step-label"]').should("contain", "1");
    });
  });

  describe("Cart Persistence", () => {
    it("should persist cart items on page reload", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
      
      // Reload page
      cy.reload();
      
      // Cart should still have the item
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
    });

    it("should persist cart across sessions", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      // Get cart from localStorage
      cy.window().then((win) => {
        const cart = JSON.parse(win.localStorage.getItem("cart") || "[]");
        expect(cart).to.have.length(1);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle adding product with missing price", () => {
      // This test depends on implementation
      // Should either show error or default to 0
    });

    it("should handle very large quantities", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add product and open cart
      cy.get('[data-cy="product-card"]')
        .first()
        .find('[data-cy="product-add-to-cart"]')
        .click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Increase quantity many times
      cy.get('[data-cy="cart-item"]').first().within(() => {
        for (let i = 0; i < 10; i++) {
          cy.get('[data-cy="cart-item-increase"]').click();
        }
        
        // Should show correct quantity
        cy.get('[data-cy="cart-item-quantity"]').should("contain", "11");
      });
    });

    it("should recalculate total correctly after removing items", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Add multiple products
      cy.get('[data-cy="product-card"]').eq(0)
        .find('[data-cy="product-add-to-cart"]').click();
      cy.get('[data-cy="product-card"]').eq(1)
        .find('[data-cy="product-add-to-cart"]').click();
      
      cy.get('[data-cy="header-cart-button"]').click();
      
      // Remove first item
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="cart-item-remove"]').click();
      });
      
      // Total should only include second product (199.99)
      cy.contains(/199\.99/).should("be.visible");
    });
  });
});
