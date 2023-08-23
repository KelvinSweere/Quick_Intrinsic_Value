import yahooFinance from 'yahoo-finance2';

export default async (req, res) => {
  const { stockSymbol } = req.query;

  try {
    const result = await yahooFinance.quoteSummary(stockSymbol, {
      modules: [
        'price',
        'defaultKeyStatistics',
        'earningsTrend',
        'summaryDetail',
        'financialData',
        'cashflowStatementHistoryQuarterly',
        'balanceSheetHistory',
        'balanceSheetHistoryQuarterly',
      ],
    });

    const freeCashFlow =
      result?.cashflowStatementHistoryQuarterly?.cashflowStatements?.[0]
        .totalCashFromOperatingActivities +
      result?.cashflowStatementHistoryQuarterly?.cashflowStatements?.[0]
        .capitalExpenditures;

    const cash =
      (result?.balanceSheetHistoryQuarterly?.balanceSheetStatements?.[0]
        ?.cash || 0) +
      (result?.balanceSheetHistoryQuarterly?.balanceSheetStatements?.[0]
        ?.shortTermInvestments || 0);

    const debt =
      result?.balanceSheetHistoryQuarterly?.balanceSheetStatements?.[0]
        .longTermDebt +
      result?.balanceSheetHistoryQuarterly?.balanceSheetStatements?.[0]
        .shortLongTermDebt;

    const sharesOutstanding = result?.defaultKeyStatistics?.sharesOutstanding;

    const growthRate = result.earningsTrend.trend?.find(
      (x) => x.period === '+5y'
    )?.growth;
    const pricePerShare = result.price.regularMarketPrice;
    const earningsPerShare = result.defaultKeyStatistics.trailingEps;
    const currentYieldOfBond = 2.57;
    const currencySymbol = result.price.currencySymbol;
    const dividendYield = result.summaryDetail.dividendYield ?? 0;
    const peRation = result.summaryDetail.trailingPE;
    const perpetualGrowthRate = 3.0;

    const isInvalid = growthRate === null || peRation === null;

    const equity = result?.price?.marketCap;

    const costOfEquity = 0.1;
    const costOfDebt = 0.05;
    const taxRate = 0.3;
    const totalCapital = equity + debt;
    const wacc =
      (equity / totalCapital) * costOfEquity +
      (debt / totalCapital) * costOfDebt * (1 - taxRate);

    return res.status(200).json({
      pricePerShare,
      earningsPerShare,
      growthRate: (growthRate * 100).toFixed(2),
      currentYieldOfBond,
      currencySymbol,
      dividendYield: (dividendYield * 100).toFixed(2),
      peRation,
      freeCashFlow,
      cash,
      debt,
      sharesOutstanding,
      perpetualGrowthRate,
      wacc: (wacc * 100).toFixed(2),
      isInvalid,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Failed to fetch data from Yahoo Finance' });
  }
};
