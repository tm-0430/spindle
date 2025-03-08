export async function getWormholeSupportedChains() {
  const response = await fetch(
    "https://wormhole-v2-api-proxy.polymarket.com/v2/chains",
  );
  const data = await response.json();
  return data;
}
