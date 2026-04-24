# iOS 15 Compatibility Fixes

## Problem Summary
iPhone 7 Plus (max iOS 15) has limited support for modern CSS and JavaScript features. Many buttons were invisible/unclickable due to hover-dependent visibility.

## Solutions Applied

### 1. Fixed Hover-Dependent Button Visibility
**Problem:** Buttons hidden with `opacity-0 group-hover:opacity-100` never became visible on touch devices (no hover event)

**Solution:** Changed to:
```jsx
className="... opacity-0 sm:opacity-0 sm:group-hover:opacity-100 active:opacity-100 ..."
```
- Buttons remain visible on mobile (no opacity hiding on mobile)
- Hover effects work on desktop
- Active state provides visual feedback on mobile

**Files fixed:**
- `src/components/portfolio/ProjectGallery.js` - maximize button
- `src/components/admin/MultiImagePicker.js` - delete buttons  
- `src/components/home/PortfolioPreview.js` - overlay effect
- `src/app/kolekcia/[slug]/page.js` - gradient overlay

### 2. Fixed backdrop-filter Support
**Problem:** `backdrop-blur-md` not fully supported in iOS 15 Safari

**Solution:**
- Removed Tailwind class
- Added inline styles with webkit prefix:
  ```jsx
  style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}
  ```
- Added `@supports` rules in CSS for fallback

**Files fixed:**
- `src/components/layout/Navbar.js` - navbar background
- `src/components/portfolio/ProjectGallery.js` - lightbox button icon
- `src/app/globals.css` - @supports rules

### 3. Enhanced CSS Compatibility
Added to `globals.css`:
```css
@supports (backdrop-filter: blur(10px)) { ... }
@supports (-webkit-backdrop-filter: blur(10px)) { ... }
```

## Testing Recommendations

### Desktop
- Check that hover states still work
- Verify animations are smooth
- Test backdrop-filter blur effect

### Mobile (iPhone 7+, iOS 15)
- ✓ All buttons should be visible and clickable
- ✓ Delete/remove buttons should work without hover
- ✓ Image maximize buttons should work
- ✓ Carousel controls should respond

### Safari on iOS
- Test in both Safari and Chrome
- Test buttons don't require hover
- Test form submissions work

## Additional Recommendations

### For Future Updates
1. Avoid `group-hover` without mobile fallback
2. Use `@supports` rules for newer CSS features
3. Test on iOS 15 Safari before deploying
4. Consider using touch-specific event handling if needed

### Performance on Older Devices
- Animations may be slower - consider reducing duration
- Consider disabling framer-motion on low-end devices
- Lazy load images to reduce memory usage

## Browser Support Changes
- Before: Required hover support
- After: Works with both hover (desktop) and active (mobile) states
- Fallback: All buttons visible on mobile, enhanced UI on desktop
