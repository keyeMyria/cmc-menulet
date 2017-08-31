import React from 'react'
import PropTypes from 'prop-types'
import Numeral from 'numeral'

const countTrailingZeroes = (numString) => {
  let numZeroes = 0
  for (const digit of numString.split('').reverse()) {
    if (digit == 0) ++numZeroes
    else return numZeroes
  }
  return numZeroes
}

const countLeadingZeroes = (numString) => {
  let numZeroes = 0
  for (const digit of numString.split('')) {
    if (digit == 0) ++numZeroes
    else return numZeroes
  }
  return numZeroes
}


const PrettySize = ({ amount, format }) => {
  const formattedSize = Numeral(amount).format(format)

  if (amount === 0) return <span className="gray-7">{formattedSize}</span>
  // count trailing zeroes
  const numLeadingZeroes = countLeadingZeroes(formattedSize)
  const numTrailingZeroes = countTrailingZeroes(formattedSize)
  // get digit arrays before and after decimal
  const [
    digitsBeforeDecimal,
    digitsAfterDecimal = [],
  ] = formattedSize.split('.').map(str => str.split(''))

  const leadingZeroes = digitsBeforeDecimal.splice(
    digitsBeforeDecimal.length - numLeadingZeroes,
  )

  const trailingZeroes = digitsAfterDecimal.splice(
    digitsAfterDecimal.length - numTrailingZeroes,
  )

  return (
    <span>
      <span className="gray-7">{leadingZeroes}</span>
      <span className="gray-5">{digitsBeforeDecimal}</span>
      <span className="gray-6">.{digitsAfterDecimal}</span>
      <span className="gray-7">{trailingZeroes}</span>
    </span>
  )
}

PrettySize.propTypes = {
  // amount: PropTypes.number,
  format: PropTypes.string,
}

PrettySize.defaultProps = {
  format: '0,0.000000',
}
export default PrettySize
