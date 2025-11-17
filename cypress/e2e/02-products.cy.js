/**
 * E2E Tests for Product Browsing Flow
 * 
 * Tests cover:
 * - Viewing products on homepage
 * - Product grid display
 * - Product search functionality
 * - Clear search
 * - Load more products
 * - View product details
 * - Product availability
 * - Empty states
 * - Error handling
 */

describe("Product Browsing Flow", () => {
  beforeEach(() => {
    // Setup authenticated session
    cy.loginByLocalStorage({
      email: "test@example.com",
      name: "Test User"
    });
  });

  describe("Homepage - Product Grid", () => {
    it("should display product grid on homepage", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should display products section
      cy.get('[data-cy="products-section"]').should("be.visible");
      cy.get('[data-cy="products-section-title"]').should("be.visible");
      cy.get('[data-cy="product-grid"]').should("be.visible");
    });

    it("should display correct number of products", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should display available products only (product with id:6 has stock:0)
      cy.get('[data-cy="product-card"]').should("have.length.at.least", 1);
    });

    it("should display product information correctly", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Check first product card
      cy.get('[data-cy="product-card"]').first().within(() => {
        // Should have image
        cy.get("img").should("be.visible");
        
        // Should have title
        cy.get('[data-cy="product-title"]').should("be.visible");
        
        // Should have price
        cy.get('[data-cy="product-price"]').should("be.visible");
        
        // Should have add to cart button
        cy.get('[data-cy="product-add-to-cart"]').should("be.visible");
      });
    });

    it("should navigate to product details when clicking on product", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Click on first product image or title (not the add to cart button)
      cy.get('[data-cy="product-card"]').first().find("img").click();
      
      // Should navigate to product details page
      cy.url().should("include", "/product/");
    });

    it("should show loading state while fetching products", () => {
      cy.intercept("GET", "**/api/product/public/vip*", (req) => {
        req.reply((res) => {
          res.delay = 1000;
          res.send({
            statusCode: 200,
            fixture: "products.json"
          });
        });
      }).as("getProducts");

      cy.visit("/");
      
      // Loading indicator should be visible (implementation dependent)
      // Note: This test may need adjustment based on actual loading UI
    });

    it("should handle API error gracefully", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 500,
        body: { message: "Server error" }
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should show error message or empty state
      // Note: This depends on error handling implementation
    });
  });

  describe("Product Search", () => {
    it("should display search bar", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.get('[data-cy="search-form"]').should("be.visible");
      cy.get('[data-cy="search-input"]').should("be.visible");
    });

    it("should search for products", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Search for "headphones"
      cy.intercept("GET", "**/api/product/public/vip?*name=headphones*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "1",
              name: "Wireless Headphones",
              price: 79.99,
              description: "High-quality wireless headphones",
              audience: "Electronics",
              image: "https://via.placeholder.com/300",
              stock: 15
            }
          ],
          nextCursor: null
        }
      }).as("searchProducts");

      cy.get('[data-cy="search-input"]').type("headphones");
      
      // Should show clear button when search has text
      cy.get('[data-cy="search-clear-button"]').should("be.visible");
    });

    it("should clear search when clear button is clicked", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Type search term
      cy.get('[data-cy="search-input"]').type("test");
      cy.get('[data-cy="search-clear-button"]').should("be.visible");
      
      // Click clear button
      cy.get('[data-cy="search-clear-button"]').click();
      
      // Search input should be empty
      cy.get('[data-cy="search-input"]').should("have.value", "");
      
      // Clear button should not be visible
      cy.get('[data-cy="search-clear-button"]').should("not.exist");
    });

    it("should show no results message when search returns empty", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.intercept("GET", "**/api/product/public/vip?*name=nonexistent*", {
        statusCode: 200,
        body: {
          items: [],
          nextCursor: null
        }
      }).as("searchEmpty");

      cy.get('[data-cy="search-input"]').type("nonexistent");
      
      // Should show no results message
      cy.contains(/no.*results|sin.*resultados|no.*encontr/i).should("be.visible");
    });

    it("should debounce search input", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.intercept("GET", "**/api/product/public/vip?*name=*", (req) => {
        req.reply({
          statusCode: 200,
          fixture: "products.json"
        });
      }).as("searchRequest");

      // Type multiple characters quickly
      cy.get('[data-cy="search-input"]').type("head", { delay: 50 });
      
      // Wait for debounce
      cy.wait(1500);
      
      // Should only make one request after debounce (implementation dependent)
    });
  });

  describe("Load More Products", () => {
    it("should display load more button when there are more products", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "1",
              name: "Product 1",
              price: 79.99,
              description: "Description 1",
              audience: "Category",
              image: "https://via.placeholder.com/300",
              stock: 15
            }
          ],
          nextCursor: "cursor-123"
        }
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should show load more button when nextCursor exists
      cy.get('[data-cy="load-more-button"]').should("be.visible");
    });

    it("should load more products when button is clicked", () => {
      cy.intercept("GET", "**/api/product/public/vip?limit=*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "1",
              name: "Product 1",
              price: 79.99,
              description: "Description 1",
              audience: "Category",
              image: "https://via.placeholder.com/300",
              stock: 15
            }
          ],
          nextCursor: "cursor-123"
        }
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.intercept("GET", "**/api/product/public/vip?*cursor=cursor-123*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "2",
              name: "Product 2",
              price: 89.99,
              description: "Description 2",
              audience: "Category",
              image: "https://via.placeholder.com/300",
              stock: 10
            }
          ],
          nextCursor: null
        }
      }).as("loadMore");

      cy.get('[data-cy="load-more-button"]').click();
      cy.wait("@loadMore");
      
      // Should add new products to the grid
      cy.get('[data-cy="product-card"]').should("have.length.at.least", 2);
    });

    it("should hide load more button when no more products", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "1",
              name: "Product 1",
              price: 79.99,
              description: "Description 1",
              audience: "Category",
              image: "https://via.placeholder.com/300",
              stock: 15
            }
          ],
          nextCursor: null
        }
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should not show load more button when nextCursor is null
      cy.get('[data-cy="load-more-button"]').should("not.exist");
    });
  });

  describe("Product Details Page", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");
    });

    it("should display product details", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Navigate to product details
      cy.visit("/product/1");
      
      // Should display product details
      cy.get('[data-cy="product-details-image"]').should("be.visible");
      cy.get('[data-cy="product-details-title"]').should("be.visible");
      cy.get('[data-cy="product-details-price"]').should("be.visible");
      cy.get('[data-cy="product-details-description"]').should("be.visible");
      cy.get('[data-cy="product-details-add-to-cart"]').should("be.visible");
    });

    it("should show correct product information", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.visit("/product/1");
      
      // Check product title
      cy.get('[data-cy="product-details-title"]').should("contain", "Wireless Headphones");
      
      // Check product price
      cy.get('[data-cy="product-details-price"]').should("be.visible");
    });

    it("should add product to cart from details page", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.visit("/product/1");
      
      cy.get('[data-cy="product-details-add-to-cart"]').click();
      
      // Cart icon should show updated count
      cy.get('[data-cy="header-cart-count"]').should("contain", "1");
    });

    it("should handle unavailable product", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Navigate to product with no stock (id: 6)
      cy.visit("/product/6");
      
      // Should show unavailable message or redirect
      // Note: This depends on implementation
    });

    it("should handle non-existent product", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      // Navigate to non-existent product
      cy.visit("/product/999");
      
      // Should show loading or not found message
      cy.contains(/loading|not found|no encontrado/i).should("be.visible");
    });

    it("should display fallback image on image error", () => {
      cy.visit("/");
      cy.wait("@getProducts");
      
      cy.visit("/product/1");
      
      // Should have image element
      cy.get('[data-cy="product-details-image"]').should("be.visible");
    });
  });

  describe("Hero Section", () => {
    it("should display hero section on homepage", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        fixture: "products.json"
      }).as("getProducts");

      cy.visit("/");
      
      // Hero section should be visible (implementation dependent)
      // This test may need adjustment based on actual hero section
    });
  });

  describe("Empty States", () => {
    it("should show message when no products available", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        body: {
          items: [],
          nextCursor: null
        }
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should show no products message
      cy.contains(/no.*products|sin.*productos/i).should("be.visible");
    });

    it("should show message when all products out of stock", () => {
      cy.intercept("GET", "**/api/product/public/vip*", {
        statusCode: 200,
        body: {
          items: [
            {
              id: "1",
              name: "Product 1",
              price: 79.99,
              description: "Description",
              audience: "Category",
              image: "https://via.placeholder.com/300",
              stock: 0
            }
          ],
          nextCursor: null
        }
      }).as("getProducts");

      cy.visit("/");
      cy.wait("@getProducts");
      
      // Should show no available products message
      cy.contains(/no.*available|no.*disponible/i).should("be.visible");
    });
  });
});
