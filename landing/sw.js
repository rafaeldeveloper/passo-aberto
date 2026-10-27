self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  await self.registration.unregister();
  const clientes = await self.clients.matchAll({ type: 'window' });
  clientes.forEach((c) => c.navigate(c.url));
});
