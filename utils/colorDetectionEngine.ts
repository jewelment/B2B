/**
 * Converts RGB values to HSL (Hue, Saturation, Lightness).
 * R, G, B should be in [0, 255].
 * Returns [H (0-360), S (0-100), L (0-100)].
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; 
  g /= 255; 
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

/**
 * Programmatic Pixel Color Detection Engine
 * Scans image pixels to determine if a ring is Yellow, Rose, or White gold.
 * Ignores backgrounds and shadows.
 * @param imageUrl Blob URL or path to the image
 * @returns 'Yellow' | 'Rose' | 'White' | 'Description Image'
 */
export const detectMetalColorAlgorithmically = async (imageUrl: string): Promise<'Yellow' | 'Rose' | 'White' | 'Description Image'> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('Yellow'); // Fallback if canvas is unavailable

      // Downscale image to 100x100 for incredibly fast processing
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      
      let yellowCount = 0;
      let roseCount = 0;
      let whiteCount = 0;
      let validPixelCount = 0;

      // Analyze every pixel in the 100x100 downscaled matrix
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // 1. Ignore transparent pixels
        if (a < 128) continue; 
        
        // 2. Ignore pure dark/black/shadows and deep studio contrast lines
        if (r < 70 && g < 70 && b < 70) continue;
        
        // 3. Ignore pure white background or intensely bright studio glare/reflections
        if (r > 235 && g > 235 && b > 235) continue;

        const [h, s, l] = rgbToHsl(r, g, b);

        // 4. Ignore pixels that are too dark or too light (often ambient occlusion or highlight clipping)
        if (l < 20 || l > 85) continue;

        validPixelCount++;

        // 5. White Gold Classification (Silver/Chrome)
        // Highly desaturated. Platinum/White Gold rarely exceeds 15% saturation.
        if (s < 18) {
          whiteCount++;
          continue;
        }

        // 6. Colored Metal Classification based on Hue Matrix
        // Yellow Gold typically sits in the yellow/brass spectrum (30 to 65 hue)
        if (h >= 30 && h <= 65) {
          yellowCount++;
        } 
        // Rose Gold sits in the blush/pink spectrum (320-360) or copper/red (0-30)
        else if ((h >= 315 && h <= 360) || (h >= 0 && h < 30)) {
          roseCount++;
        }
      }

      const maxColor = Math.max(yellowCount, roseCount, whiteCount);
      
      // Safety Fallback
      if (maxColor === 0) return resolve('Yellow');

      // Return the absolutely dominant metal color found in the pixels
      if (maxColor === whiteCount) resolve('White');
      else if (maxColor === roseCount) resolve('Rose');
      else resolve('Yellow');
    };
    
    img.onerror = (e) => {
      console.error("Canvas Image Load Error:", e);
      resolve('Yellow');
    };
    img.src = imageUrl;
  });
};

/**
 * Programmatic View Angle Detection Engine
 * Uses Geometry (Bounding Boxes) and Skin-Tone Hue Analysis to guess the view angle.
 */
export const detectViewAngleAlgorithmically = async (imageUrl: string): Promise<'Front' | 'Photoshoot' | 'Lifestyle' | 'Right Side' | 'Side' | 'Infographic'> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('Front');

      // Use a slightly larger canvas to accurately detect thin lines (infographics)
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      
      let minX = size, maxX = 0, minY = size, maxY = 0;
      let nonWhitePixels = 0;
      let skinTonePixels = 0;
      let backgroundPixels = 0;
      let complexBackgroundPixels = 0;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 128) continue; // Ignore transparent

          const isWhite = r > 240 && g > 240 && b > 240;

          // Background Check (Outer 10% border of the image)
          if (x < 20 || x > size - 20 || y < 20 || y > size - 20) {
            backgroundPixels++;
            if (!isWhite) complexBackgroundPixels++;
          }

          if (!isWhite) {
            nonWhitePixels++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;

            const [h, s, l] = rgbToHsl(r, g, b);
            
            // Human Skin Tone Heuristic (Hue: 8-30, Saturation: > 15%, Lightness: 25-85%)
            if (h >= 8 && h <= 30 && s >= 15 && l >= 25 && l <= 85) {
              skinTonePixels++;
            }
          }
        }
      }

      // If the image is completely blank, default to Front
      if (nonWhitePixels === 0) return resolve('Front');

      // 1. Scene Detection (Lifestyle vs Photoshoot vs Studio White)
      const isComplexBackground = (complexBackgroundPixels / backgroundPixels) > 0.3; // If 30%+ of the border is NOT white
      
      if (isComplexBackground) {
        // Does it have a lot of skin tones? (e.g. human hand wearing the ring)
        const skinToneRatio = skinTonePixels / nonWhitePixels;
        if (skinToneRatio > 0.12) { // If > 12% of the content is skin colored
          return resolve('Lifestyle');
        }
        return resolve('Photoshoot');
      }

      // 2. Geometry Detection (Pure White Background)
      const boxWidth = Math.max(1, maxX - minX);
      const boxHeight = Math.max(1, maxY - minY);
      const boundingBoxArea = boxWidth * boxHeight;
      const aspectRatio = boxWidth / boxHeight;
      const pixelDensity = nonWhitePixels / boundingBoxArea;

      // Infographics are huge bounding boxes with lots of white space/text inside
      if (pixelDensity < 0.20) {
        return resolve('Infographic');
      }

      // Side View (Very tall or very wide)
      if (aspectRatio < 0.65 || aspectRatio > 1.8) {
        return resolve('Side');
      }

      // Front View (Round rings usually have tall drop shadows extending their height)
      if (aspectRatio >= 0.65 && aspectRatio <= 0.98) {
        return resolve('Front');
      }

      // Right Side View (Angled/Perspective rings are wider than they are tall)
      return resolve('Right Side');
    };
    
    img.onerror = () => resolve('Front');
    img.src = imageUrl;
  });
};
