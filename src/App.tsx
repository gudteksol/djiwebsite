import { useEffect, useState } from 'react';

interface TokenData {
  priceUsd: string;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  fdv: number;
  txns24h: { buys: number; sells: number };
  pairCreatedAt: number;
}

function App() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/27mrWZe7PDr7ecQgN2vKUeegwD5ZXiyKcqXDpJFMpump');
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          setTokenData({
            priceUsd: pair.priceUsd,
            priceChange24h: pair.priceChange?.h24 || 0,
            marketCap: pair.marketCap || 0,
            volume24h: pair.volume?.h24 || 0,
            liquidity: pair.liquidity?.usd || 0,
            fdv: pair.fdv || 0,
            txns24h: {
              buys: pair.txns?.h24?.buys || 0,
              sells: pair.txns?.h24?.sells || 0
            },
            pairCreatedAt: pair.pairCreatedAt || 0
          });
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: string) => {
    const priceNum = parseFloat(price);
    if (priceNum < 0.00001) return `$${priceNum.toExponential(2)}`;
    return `$${priceNum.toFixed(6)}`;
  };

  const getDaysOld = (timestamp: number) => {
    const days = Math.floor((Date.now() / 1000 - timestamp) / 86400);
    return `${days}d old`;
  };

  const priceChangeColor = (change: number) => change >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white overflow-hidden py-3 border-b border-gray-800">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {tokenData ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex gap-8">
                    <span className="ticker-item">PRICE: <span className={priceChangeColor(tokenData.priceChange24h)}>{formatPrice(tokenData.priceUsd)}</span> <span className={priceChangeColor(tokenData.priceChange24h)}>{tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%</span></span>
                    <span className="ticker-item">MARKET CAP: <span className={priceChangeColor(tokenData.priceChange24h)}>{formatNumber(tokenData.marketCap)}</span></span>
                    <span className="ticker-item">24H VOLUME: <span className="text-gray-400">{formatNumber(tokenData.volume24h)}</span></span>
                    <span className="ticker-item">LIQUIDITY: <span className="text-yellow-500">{formatNumber(tokenData.liquidity)}</span></span>
                    <span className="ticker-item">FDV: <span className="text-gray-400">{formatNumber(tokenData.fdv)}</span> <span className="text-gray-400">{getDaysOld(tokenData.pairCreatedAt)}</span></span>
                    <span className="ticker-item">TXNS 24H: <span className="text-gray-400">{tokenData.txns24h.buys} / {tokenData.txns24h.sells}</span></span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[...Array(4)].map((_, index) => (
                  <span key={index} className="ticker-item">Loading token data...</span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <img src="/doggggg.png" alt="DJI Logo" className="w-14 h-14 object-cover rounded-full" />
        </div>

        <div className="flex items-center gap-8">
          <a href="#gallery" className="text-gray-800 hover:text-gray-600 font-medium transition-colors">
            GALLERY
          </a>
          <a href="#chart" className="text-gray-800 hover:text-gray-600 font-medium transition-colors">
            CHART
          </a>
          <a href="https://x.com/i/communities/2013073791119986800" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 font-medium transition-colors">
            COMMUNITY
          </a>
          <a href="https://pump.fun/coin/27mrWZe7PDr7ecQgN2vKUeegwD5ZXiyKcqXDpJFMpump" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-full transition-colors">
            BUY $DJI
          </a>
        </div>
      </nav>

      <main className="flex flex-col items-center px-8 py-32">
        <div className="text-center mb-24">
          <h1 className="text-[120px] font-black text-gray-900 leading-none tracking-tight mb-4">
            $DJI
          </h1>
          <p className="text-2xl text-gray-700 font-semibold mb-16">
            Dawg Jones Industrial Average
          </p>
          <a href="https://pump.fun/coin/27mrWZe7PDr7ecQgN2vKUeegwD5ZXiyKcqXDpJFMpump" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-12 py-4 rounded-full transition-all transform hover:scale-105 inline-block">
            BUY $DJI
          </a>
        </div>

        <section id="chart" className="w-full max-w-6xl mb-32">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Live Chart</h2>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-gray-900">
            <iframe
              src="https://dexscreener.com/solana/27mrWZe7PDr7ecQgN2vKUeegwD5ZXiyKcqXDpJFMpump?embed=1&theme=dark"
              className="w-full h-[600px]"
              title="DexScreener Chart"
            />
          </div>
        </section>

        <section id="gallery" className="w-full mb-32">
          <h2 className="text-5xl font-black text-gray-900 text-center mb-4">THE MEME EXHIBIT</h2>
          <p className="text-xl text-gray-600 text-center mb-16">A curated collection of legendary moments</p>

          <div className="gallery-carousel-wrapper">
            <div className="gallery-carousel-content">
              {[...Array(3)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-12">
                  <div className="group cursor-pointer flex-shrink-0">
                    <div className="bg-white p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all w-[400px]">
                      <div className="border-[6px] border-[#8B7355] p-4">
                        <div className="bg-[#F5F5DC] p-6">
                          <img src="/johnny_pfp_-_2026-01-18t192738.889.png" alt="Golf DJI" className="w-full aspect-square object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group cursor-pointer flex-shrink-0">
                    <div className="bg-white p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all w-[400px]">
                      <div className="border-[6px] border-[#8B7355] p-4">
                        <div className="bg-[#F5F5DC] p-6">
                          <img src="/johnny_pfp_-_2026-01-18t192722.533.png" alt="Space DJI" className="w-full aspect-square object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group cursor-pointer flex-shrink-0">
                    <div className="bg-white p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all w-[400px]">
                      <div className="border-[6px] border-[#8B7355] p-4">
                        <div className="bg-[#F5F5DC] p-6">
                          <img src="/johnny_pfp_-_2026-01-18t192809.612.png" alt="Gaming DJI" className="w-full aspect-square object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group cursor-pointer flex-shrink-0">
                    <div className="bg-white p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all w-[400px]">
                      <div className="border-[6px] border-[#8B7355] p-4">
                        <div className="bg-[#F5F5DC] p-6">
                          <img src="/johnny_pfp_-_2026-01-18t193712.834.png" alt="Tennis DJI" className="w-full aspect-square object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
