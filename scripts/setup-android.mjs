import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const manifest = 'android/app/src/main/AndroidManifest.xml';

if (!existsSync('android')) {
  console.log('Criando a plataforma Android...');
  execSync('npx cap add android', { stdio: 'inherit' });
}

if (!existsSync(manifest)) {
  console.error('Não encontrei o AndroidManifest.xml. Verifique se a plataforma Android foi criada.');
  process.exit(1);
}

let xml = readFileSync(manifest, 'utf8');
const permissions = [
  '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />'
];

for (const permission of permissions) {
  const name = permission.match(/android:name="([^"]+)"/)[1];
  if (!xml.includes(name)) {
    xml = xml.replace(/<manifest([^>]*)>/, `<manifest$1>\n${permission}`);
  }
}

writeFileSync(manifest, xml);
console.log('Permissões de localização configuradas no AndroidManifest.xml.');
execSync('npx cap sync android', { stdio: 'inherit' });
console.log('Android configurado e sincronizado com sucesso.');
