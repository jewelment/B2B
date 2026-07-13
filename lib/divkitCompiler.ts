export type ComponentType = 'HeroBanner' | 'ProductCarousel' | 'TextBlock' | 'BentoGrid' | 'ProductGrid';

export interface SDUIComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

export function compileToDivKit(components: SDUIComponent[]): any {
  const items = components.map(comp => {
    switch (comp.type) {
      case 'HeroBanner':
        return {
          type: "container",
          orientation: "vertical",
          background: [
            {
              type: "image",
              image_url: comp.props.imageUrl || "https://placehold.co/800x600/2a1b12/FFF?text=Hero+Image",
              content_alignment_vertical: "center",
              content_alignment_horizontal: "center",
              scale: "fill"
            }
          ],
          items: [
            {
              type: "text",
              text: comp.props.title || "Hero Title",
              font_size: 28,
              font_weight: "bold",
              text_color: "#ffffff",
              text_alignment_horizontal: "center",
              margins: { bottom: 8, top: 40 }
            },
            {
              type: "text",
              text: comp.props.subtitle || "Hero Subtitle",
              font_size: 16,
              text_color: "#dddddd",
              text_alignment_horizontal: "center",
              margins: { bottom: 24 }
            },
            ...(comp.props.buttonText ? [{
              type: "text",
              text: comp.props.buttonText,
              font_size: 14,
              font_weight: "bold",
              text_color: "#000000",
              background: [{ type: "solid", color: "#ffffff" }],
              paddings: { left: 24, right: 24, top: 12, bottom: 12 },
              border: { corner_radius: 8 },
              margins: { bottom: 40 },
              width: { type: "wrap_content" },
              alignment_horizontal: "center"
            }] : [])
          ]
        };

      case 'TextBlock':
        return {
          type: "text",
          text: comp.props.content || "Text Content",
          font_size: 16,
          text_color: "#333333",
          text_alignment_horizontal: comp.props.align || "center",
          margins: { top: 16, bottom: 16, left: 16, right: 16 }
        };

      case 'ProductCarousel':
      case 'BentoGrid':
      case 'ProductGrid':
        // Fallback for complex data grids for now
        return {
          type: "container",
          orientation: "vertical",
          background: [{ type: "solid", color: "#f8f9fa" }],
          margins: { top: 16, bottom: 16, left: 16, right: 16 },
          paddings: { top: 16, bottom: 16, left: 16, right: 16 },
          border: { corner_radius: 12 },
          items: [
            {
              type: "text",
              text: comp.props.title || comp.type,
              font_size: 18,
              font_weight: "bold",
              margins: { bottom: 16 }
            },
            {
              type: "text",
              text: `[${comp.type} Native Render Placeholder]`,
              font_size: 14,
              text_color: "#666666"
            }
          ]
        };
      
      default:
        return {
          type: "text",
          text: "Unknown Component"
        };
    }
  });

  return {
    templates: {},
    card: {
      log_id: "layout_card",
      states: [
        {
          state_id: 0,
          div: {
            type: "container",
            orientation: "vertical",
            items: items.length > 0 ? items : [{ type: "text", text: "Empty Layout", paddings: { top: 20, bottom: 20 }, text_alignment_horizontal: "center" }]
          }
        }
      ]
    }
  };
}
