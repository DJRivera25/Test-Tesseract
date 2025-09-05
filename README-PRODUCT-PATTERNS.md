# Product Pattern Matching System

## Overview

The Product Pattern Matching System has been updated to only output products that are explicitly listed in the `productPatterns.js` file. This ensures that only pre-approved, specific products are returned from OCR processing.

## How It Works

### 1. Specific Product Patterns

All products must be defined in the `specificProducts` array in `backend/data/patterns/productPatterns.js`. Each product has:

- **name**: The canonical product name
- **patterns**: Array of regex patterns that match OCR variations

### 2. Pattern Matching Process

1. **OCR Text Input**: Receipt text is processed through OCR
2. **Pattern Check**: Text is checked against all specific product patterns
3. **Match Validation**: Only items matching specific patterns proceed
4. **Product Lookup**: Matched products are looked up in the database
5. **Output**: Only matched products are returned

### 3. Current Supported Products

- **Bear Brand Adult Plus 33g** - 50+ OCR variations supported
- **Bear Brand Fortified** - 3 OCR variations
- **Nescafe Gold** - 1 OCR variation
- **NIDO3+PRE-S1.6KG** - 2 OCR variations
- **NIDO3+PRE-S2.4KG** - 2 OCR variations

## Bear Brand Adult Plus 33g Patterns

This product supports extensive OCR variations including:

### Brand Variations

- `BBRAND` (OCR abbreviation)
- `Bear Brand` (Full name)
- `BearBrand` (No spaces)
- `BearB` (Shortened)
- `BB` (Very short)
- `NESTLE BB` (With company prefix)
- `NSTL BB` (Abbreviated company)
- `NEST BB` (Shortened company)

### Product Name Variations

- `Adult Plus` (With space)
- `AdultPlus` (No space)
- `AdultPlus33g` (No spaces anywhere)

### Company Prefix Variations

- `NESTLE` → `NEST` → `NSTL` (OCR abbreviations)
- `BB` → `BBAD` (Shortened product names)

## Adding New Products

### Step 1: Define Product in Patterns

```javascript
{
  name: "Your Product Name",
  patterns: [
    /PATTERN1/i,
    /PATTERN2/i,
    // Add more patterns for OCR variations
  ],
}
```

### Step 2: Add to Product Categories

```javascript
const PRODUCT_CATEGORIES = {
  yourCategory: ["your product name", "other products"],
  // ... existing categories
};
```

### Step 3: Test Patterns

Use the test script to verify patterns work:

```bash
cd backend
node test-pattern-matching.js
```

## Pattern Design Guidelines

### 1. OCR Error Handling

- Use case-insensitive regex (`/i` flag)
- Account for missing spaces: `/Product\s*Name/`
- Handle common OCR mistakes: `/P[0O]duct/`

### 2. Flexibility

- Use `\s*` for optional spaces
- Use `\s+` for required spaces
- Use character classes for OCR errors: `[0O]` for 0 vs O

### 3. Specificity

- Be specific enough to avoid false matches
- Include volume/weight information when possible
- Use brand names to distinguish similar products

## Testing

### Run Pattern Tests

```bash
cd backend
node test-pattern-matching.js
```

### Test Individual Patterns

```javascript
const { PRODUCT_PATTERNS } = require("./data/patterns/productPatterns");

// Test a specific pattern
const testText = "BBRAND Adult Plus 33g";
const matches = PRODUCT_PATTERNS.specificProducts.some((product) =>
  product.patterns.some((pattern) => pattern.test(testText))
);
```

## Benefits

1. **Quality Control**: Only approved products are returned
2. **Consistency**: Standardized product names across the system
3. **OCR Resilience**: Handles various OCR text variations
4. **Maintainability**: Easy to add/remove products
5. **Performance**: Faster matching with specific patterns vs fuzzy search

## Migration Notes

- **Before**: Fuzzy search returned any similar products
- **After**: Only products matching specific patterns are returned
- **Impact**: Reduced false positives, improved accuracy
- **Action Required**: Add all desired products to patterns file

## Troubleshooting

### Product Not Found

1. Check if product exists in `specificProducts` array
2. Verify regex patterns are correct
3. Test patterns with `test-pattern-matching.js`
4. Check for typos in product names

### Pattern Too Strict

1. Add more variations to patterns array
2. Use more flexible regex (e.g., `\s*` for optional spaces)
3. Test with actual OCR output

### Pattern Too Loose

1. Make regex more specific
2. Add volume/weight constraints
3. Include brand name requirements

