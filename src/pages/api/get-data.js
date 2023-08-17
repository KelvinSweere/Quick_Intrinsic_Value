import yahooFinance from 'yahoo-finance2';

export default async (req, res) => {
  const { stockSymbol } = req.query;

  try {
    const result = await yahooFinance.quoteSummary(stockSymbol, {
      modules: ['price', 'defaultKeyStatistics', 'earningsTrend'],
    });
    const pricePerShare = result.price.regularMarketPrice;
    const earningsPerShare = result.defaultKeyStatistics.trailingEps;
    const growthRate = result.earningsTrend.trend?.find(
      (x) => x.period === '+5y'
    )?.growth;
    const currentYieldOfBond = 2.57;

    return res.status(200).json({
      pricePerShare,
      earningsPerShare,
      growthRate,
      currentYieldOfBond,
    });
  } catch (error) {
    console.log('error ', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch data from Yahoo Finance' });
  }
};
