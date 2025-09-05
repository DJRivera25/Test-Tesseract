const Product = require("../models/Product");
const Fuse = require("fuse.js");
const { isLikelyProduct } = require("../utils/ocrHelpers");
const { PRODUCT_PATTERNS } = require("../data/patterns/productPatterns");

// === Fuzzy Match Threshold Constant ===
const FUZZY_VALID_THRESHOLD = 0.4; // Accept as valid if below or equal to this score (Fuse.js: lower is better)

class ProductMatchingService {
  constructor() {
    // Fuse.js configuration for fuzzy search
    this.fuseOptions = {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "normalized_name", weight: 0.4 },
        { name: "keywords", weight: 0.1 },
      ],
      threshold: FUZZY_VALID_THRESHOLD, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 3,
      findAllMatches: false,
      location: 0,
      distance: 100,
      useExtendedSearch: false,
      ignoreLocation: false,
      ignoreFieldNorm: false,
    };

    // Cache for product search data
    this.productSearchCache = null;
    this.lastCacheUpdate = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes

    // OCR Error Correction Patterns - now imported from data/patterns
    this.ocrCorrections = require("../data/patterns/ocrCorrections").OCR_CORRECTIONS;
  }

  /**
   * Correct common OCR errors in product names
   * @param {string} itemName - Raw item name from OCR
   * @returns {string} Corrected item name
   */
  correctOcrErrors(itemName) {
    let correctedName = itemName;

    // Apply product name corrections
    for (const fix of this.ocrCorrections.productCorrections || []) {
      correctedName = correctedName.replace(fix.from, fix.to);
    }

    // Apply volume corrections
    for (const fix of this.ocrCorrections.volumeCorrections || []) {
      correctedName = correctedName.replace(fix.from, fix.to);
    }

    console.log(`[OCR Correction] "${itemName}" -> "${correctedName}"`);
    return correctedName;
  }

  /**
   * Check if item is likely a product (not a total/header)
   * @param {string} itemName - Item name to check
   * @returns {boolean} True if likely a product
   */
  isLikelyProduct(itemName) {
    return isLikelyProduct(itemName);
  }

  /**
   * Check if item matches any specific product pattern
   * @param {string} itemName - Item name to check
   * @returns {Object|null} Matching product pattern or null
   */
  matchesSpecificProductPattern(itemName) {
    if (!itemName || typeof itemName !== "string") {
      return null;
    }

    // Check against all specific product patterns
    for (const product of PRODUCT_PATTERNS.specificProducts) {
      for (const pattern of product.patterns) {
        if (pattern.test(itemName)) {
          console.log(`[Pattern Match] "${itemName}" matches "${product.name}"`);
          return {
            name: product.name,
            matchedPattern: pattern.source,
            originalName: itemName,
          };
        }
      }
    }

    return null;
  }

  /**
   * Get cached product search data
   * @returns {Promise<Array>} Product search data
   */
  async getProductSearchData() {
    try {
      // Check if cache is still valid
      if (this.productSearchCache && this.lastCacheUpdate) {
        const now = Date.now();
        if (now - this.lastCacheUpdate < this.cacheExpiry) {
          console.log("Using cached product data");
          return this.productSearchCache;
        }
      }

      // Fetch fresh data from database
      console.log("Fetching fresh product data from database");
      const products = await Product.find({ status: "active" }).populate("brandId", "name").lean();

      // Update cache
      this.productSearchCache = products;
      this.lastCacheUpdate = Date.now();

      console.log(`Loaded ${products.length} active products for matching`);
      return products;
    } catch (error) {
      console.error("Error fetching product search data:", error);
      return [];
    }
  }

  /**
   * Normalize item name for better matching
   * @param {string} itemName - Item name to normalize
   * @returns {string} Normalized item name
   */
  normalizeItemName(itemName) {
    return itemName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\./g, "") // Remove decimal points for better matching (2.4kg -> 24kg)
      .trim();
  }

  /**
   * Find matching product using specific product patterns only
   * @param {Object} item - Receipt item
   * @returns {Promise<Object|null>} Matching product with confidence score
   */
  async findMatchingProduct(item) {
    try {
      // Check if item is likely a product (not a total/header)
      if (!this.isLikelyProduct(item.name)) {
        console.log(`Skipping non-product item: "${item.name}"`);
        return null;
      }

      // Correct common OCR errors
      const correctedItemName = this.correctOcrErrors(item.name);

      // Check if the corrected item name matches any specific product pattern
      const patternMatch = this.matchesSpecificProductPattern(correctedItemName);

      if (!patternMatch) {
        console.log(`No specific product pattern match found for: "${correctedItemName}"`);
        return null;
      }

      // Get product search data to find the actual product details
      const products = await this.getProductSearchData();

      if (products.length === 0) {
        console.log("No active products found in database");
        return null;
      }

      // Find the product in database that matches the pattern name
      const matchedProduct = products.find(
        (product) =>
          product.name.toLowerCase().includes(patternMatch.name.toLowerCase()) ||
          (product.normalized_name && product.normalized_name.toLowerCase().includes(patternMatch.name.toLowerCase()))
      );

      if (!matchedProduct) {
        console.log(`Product "${patternMatch.name}" not found in database`);
        return null;
      }

      console.log(`Pattern match found for "${correctedItemName}":`, {
        productName: matchedProduct.name,
        normalizedName: matchedProduct.normalized_name,
        brand: matchedProduct.brandId?.name || "Unknown",
        volume: `${matchedProduct.volume}${matchedProduct.volumeUnit}`,
        points: matchedProduct.points,
        matchedPattern: patternMatch.matchedPattern,
        originalName: patternMatch.originalName,
      });

      // Return product with pattern match information
      return {
        ...matchedProduct,
        _confidenceScore: 0.0, // Perfect match since it's from specific patterns
        _matchDetails: [{ key: "name", value: patternMatch.name, indices: [[0, patternMatch.name.length - 1]] }],
        _matchQuality: "excellent",
        _patternMatch: patternMatch,
      };
    } catch (error) {
      console.error("Error in specific product pattern matching:", error);
      return null;
    }
  }

  /**
   * Get match quality based on confidence score
   * @param {number} confidenceScore - Fuse.js confidence score
   * @returns {string} Match quality
   */
  getMatchQuality(confidenceScore) {
    if (confidenceScore <= 0.1) return "excellent"; // auto-accept
    if (confidenceScore <= 0.2) return "good"; // auto-accept
    if (confidenceScore <= 0.3) return "fair"; // manual review
    if (confidenceScore <= 0.4) return "poor"; // manual review
    return "low"; // treat as not found/invalid
  }

  /**
   * Get all available specific products from patterns
   * @returns {Array} List of specific product names
   */
  getAvailableSpecificProducts() {
    return PRODUCT_PATTERNS.specificProducts.map((product) => ({
      name: product.name,
      patternCount: product.patterns.length,
      patterns: product.patterns.map((p) => p.source),
    }));
  }

  /**
   * Get product suggestions for unmatched items (only specific pattern products)
   * @param {string} itemName - Item name to find suggestions for
   * @param {number} limit - Number of suggestions to return
   * @returns {Promise<Array>} Product suggestions
   */
  async getProductSuggestions(itemName, limit = 5) {
    try {
      const products = await this.getProductSearchData();

      if (products.length === 0) {
        return [];
      }

      // Only return products that match specific patterns
      const specificProducts = [];

      for (const product of products) {
        // Check if this product name matches any specific pattern
        const isSpecificProduct = PRODUCT_PATTERNS.specificProducts.some(
          (patternProduct) =>
            patternProduct.name.toLowerCase() === product.name.toLowerCase() ||
            (product.normalized_name && patternProduct.name.toLowerCase() === product.normalized_name.toLowerCase())
        );

        if (isSpecificProduct) {
          specificProducts.push({
            id: product._id,
            name: product.name,
            normalized_name: product.normalized_name,
            brand: product.brandId?.name || "Unknown",
            volume: `${product.volume}${product.volumeUnit}`,
            points: product.points,
            keywords: product.keywords,
            confidenceScore: 0.0, // Perfect match for specific products
            matchQuality: "excellent",
            isSpecificProduct: true,
          });
        }
      }

      // Return limited number of specific products
      return specificProducts.slice(0, limit);
    } catch (error) {
      console.error("Error getting specific product suggestions:", error);
      return [];
    }
  }
}

// Export singleton instance
const productMatchingService = new ProductMatchingService();
module.exports = productMatchingService;
