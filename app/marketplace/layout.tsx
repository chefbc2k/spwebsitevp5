export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">NFT Marketplace</h1>
      {children}
    </div>
  );
}