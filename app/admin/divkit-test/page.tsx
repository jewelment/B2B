"use client";

import React from 'react';
// @ts-ignore
import { DivKit } from '@divkitframework/react';

const mockJson = {
  templates: {},
  card: {
    log_id: "test_card",
    states: [
      {
        state_id: 0,
        div: {
          type: "container",
          orientation: "vertical",
          items: [
            {
              type: "text",
              text: "Hello DivKit!",
              font_size: 24,
              font_weight: "bold",
              text_color: "#1a1a1a",
              margins: {
                bottom: 16
              }
            },
            {
              type: "text",
              text: "This is a test of the Server-Driven UI engine.",
              font_size: 16,
              text_color: "#666666"
            }
          ]
        }
      }
    ]
  }
};

export default function DivKitTest() {
  return (
    <div className="min-h-screen bg-slate-50 p-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-10">DivKit Rendering Engine Test</h1>
      
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
        <DivKit
          div={mockJson.card.states[0].div}
          logId={mockJson.card.log_id}
          actionHandler={(action: any) => console.log('Action triggered:', action)}
        />
      </div>
    </div>
  );
}
