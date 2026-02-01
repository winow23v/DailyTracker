async function getMockExchangeRate() {
  // In a real application, you would fetch this from an API.
  return {
    from: 'USD',
    to: 'KRW',
    rate: 1300.00,
  }
}

export default async function ExchangeRate() {
  const exchangeRate = await getMockExchangeRate()

  return (
    <div>
      <h4>Current Exchange Rate</h4>
      <p>1 {exchangeRate.from} = {exchangeRate.rate} {exchangeRate.to}</p>
    </div>
  )
}
