const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./app/api', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes("session.user.role !== 'ADMIN'")) {
      content = content.replace(/if \(!session \|\| session\.user\.role !== 'ADMIN'\) \{/g, "if (!session || !session.user || (session.user as any).role !== 'ADMIN') {");
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
