import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const baseDir = path.join(process.cwd(), 'AI_MOM_Backups');
        
        const categories = [
            { id: 'daily_progress', name: 'Daily Progress' },
            { id: 'healthy_conversations', name: 'Healthy Conversations' },
            { id: 'finalized_outcomes', name: 'Finalized Outcomes' },
        ];

        let results = [];

        for (const cat of categories) {
            const catPath = path.join(baseDir, cat.id);
            if (fs.existsSync(catPath)) {
                const files = fs.readdirSync(catPath);
                for (const file of files) {
                    if (file.endsWith('.md')) {
                        const filePath = path.join(catPath, file);
                        const stats = fs.statSync(filePath);
                        const content = fs.readFileSync(filePath, 'utf-8');
                        
                        results.push({
                            id: `${cat.id}-${file}`,
                            filename: file,
                            category: cat.id,
                            categoryName: cat.name,
                            content: content,
                            lastModified: stats.mtime,
                        });
                    }
                }
            }
        }

        // Sort by last modified descending
        results.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

        return NextResponse.json({ success: true, data: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
