# Jewelment B2B Portal: User Manual

## Overview
This manual provides detailed operational guidelines for using the Jewelment B2B Portal, with a specific focus on the automated image management features inside the Product Editor.

## 1. Product Editor: "Auto Magic" Image Sorting

### How It Works
The B2B Portal includes a **100% Offline AI-Free "Auto Magic" Image Scanner**. This feature mathematically analyzes your jewelry photos directly within your web browser to identify the metal color (Yellow, Rose, White) and the view angle (Perspective, Front, Side, Infographic).

Because it does not rely on external cloud AI APIs, it works instantly (in milliseconds) and does not require an active internet connection to sort images.

### The Trigger Mechanisms
1. **Drag-and-Drop Auto-Sort**: When you drag and drop a folder of unstructured images onto the gallery dropzone, the system will instantly process, tag, and sort the images before rendering them.
2. **Manual Override (✨ Auto Magic)**: If you manually alter the sequence of images and wish to revert to the perfect mathematical sequence, you can click the golden "✨ AUTO MAGIC" button to re-sort the grid.

### The Guaranteed Sorting Sequence
The engine uses deterministic sorting to enforce the following hierarchy. 
**Primary Sort:** Metal Color (Yellow -> Rose -> White)
**Secondary Sort:** View Angle
1. **Perspective** (The angled hero shot)
2. **Front** (The round top-down shot)
3. **Photoshoot / Lifestyle** (Creative shots)
4. **Side** (Flat or tall profile shots)
5. **Infographic** (Size charts, dimension overlays)

### Automatic Primary Image Assignment
By default, the master variant is **Yellow Gold**. Whenever the system performs an Auto-Sort (either on drag-and-drop or via the Auto Magic button), the algorithm will automatically lock the very first image (Yellow Gold / Perspective View) as the `PRIMARY IMAGE`. This ensures that your storefront and catalog always display the correct hero thumbnail without requiring manual clicks.

---

## Technical Appendix: Offline Pseudo Code

For engineering reference, here is the pseudo-code governing the offline aspect-ratio and pixel-density geometry scanner:

```javascript
/**
 * 100% OFFLINE GEOMETRY SCANNER (PSEUDO-CODE)
 * Runs in the browser using HTML5 Canvas pixel extraction.
 */

FUNCTION detectViewAngleAlgorithmically(imageBuffer):
    // 1. Draw image to invisible canvas
    Draw imageBuffer to HTML5 Canvas
    Extract raw ImageData array (RGBA pixels)
    
    // 2. Identify the Bounding Box (Ignore pure white backgrounds)
    SET minX = Infinity, minY = Infinity
    SET maxX = 0, maxY = 0
    SET nonWhitePixelCount = 0
    
    FOR EACH pixel IN ImageData:
        IF pixel is NOT White (r<240 OR g<240 OR b<240):
            nonWhitePixelCount++
            Update minX, minY, maxX, maxY
            
    // 3. Mathematical Calculations
    boxWidth = maxX - minX
    boxHeight = maxY - minY
    aspectRatio = boxWidth / boxHeight
    pixelDensity = nonWhitePixelCount / (boxWidth * boxHeight)
    
    // 4. Heuristic Geometry Classification
    
    // Infographics: Huge box, mostly white space inside (low density)
    IF pixelDensity < 0.20:
        RETURN "Infographic"
        
    // Side View: Extremely narrow or extremely flat
    IF aspectRatio < 0.65 OR aspectRatio > 1.8:
        RETURN "Side"
        
    // Front View: Round rings have drop shadows making them taller than wide
    IF aspectRatio >= 0.65 AND aspectRatio <= 0.98:
        RETURN "Front"
        
    // Right Side / Perspective: Angled rings are wider than they are tall
    RETURN "Right Side"

END FUNCTION
```
