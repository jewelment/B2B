import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Git Sync is only available in development mode.' }, { status: 403 });
  }

  const projectRoot = process.cwd();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendLog = (message: string, status: 'INFO' | 'SUCCESS' | 'ERROR' = 'INFO') => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message, status })}\n\n`));
      };

      const runCommand = (command: string, args: string[]): Promise<void> => {
        return new Promise((resolve, reject) => {
          const child = spawn(command, args, { cwd: projectRoot, shell: true });
          
          child.stdout.on('data', (data) => {
            const text = data.toString().trim();
            if (text) sendLog(text);
          });
          
          child.stderr.on('data', (data) => {
            const text = data.toString().trim();
            if (text) sendLog(text); // git outputs progress to stderr usually
          });

          child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command exited with code ${code}`));
          });
        });
      };

      try {
        sendLog('Initializing Git Synchronization...', 'INFO');
        
        sendLog('> git add .', 'INFO');
        await runCommand('git', ['add', '.']);
        sendLog('Changes staged successfully.', 'SUCCESS');

        sendLog('> git commit -m "Automated sync from B2B Admin Portal CTA"', 'INFO');
        try {
          await runCommand('git', ['commit', '-m', '"Automated sync from B2B Admin Portal CTA"']);
          sendLog('Changes committed successfully.', 'SUCCESS');
        } catch (e: any) {
          // It might just be nothing to commit, we can proceed
          sendLog('No new changes to commit, or commit failed. Proceeding to push...', 'INFO');
        }

        sendLog('> git push origin main', 'INFO');
        await runCommand('git', ['push', 'origin', 'main']);
        
        sendLog('Project successfully synced to GitHub!', 'SUCCESS');
      } catch (error: any) {
        sendLog(`Git Sync Failed: ${error.message}`, 'ERROR');
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
